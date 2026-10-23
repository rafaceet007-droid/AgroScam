from email.parser import BytesParser
from email.policy import default
import logging
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
from urllib.parse import urlsplit

from google import genai
from PIL import Image

MODEL = "gemini-2.5-flash"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = Path(__file__).with_name("catalogo_culturas_br.md")
MAX_IMAGES = 4
MAX_IMAGE_BYTES = 5 * 1024 * 1024
MAX_TOTAL_IMAGE_BYTES = 20 * 1024 * 1024
MAX_REQUEST_BYTES = 28 * 1024 * 1024
MAX_IMAGE_PIXELS = 25_000_000
ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP"}
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


class RequestValidationError(ValueError):
    pass


def analisar_imagens(imagens, pergunta):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("A variável de ambiente GEMINI_API_KEY não está configurada.")
    if not CATALOG_PATH.is_file():
        raise FileNotFoundError(f"Catálogo não encontrado: {CATALOG_PATH}")

    catalogo = CATALOG_PATH.read_text(encoding="utf-8")
    instrucoes = f"""
Você é um assistente de apoio à observação fitossanitária agrícola no Brasil.
Use o catálogo abaixo como referência inicial, não como lista completa nem como
prova de diagnóstico. Analise somente o que for visível na imagem.

Se houver sintomas, indique hipóteses compatíveis com a cultura informada,
explique quais sinais visuais sustentam cada hipótese e informe o que não é
possível concluir pela imagem. Não invente sintomas ou agentes. Se a cultura,
região ou contexto forem importantes e estiverem ausentes, solicite esses dados.
Quando as condições de cultivo forem relevantes, considere pH e textura do solo
somente se forem informados pelo usuário ou obtidos em análise; não tente estimá-los
pela imagem. Se necessário, pergunte por esses dados e não os trate como diagnóstico.
Não apresente hipótese como diagnóstico confirmado nem recomende aplicação de
defensivos. Sugira confirmação por profissional agrônomo quando necessário.

Organize a resposta em: observações visuais; cultura (se identificável);
hipóteses de doenças/pragas em ordem de compatibilidade; confiança qualitativa
e limitações; informações adicionais ou próximos passos seguros.

CATÁLOGO:
{catalogo}
"""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=MODEL,
        contents=[*imagens, instrucoes, f"Pergunta do usuário: {pergunta}"],
    )
    if not response.text:
        raise RuntimeError("O modelo não retornou uma resposta.")
    return response.text


