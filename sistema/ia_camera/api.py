from __future__ import annotations

import os
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

try:
    from supabase import create_client
except ImportError:
    create_client = None

from camera_ia import CameraIA


BASE_DIR = Path(__file__).resolve().parent
MODELO_PADRAO = BASE_DIR.parent / "modelos" / "amazonia_yolo.pt"

app = Flask(__name__)
CORS(app)

modelo = os.environ.get("AMAZONIA40_YOLO_MODEL", str(MODELO_PADRAO))
camera_ia = CameraIA(modelo)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if create_client and SUPABASE_URL and SUPABASE_KEY else None


def salvar_analise_ambiental(resultado: dict) -> str | None:
    if create_client is None:
        return "Biblioteca supabase nao instalada. Rode pip install -r requirements.txt."

    if supabase is None:
        return "Supabase nao configurado. Defina SUPABASE_URL e SUPABASE_KEY para salvar a analise."

    payload = {
        "classe_detectada": resultado.get("classe"),
        "confianca": resultado.get("confianca"),
        "metricas": resultado.get("metricas", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    try:
        supabase.table("analises_ambientais").insert(payload).execute()
    except Exception as erro:
        return f"Analise processada, mas nao foi salva no Supabase: {erro}"

    return None


def gerar_pdf_relatorio(dados: dict) -> BytesIO:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import cm
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    buffer = BytesIO()
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="Relatorio de Diagnostico - Amazonia 4.0",
    )

    title_style = styles["Title"]
    title_style.textColor = colors.HexColor("#1b4332")
    normal = styles["BodyText"]

    rows = [
        ("Bioma identificado", dados.get("bioma_identificado", "Nao informado")),
        ("Nivel de degradacao", dados.get("nivel_degradacao", "Nao informado")),
        ("Especie recomendada", dados.get("especie_recomendada", "Nao informado")),
        ("Justificativa", dados.get("justificativa", "Nao informado")),
        ("Acoes imediatas", dados.get("acoes_imediatas", "Nao informado")),
    ]

    table = Table(
        [[Paragraph(f"<b>{label}</b>", normal), Paragraph(str(value), normal)] for label, value in rows],
        colWidths=[5 * cm, 10 * cm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#d8f3dc")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#0f291e")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c8d5cc")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )

    story = [
        Paragraph("Relatorio de Diagnostico - Amazonia 4.0", title_style),
        Spacer(1, 0.8 * cm),
        Paragraph(
            f"Documento gerado em {datetime.now(timezone.utc).strftime('%d/%m/%Y %H:%M UTC')}.",
            normal,
        ),
        Spacer(1, 0.6 * cm),
        table,
    ]
    doc.build(story)
    buffer.seek(0)
    return buffer


@app.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "modelo_yolo_configurado": bool(camera_ia.yolo),
            "modelo_esperado": str(modelo),
            "supabase_configurado": supabase is not None,
        }
    )


@app.post("/analisar")
def analisar():
    if "imagem" not in request.files:
        return jsonify({"erro": "Envie uma imagem no campo 'imagem'."}), 400

    arquivo = request.files["imagem"]
    if not arquivo.filename:
        return jsonify({"erro": "Arquivo sem nome."}), 400

    try:
        resultado = camera_ia.analisar_bytes(arquivo.read())
    except ValueError as erro:
        return jsonify({"erro": str(erro)}), 400

    resposta = resultado.to_dict()
    aviso_supabase = salvar_analise_ambiental(resposta)
    if aviso_supabase:
        resposta["aviso_supabase"] = aviso_supabase

    return jsonify(resposta)


@app.post("/gerar-relatorio-pdf")
def gerar_relatorio_pdf():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({"erro": "Envie um JSON valido com os dados do relatorio."}), 400

    campos_obrigatorios = [
        "bioma_identificado",
        "nivel_degradacao",
        "especie_recomendada",
        "justificativa",
        "acoes_imediatas",
    ]
    campos_faltando = [campo for campo in campos_obrigatorios if not dados.get(campo)]
    if campos_faltando:
        return jsonify({"erro": "Campos obrigatorios ausentes.", "campos": campos_faltando}), 400

    try:
        pdf = gerar_pdf_relatorio(dados)
    except ImportError:
        return jsonify({"erro": "Biblioteca reportlab nao instalada. Rode pip install -r requirements.txt."}), 500

    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="relatorio_diagnostico_amazonia40.pdf",
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
