# Documentação do Projeto Amazônia 4.0

## 1. Visão geral

O **Amazônia 4.0** é um protótipo educativo e demonstrativo sobre monitoramento ambiental, degradação de biomas e recuperação com espécies nativas.

O projeto foi organizado para funcionar como:

- **Site informativo:** primeira experiência do visitante, com apresentação, cards de biomas, topologia e explicação do fluxo.
- **Aba Sistema:** demonstração operacional com alertas simulados, diagnóstico, recomendação de espécies, câmera IA e cadastro local de alertas.
- **API de IA opcional:** backend Python com Flask, OpenCV heurístico e suporte futuro a YOLO treinado.

## 2. Objetivo

Explicar como tecnologia pode apoiar a identificação de problemas ambientais e orientar ações iniciais de recuperação ecológica.

O protótipo não substitui análise técnica de campo. Ele serve para apresentação acadêmica, feira de inovação e demonstração visual do conceito.

## 3. Estrutura principal

```text
AMAZONIA - 4.0/
├── documentação_amazon.md
├── sistema/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── data.js
│   ├── recomendador.js
│   ├── ia_camera/
│   │   ├── README.md
│   │   ├── requirements.txt
│   │   ├── camera_ia.py
│   │   └── api.py
│   └── modelos/
│       └── README.md
├── site/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── documentacao/
└── DesingSystem/
```

O arquivo principal recomendado para abrir o projeto é:

```text
sistema/index.html
```

Essa página agora contém o site informativo e a aba do sistema na mesma experiência.

## 4. Como rodar

### Site

```bash
cd "/home/lucas-martins/Documents/AMAZONIA - 4.0/sistema"
python3 -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

### API da câmera IA

Em outro terminal:

```bash
cd "/home/lucas-martins/Documents/AMAZONIA - 4.0/sistema/ia_camera"
source .venv/bin/activate
python api.py
```

Teste:

```text
http://127.0.0.1:5000/health
```

Se o ambiente virtual ainda não existir:

```bash
cd "/home/lucas-martins/Documents/AMAZONIA - 4.0/sistema/ia_camera"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python api.py
```

## 5. Site informativo

O site informativo apresenta:

- Hero do projeto Amazônia 4.0.
- Cards sobre Amazônia, Cerrado, Caatinga e Mata Atlântica.
- Topologia do fluxo: entrada, processamento e saída.
- Explicação de como o visitante entende o projeto.
- Link/aba para abrir a demonstração do sistema.

A intenção dessa parte é parecer um site de apresentação, não um painel administrativo.

## 6. Aba Sistema

A aba **Sistema** demonstra como o produto funcionaria na prática.

Recursos disponíveis:

- Indicadores do protótipo.
- Fila de alertas simulados.
- Mapa conceitual com pins clicáveis.
- Diagnóstico por alerta.
- Impacto humano associado.
- Recomendação de espécies nativas.
- Câmera IA com simulação local e envio para API Python.
- Cadastro local de novo alerta.
- Exportação de relatório em `.txt`.

## 7. Dados usados

Os dados ficam em:

```text
sistema/data.js
```

O arquivo contém:

- Biomas.
- Alertas ambientais.
- Espécies nativas.
- Cenários simulados de IA.
- Roadmap.

### Alertas simulados

| Alerta | Bioma | Problema |
|---|---|---|
| Margem desmatada no igarapé | Amazônia | Perda de vegetação e solo exposto |
| Nascente sem cobertura nativa | Cerrado | Desmatamento do Cerrado |
| Encosta seca com erosão | Caatinga | Declividade somada à seca |
| Rio assoreado por retirada da mata | Mata Atlântica | Mata ciliar degradada |

## 8. Recomendador de espécies

O recomendador fica em:

```text
sistema/recomendador.js
```

Ele pontua espécies com base em:

| Critério | Peso |
|---|---:|
| Compatibilidade do solo | 25% |
| Tolerância à degradação | 25% |
| Velocidade de crescimento | 20% |
| Viabilidade econômica | 15% |
| Serviços ecossistêmicos | 15% |

Espécies cadastradas:

| Nome comum | Nome científico | Biomas |
|---|---|---|
| Castanheira | Bertholletia excelsa | Amazônia |
| Andiroba | Carapa guianensis | Amazônia |
| Ingá | Inga edulis | Amazônia e Mata Atlântica |
| Aroeira-do-Cerrado | Myracrodruon urundeuva | Cerrado e Caatinga |
| Mandacaru | Cereus jamacaru | Caatinga |
| Guapuruvu | Schizolobium parahyba | Mata Atlântica |

## 9. Câmera IA

A câmera IA tem duas camadas:

- **Simulação local no navegador:** usa cenários prontos para demonstrar o fluxo.
- **API Python:** recebe imagem e tenta classificar usando OpenCV heurístico.

Arquivos principais:

```text
sistema/ia_camera/api.py
sistema/ia_camera/camera_ia.py
sistema/ia_camera/requirements.txt
```

Classes ambientais planejadas:

- Queimada.
- Solo exposto.
- Mata ciliar degradada.
- Perda de vegetação nativa.
- Vegetação preservada.

## 10. YOLO opcional

O projeto aceita um modelo YOLO treinado, mas ele ainda precisa ser criado com dataset real e imagens rotuladas.

Local esperado:

```text
sistema/modelos/amazonia_yolo.pt
```

Sem esse arquivo, a API usa apenas OpenCV heurístico.

## 11. Estado atual

O que funciona:

- Site informativo em `sistema/index.html`.
- Navegação por seções.
- Aba Sistema.
- Alertas simulados.
- Diagnóstico e recomendação.
- Cadastro local de alerta.
- Exportação de relatório.
- Simulação local de IA.
- API Flask para análise de imagem, quando iniciada.

O que ainda é protótipo:

- Dados ambientais são simulados.
- O mapa é conceitual, não georreferenciado.
- A IA local do navegador é demonstrativa.
- OpenCV usa heurísticas simples.
- YOLO depende de modelo treinado.
- Ainda não há banco de dados real.
- Ainda não há integração com INPE, MapBiomas, INMET ou Embrapa.

## 12. Próximas melhorias

- Melhorar a identidade visual com base no design system escolhido.
- Criar mapa georreferenciado com Leaflet ou MapLibre.
- Integrar fontes reais, como MapBiomas, INPE/DETER e INMET.
- Criar banco de dados para alertas, espécies, biomas e análises.
- Treinar modelo YOLO com imagens ambientais rotuladas.
- Gerar relatório em PDF.
- Criar painel administrativo separado, caso o projeto evolua para produto.

## 13. Resumo

O Amazônia 4.0 está estruturado como um **site informativo com uma aba de demonstração do sistema**.

Essa organização evita que o visitante entre direto em uma tela com cara de painel técnico, mas ainda permite mostrar a parte operacional quando for necessário explicar como o sistema funcionaria.
