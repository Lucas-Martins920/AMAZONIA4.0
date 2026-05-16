from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import cv2
import numpy as np


CLASSES_AMBIENTAIS = {
    "queimada": "Queimada",
    "solo_exposto": "Solo exposto",
    "mata_ciliar_degradada": "Mata ciliar degradada",
    "perda_vegetacao": "Perda de vegetação nativa",
    "vegetacao_preservada": "Vegetação preservada",
}


@dataclass
class ResultadoAnalise:
    classe: str
    confianca: float
    metodo: str
    explicacao: str
    metricas: dict[str, float]
    deteccoes: list[dict[str, Any]]

    def to_dict(self) -> dict[str, Any]:
        return {
            "classe": self.classe,
            "confianca": round(self.confianca, 3),
            "metodo": self.metodo,
            "explicacao": self.explicacao,
            "metricas": {chave: round(valor, 3) for chave, valor in self.metricas.items()},
            "deteccoes": self.deteccoes,
        }


class CameraIA:
    """Analisa imagens ambientais com YOLO opcional e fallback OpenCV.

    O YOLO so deve ser considerado "real" quando existir um modelo treinado
    para as classes ambientais do projeto. Sem esse arquivo, o sistema usa
    heuristicas de cor/textura para demonstracao.
    """

    def __init__(self, modelo_yolo: str | Path | None = None) -> None:
        self.modelo_yolo = Path(modelo_yolo) if modelo_yolo else None
        self.yolo = self._carregar_yolo(self.modelo_yolo)

    def analisar_arquivo(self, caminho_imagem: str | Path) -> ResultadoAnalise:
        imagem = cv2.imread(str(caminho_imagem))
        if imagem is None:
            raise ValueError(f"Nao foi possivel abrir a imagem: {caminho_imagem}")
        return self.analisar_imagem(imagem)

    def analisar_bytes(self, conteudo: bytes) -> ResultadoAnalise:
        buffer = np.frombuffer(conteudo, dtype=np.uint8)
        imagem = cv2.imdecode(buffer, cv2.IMREAD_COLOR)
        if imagem is None:
            raise ValueError("Arquivo enviado nao parece ser uma imagem valida.")
        return self.analisar_imagem(imagem)

    def analisar_imagem(self, imagem_bgr: np.ndarray) -> ResultadoAnalise:
        if self.yolo is not None:
            resultado_yolo = self._analisar_com_yolo(imagem_bgr)
            if resultado_yolo is not None:
                return resultado_yolo
        return self._analisar_com_opencv(imagem_bgr)

    def _carregar_yolo(self, modelo_yolo: Path | None) -> Any | None:
        if modelo_yolo is None or not modelo_yolo.exists():
            return None

        try:
            from ultralytics import YOLO
        except ImportError:
            return None

        return YOLO(str(modelo_yolo))

    def _analisar_com_yolo(self, imagem_bgr: np.ndarray) -> ResultadoAnalise | None:
        resultados = self.yolo(imagem_bgr, verbose=False)
        deteccoes: list[dict[str, Any]] = []

        for resultado in resultados:
            nomes = resultado.names
            for caixa in resultado.boxes:
                classe_id = int(caixa.cls[0])
                nome_classe = nomes.get(classe_id, str(classe_id))
                confianca = float(caixa.conf[0])
                deteccoes.append(
                    {
                        "classe": nome_classe,
                        "confianca": round(confianca, 3),
                        "caixa": [round(float(valor), 2) for valor in caixa.xyxy[0].tolist()],
                    }
                )

        if not deteccoes:
            return None

        principal = max(deteccoes, key=lambda item: item["confianca"])
        classe = CLASSES_AMBIENTAIS.get(principal["classe"], principal["classe"])
        return ResultadoAnalise(
            classe=classe,
            confianca=float(principal["confianca"]),
            metodo="YOLO",
            explicacao="Classificacao feita por modelo YOLO treinado para classes ambientais do projeto.",
            metricas={},
            deteccoes=deteccoes,
        )

    def _analisar_com_opencv(self, imagem_bgr: np.ndarray) -> ResultadoAnalise:
        imagem = cv2.resize(imagem_bgr, (640, 640))
        hsv = cv2.cvtColor(imagem, cv2.COLOR_BGR2HSV)
        cinza = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)

        vegetacao = self._percentual_mascara(hsv, np.array([35, 35, 35]), np.array([95, 255, 255]))
        solo = self._percentual_mascara(hsv, np.array([8, 35, 45]), np.array([32, 210, 230]))
        cinzas = self._percentual_mascara(hsv, np.array([0, 0, 20]), np.array([180, 55, 135]))
        agua = self._percentual_mascara(hsv, np.array([85, 20, 35]), np.array([130, 255, 255]))
        textura = float(cv2.Laplacian(cinza, cv2.CV_64F).var()) / 1000

        metricas = {
            "vegetacao": vegetacao,
            "solo_exposto": solo,
            "cinzas_ou_queimada": cinzas,
            "agua": agua,
            "textura": min(textura, 1.0),
        }

        classe, confianca, explicacao = self._classificar_metricas(metricas)
        return ResultadoAnalise(
            classe=classe,
            confianca=confianca,
            metodo="OpenCV heuristico",
            explicacao=explicacao,
            metricas=metricas,
            deteccoes=[],
        )

    def _percentual_mascara(self, hsv: np.ndarray, minimo: np.ndarray, maximo: np.ndarray) -> float:
        mascara = cv2.inRange(hsv, minimo, maximo)
        return float(np.count_nonzero(mascara)) / float(mascara.size)

    def _classificar_metricas(self, metricas: dict[str, float]) -> tuple[str, float, str]:
        vegetacao = metricas["vegetacao"]
        solo = metricas["solo_exposto"]
        cinzas = metricas["cinzas_ou_queimada"]
        agua = metricas["agua"]

        if cinzas > 0.28 and vegetacao < 0.25:
            return (
                "Queimada",
                min(0.55 + cinzas, 0.95),
                "A imagem tem grande presenca de tons escuros/cinza e baixa cobertura verde, sugerindo queimada.",
            )

        if agua > 0.08 and vegetacao < 0.22 and solo > 0.16:
            return (
                "Mata ciliar degradada",
                min(0.55 + agua + solo, 0.93),
                "Ha sinal de agua junto de baixa vegetacao e solo aparente, indicando risco em margem de rio.",
            )

        if solo > 0.24 and vegetacao < 0.28:
            return (
                "Solo exposto",
                min(0.5 + solo, 0.9),
                "A proporcao de solo aparente e maior que a cobertura vegetal, sugerindo erosao ou area degradada.",
            )

        if vegetacao < 0.32:
            return (
                "Perda de vegetação nativa",
                0.62,
                "A cobertura verde parece baixa para uma area natural, sugerindo perda de vegetacao.",
            )

        return (
            "Vegetação preservada",
            min(0.58 + vegetacao, 0.94),
            "A imagem apresenta cobertura vegetal predominante e poucos sinais visuais de degradacao.",
        )
