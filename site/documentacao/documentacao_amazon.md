# Documentacao do Projeto Amazonia 4.0

## 1. Estado real do projeto

O projeto Amazonia 4.0 esta dividido em duas partes:

- **Protótipo web pronto:** site informativo, painel de alertas simulados, mapa visual, recomendacao de especies e simulador de IA no navegador.
- **Base Python adicionada:** estrutura inicial para camera com IA usando OpenCV e suporte opcional a YOLO.

O sistema web funciona como demonstracao. A camera IA real ainda depende de instalacao das bibliotecas Python e de um modelo YOLO treinado para as classes ambientais do projeto.

## 2. Arquivos principais

```text
site/
├── index.html
├── styles.css
├── app.js
├── imagem/
│   └── Pasted image.png
└── documentacao/
    └── documentacao_amazon.md

sistema/
├── index.html
├── data.js
├── recomendador.js
├── modelos/
│   └── README.md
└── ia_camera/
    ├── README.md
    ├── requirements.txt
    ├── camera_ia.py
    └── api.py
```

## 3. Site informativo

O site fica em:

```text
site/index.html
```

Ele apresenta:

- Nome e proposta do projeto.
- Quatro biomas: Amazonia, Cerrado, Caatinga e Mata Atlantica.
- Problemas ambientais e impactos humanos.
- Painel de monitoramento.
- Simulador visual de camera com IA.
- Roadmap do projeto.

## 4. Sistema interativo

O sistema usa:

```text
sistema/data.js
sistema/recomendador.js
site/app.js
```

Ele permite:

- Selecionar alertas simulados.
- Ver bioma, solo, degradacao e impacto humano.
- Gerar recomendacao de especie nativa.
- Exibir alternativas de plantio.

## 5. Motor de recomendacao

O motor usa uma pontuacao multicriterio:

| Criterio | Peso |
|---|---|
| Compatibilidade do solo | 25% |
| Tolerancia a degradacao | 25% |
| Velocidade de crescimento | 20% |
| Viabilidade economica | 15% |
| Servicos ecossistemicos | 15% |

Recomendacoes atuais:

| Alerta | Recomendacao principal |
|---|---|
| Margem desmatada no igarape | Andiroba |
| Nascente sem cobertura nativa | Aroeira-do-Cerrado |
| Encosta seca com erosao | Mandacaru |
| Rio assoreado por retirada da mata | Guapuruvu |

## 6. Camera IA em Python

A camera IA fica em:

```text
sistema/ia_camera/
```

Bibliotecas previstas:

- OpenCV (`opencv-python`)
- NumPy (`numpy`)
- Flask (`flask`)
- Flask-CORS (`flask-cors`)
- Ultralytics YOLO (`ultralytics`)

Arquivo de dependencias:

```text
sistema/ia_camera/requirements.txt
```

## 7. Como rodar a camera IA

```bash
cd sistema/ia_camera
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python api.py
```

Teste de saude:

```bash
curl http://127.0.0.1:5000/health
```

Analise de imagem:

```bash
curl -X POST http://127.0.0.1:5000/analisar \
  -F "imagem=@/caminho/para/imagem.jpg"
```

## 8. O que funciona sem YOLO treinado

Sem modelo YOLO, o sistema usa OpenCV heuristico. Ele calcula metricas visuais como:

- Percentual aproximado de vegetacao.
- Percentual aproximado de solo exposto.
- Percentual aproximado de tons escuros/cinzas.
- Presenca aproximada de agua.
- Textura da imagem.

Com isso, ele tenta classificar:

- Queimada.
- Solo exposto.
- Mata ciliar degradada.
- Perda de vegetacao nativa.
- Vegetacao preservada.

Essa classificacao serve para prototipo e demonstracao. Ela nao substitui um modelo treinado nem validacao tecnica em campo.

## 9. Como o YOLO entra no projeto

YOLO pode ser usado para detectar classes ambientais, mas precisa de treinamento.

Modelo esperado:

```text
sistema/modelos/amazonia_yolo.pt
```

Classes planejadas:

- `queimada`
- `solo_exposto`
- `mata_ciliar_degradada`
- `perda_vegetacao`
- `vegetacao_preservada`

Para funcionar de verdade com YOLO, o projeto precisa:

1. Juntar imagens reais de cada classe.
2. Rotular as imagens.
3. Treinar o modelo com Ultralytics.
4. Salvar o `.pt` em `sistema/modelos/amazonia_yolo.pt`.
5. Rodar a API Python.

## 10. Arquitetura futura completa

| Camada | Funcao | Tecnologias |
|---|---|---|
| Coleta | Foto, camera, satelite e sensores | API, upload, camera |
| IA | Analise de imagem | OpenCV, YOLO, PyTorch |
| Dados | Biomas, solos, alertas e especies | PostgreSQL, PostGIS |
| Mapa | Visualizacao geoespacial | Leaflet ou MapLibre |
| Interface | Site e painel | HTML/CSS/JS ou React |
| Saida | Relatorios e alertas | PDF, e-mail, SMS |

## 11. Integracoes futuras

- INPE / TerraBrasilis.
- DETER.
- MapBiomas Alerta.
- Embrapa Solos.
- INMET.
- Banco de especies nativas.

## 12. Limites atuais

- O site funciona.
- O painel funciona com dados simulados.
- O recomendador funciona localmente.
- A IA do navegador ainda e simulada.
- A API Python foi preparada, mas precisa instalar dependencias.
- OpenCV funciona como heuristica quando instalado.
- YOLO so funciona de verdade com modelo treinado.
- Ainda nao existe banco de dados real.
- Ainda nao existe mapa georreferenciado real.

## 13. Conclusao

O sistema esta completo como **prototipo demonstravel**. Ele ainda nao esta completo como **produto final com IA real, YOLO treinado, banco de dados e integracoes oficiais**.

A base agora esta preparada para evoluir: o site apresenta o projeto, o sistema recomenda especies e a pasta Python abre o caminho para camera IA com OpenCV e YOLO.