def ler_requisicao(conteudo, tipo_conteudo):
    try:
        cabecalho = BytesParser(policy=default).parsebytes(
            f"Content-Type: {tipo_conteudo}\r\n\r\n".encode("ascii")
        )
    except UnicodeEncodeError as erro:
        raise RequestValidationError("O formulário enviado é inválido.") from erro

    if cabecalho.get_content_type() != "multipart/form-data":
        raise RequestValidationError("Envie os dados pelo formulário de perguntas e imagens.")
    boundary = cabecalho.get_boundary()
    if not boundary or len(boundary) > 200:
        raise RequestValidationError("O formulário enviado é inválido.")

    formulario = BytesParser(policy=default).parsebytes(
        f"Content-Type: {tipo_conteudo}\r\nMIME-Version: 1.0\r\n\r\n".encode("ascii")
        + conteudo
    )
    if not formulario.is_multipart():
        raise RequestValidationError("Não foi possível ler os campos do formulário.")

    pergunta = ""
    arquivos = []
    for parte in formulario.iter_parts():
        if parte.get_content_disposition() != "form-data":
            continue
        nome = parte.get_param("name", header="content-disposition")
        dados = parte.get_payload(decode=True) or b""
        if nome == "question":
            if parte.get_filename() is not None or pergunta:
                raise RequestValidationError("O campo da pergunta é inválido.")
            try:
                pergunta = dados.decode(parte.get_content_charset() or "utf-8")
            except (LookupError, UnicodeDecodeError) as erro:
                raise RequestValidationError("A pergunta contém texto inválido.") from erro
        elif nome == "images":
            if parte.get_filename() is None:
                raise RequestValidationError("Um arquivo de imagem é inválido.")
            arquivos.append((dados, parte.get_content_type()))
        else:
            raise RequestValidationError("O formulário contém um campo desconhecido.")

    if len(pergunta) > 2000:
        raise RequestValidationError("A pergunta deve ter até 2.000 caracteres.")
    pergunta = pergunta.strip()
    if len(arquivos) > MAX_IMAGES:
        raise RequestValidationError(f"Envie no máximo {MAX_IMAGES} imagens.")
    if not pergunta and not arquivos:
        raise RequestValidationError("Digite uma pergunta ou anexe uma imagem.")

    imagens = []
    total_bytes = 0
    formatos = {
        "image/jpeg": "JPEG",
        "image/png": "PNG",
        "image/webp": "WEBP",
    }
    try:
        for dados, tipo_mime in arquivos:
            formato_esperado = formatos.get(tipo_mime)
            if not formato_esperado:
                raise RequestValidationError("Use imagens JPEG, PNG ou WEBP.")

            total_bytes += len(dados)
            if len(dados) > MAX_IMAGE_BYTES or total_bytes > MAX_TOTAL_IMAGE_BYTES:
                raise RequestValidationError("O limite total é 20 MB e cada imagem pode ter até 5 MB.")

            try:
                with Image.open(BytesIO(dados)) as imagem:
                    if imagem.format not in ALLOWED_IMAGE_FORMATS or imagem.format != formato_esperado:
                        raise RequestValidationError("O conteúdo de uma imagem não corresponde ao formato informado.")
                    if imagem.width * imagem.height > MAX_IMAGE_PIXELS:
                        raise RequestValidationError("A imagem excede o limite de 25 megapixels.")
                    imagem.verify()
                imagem = Image.open(BytesIO(dados))
                imagem.load()
            except RequestValidationError:
                raise
            except (Image.DecompressionBombError, OSError, ValueError) as erro:
                raise RequestValidationError("Uma das imagens está danificada ou não é válida.") from erro
            imagens.append(imagem)
    except Exception:
        for imagem in imagens:
            imagem.close()
        raise

    return pergunta, imagens


class AgroScamHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def do_POST(self):
        if urlsplit(self.path).path != "/api/analyze":
            self.send_error(404)
            return

        content_length = self.headers.get("Content-Length")
        if content_length is None:
            self.enviar_texto(411, "Informe o tamanho do conteúdo enviado.")
            return
        try:
            body_size = int(content_length)
        except ValueError:
            self.enviar_texto(400, "Tamanho de requisição inválido.")
            return
        if body_size < 0 or body_size > MAX_REQUEST_BYTES:
            self.enviar_texto(413, "O envio excede o limite permitido.")
            return

        try:
            pergunta, imagens = ler_requisicao(
                self.rfile.read(body_size),
                self.headers.get("Content-Type", ""),
            )
        except RequestValidationError as erro:
            self.enviar_texto(400, str(erro))
            return

        if not os.getenv("GEMINI_API_KEY"):
            self.enviar_texto(503, "Configure GEMINI_API_KEY no terminal que iniciou o servidor.")
            return

        try:
            resposta = analisar_imagens(imagens, pergunta)
        except Exception:
            logging.exception("Falha ao solicitar análise ao Gemini.")
            self.enviar_texto(
                502,
                "Não foi possível obter uma análise da IA. Verifique a chave e tente novamente.",
            )
            return
        finally:
            for imagem in imagens:
                imagem.close()

        self.enviar_texto(200, resposta)

    def enviar_texto(self, status, conteudo):
        dados = conteudo.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(dados)


def iniciar_servidor():
    servidor = ThreadingHTTPServer(("127.0.0.1", 0), AgroScamHandler)
    porta = servidor.server_address[1]
    print(f"AgroScam disponível em http://127.0.0.1:{porta}/centrais/AgroScam.html")
    print("Use Ctrl+C para encerrar o servidor.")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
    finally:
        servidor.server_close()


if __name__ == "__main__":
    iniciar_servidor()
