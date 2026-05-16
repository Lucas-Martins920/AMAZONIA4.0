# Câmera IA - Amazônia 4.0

Esta pasta contém a base Python para a câmera com IA do projeto.

## Estado atual

A câmera IA tem duas camadas:

1. **OpenCV heurístico:** funciona sem modelo treinado e classifica sinais visuais simples por cor/textura.
2. **YOLO opcional:** funciona quando existir um arquivo de modelo treinado, por exemplo `sistema/modelos/amazonia_yolo.pt`.

Importante: YOLO não reconhece automaticamente "queimada", "solo exposto" ou "mata ciliar degradada" só por instalar a biblioteca. Para isso, é necessário treinar um modelo com imagens rotuladas dessas classes.

## Instalação

```bash
cd sistema/ia_camera
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Rodar a API

```bash
python api.py
```

Depois, testar:

```bash
curl http://127.0.0.1:5000/health
```

## Analisar imagem

```bash
curl -X POST http://127.0.0.1:5000/analisar \
  -F "imagem=@/caminho/para/imagem.jpg"
```

## Classes ambientais planejadas

- `queimada`
- `solo_exposto`
- `mata_ciliar_degradada`
- `perda_vegetacao`
- `vegetacao_preservada`

## Como ativar YOLO real

1. Montar um dataset com imagens dos problemas ambientais.
2. Rotular as imagens em formato YOLO.
3. Treinar com Ultralytics.
4. Salvar o modelo como:

```text
sistema/modelos/amazonia_yolo.pt
```

5. Reiniciar a API.

Sem esse arquivo, a API usa OpenCV heurístico.
