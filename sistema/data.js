window.AMAZONIA40_DATA = {
  biomes: [
    {
      slug: "amazonia",
      name: "Amazônia",
      summary:
        "Floresta tropical quente e úmida, com rios extensos, alta biodiversidade e grande importância para o clima e as comunidades ribeirinhas.",
      tags: ["rios voadores", "castanheira", "solo úmido"],
    },
    {
      slug: "cerrado",
      name: "Cerrado",
      summary:
        "Savana brasileira com raízes profundas, árvores retorcidas e nascentes essenciais para o abastecimento de água do país.",
      tags: ["berço das águas", "pequi", "raízes profundas"],
    },
    {
      slug: "caatinga",
      name: "Caatinga",
      summary:
        "Bioma do semiárido, com plantas adaptadas à seca, chuvas irregulares e espécies importantes para a vida no sertão.",
      tags: ["mandacaru", "seca", "semiárido"],
    },
    {
      slug: "mata",
      name: "Mata Atlântica",
      summary:
        "Floresta tropical muito biodiversa, ligada à proteção de rios, nascentes, encostas e áreas de abastecimento urbano.",
      tags: ["mata ciliar", "nascentes", "guapuruvu"],
    },
  ],

  alerts: [
    {
      id: "rio-negro",
      title: "Margem desmatada no igarapé",
      biome: "Amazônia",
      soil: "Latossolo",
      degradation: "Moderada",
      problem: "Perda de vegetação e solo exposto",
      urgency: "Alta",
      humanImpact:
        "Pode reduzir a qualidade da água, aumentar assoreamento e dificultar pesca e navegação de comunidades próximas.",
    },
    {
      id: "cerrado-nascente",
      title: "Nascente sem cobertura nativa",
      biome: "Cerrado",
      soil: "Neossolo",
      degradation: "Severa",
      problem: "Desmatamento do Cerrado",
      urgency: "Crítica",
      humanImpact:
        "Reduz infiltração de água, ameaça nascentes e prejudica agricultura familiar e coleta de frutos nativos.",
    },
    {
      id: "sertao-seco",
      title: "Encosta seca com erosão",
      biome: "Caatinga",
      soil: "Planossolo",
      degradation: "Crítica",
      problem: "Declividade somada à seca",
      urgency: "Crítica",
      humanImpact:
        "A perda de solo reduz produtividade, dificulta a criação de animais e aumenta vulnerabilidade em períodos de estiagem.",
    },
    {
      id: "mata-ciliar",
      title: "Rio assoreado por retirada da mata",
      biome: "Mata Atlântica",
      soil: "Gleissolo",
      degradation: "Severa",
      problem: "Mata ciliar degradada",
      urgency: "Alta",
      humanImpact:
        "Aumenta enchentes, piora o tratamento da água e reduz a estabilidade das margens próximas a áreas urbanas.",
    },
  ],

  species: [
    {
      commonName: "Castanheira",
      scientificName: "Bertholletia excelsa",
      biomes: ["Amazônia"],
      soils: ["Latossolo", "Terra Firme"],
      degradationTolerance: 0.72,
      growthSpeed: 0.42,
      economicViability: 0.95,
      ecosystemServices: 0.92,
      bioprodutos: ["Castanha", "Óleo alimentício", "Farinha proteica"],
      valor_comercial: "Alto valor em cadeias alimentares, extrativismo comunitário e créditos de carbono.",
      reason:
        "Boa para restauração amazônica de longo prazo, sequestro de carbono e geração futura de renda com frutos.",
    },
    {
      commonName: "Andiroba",
      scientificName: "Carapa guianensis",
      biomes: ["Amazônia"],
      soils: ["Latossolo", "Argiloso", "Úmido"],
      degradationTolerance: 0.68,
      growthSpeed: 0.58,
      economicViability: 0.88,
      ecosystemServices: 0.82,
      bioprodutos: ["Óleo medicinal", "Cosméticos", "Sabonetes naturais"],
      valor_comercial: "Óleo valorizado por mercados de cosméticos, fitoterapia e bioinsumos florestais.",
      reason:
        "Espécie nativa com valor medicinal e cosmético, indicada para enriquecer áreas úmidas em recuperação.",
    },
    {
      commonName: "Ingá",
      scientificName: "Inga edulis",
      biomes: ["Amazônia", "Mata Atlântica"],
      soils: ["Latossolo", "Gleissolo", "Adaptável"],
      degradationTolerance: 0.86,
      growthSpeed: 0.9,
      economicViability: 0.62,
      ecosystemServices: 0.8,
      bioprodutos: ["Frutos", "Polpa", "Sombra agroflorestal"],
      valor_comercial: "Apoia sistemas agroflorestais produtivos e gera alimento em áreas de recuperação.",
      reason:
        "Pioneira de crescimento rápido, útil para sombreamento inicial, proteção do solo e recuperação acelerada.",
    },
    {
      commonName: "Aroeira-do-Cerrado",
      scientificName: "Myracrodruon urundeuva",
      biomes: ["Cerrado", "Caatinga"],
      soils: ["Neossolo", "Planossolo"],
      degradationTolerance: 0.9,
      growthSpeed: 0.58,
      economicViability: 0.72,
      ecosystemServices: 0.78,
      bioprodutos: ["Madeira manejada", "Taninos", "Produtos medicinais"],
      valor_comercial: "Potencial em manejo legal, produtos tradicionais e recuperação de áreas secas.",
      reason:
        "Resistente a áreas severamente degradadas, contribui para estabilidade do solo e recuperação da vegetação nativa.",
    },
    {
      commonName: "Mandacaru",
      scientificName: "Cereus jamacaru",
      biomes: ["Caatinga"],
      soils: ["Planossolo", "Neossolo"],
      degradationTolerance: 0.96,
      growthSpeed: 0.62,
      economicViability: 0.68,
      ecosystemServices: 0.74,
      bioprodutos: ["Frutos", "Forragem", "Cercas vivas"],
      valor_comercial: "Reduz perdas na seca ao apoiar alimentação animal e produtos locais da Caatinga.",
      reason:
        "Muito adaptado à seca, ajuda a manter cobertura e referência ecológica em áreas críticas do semiárido.",
    },
    {
      commonName: "Guapuruvu",
      scientificName: "Schizolobium parahyba",
      biomes: ["Mata Atlântica"],
      soils: ["Gleissolo", "Argiloso", "Adaptável"],
      degradationTolerance: 0.82,
      growthSpeed: 0.95,
      economicViability: 0.7,
      ecosystemServices: 0.86,
      bioprodutos: ["Madeira leve", "Sementes", "Sombreamento agroflorestal"],
      valor_comercial: "Crescimento rápido favorece sistemas restaurativos com uso madeireiro planejado.",
      reason:
        "Cresce rápido e pode acelerar cobertura vegetal em áreas de mata ciliar e encostas degradadas.",
    },
  ],

  aiScenarios: {
    queimada: {
      classification: "Queimada",
      description:
        "A imagem apresenta sinais esperados de cinzas, solo escurecido e baixa cobertura vegetal. A orientação é isolar a área, evitar novo fogo e iniciar recuperação com espécies pioneiras.",
    },
    solo: {
      classification: "Solo exposto",
      description:
        "O sistema identifica risco de erosão por falta de cobertura vegetal em terreno inclinado. A recuperação deve priorizar proteção do solo e espécies resistentes ao estresse hídrico.",
    },
    margem: {
      classification: "Mata ciliar degradada",
      description:
        "A margem sem vegetação pode causar erosão, assoreamento e piora da qualidade da água. A recomendação é recompor a faixa de proteção com espécies nativas.",
    },
    cerrado: {
      classification: "Perda de vegetação nativa",
      description:
        "A conversão do Cerrado reduz biodiversidade e infiltração de água. O sistema sugere espécies nativas resistentes e monitoramento contínuo de nascentes.",
    },
  },

  roadmap: [
    {
      title: "Maquete v1.0",
      description:
        "Representação física dos quatro biomas, comparando áreas preservadas e degradadas para explicar o problema ao público.",
    },
    {
      title: "Protótipo digital",
      description:
        "Mapa interativo com alertas simulados, impacto humano, diagnóstico ambiental e recomendação de recuperação.",
    },
    {
      title: "Câmera com IA",
      description:
        "Classificação provável de fotos por padrões visuais como queimada, solo exposto, margem degradada e vegetação nativa.",
    },
    {
      title: "Sistema completo",
      description:
        "Integração futura com INPE, DETER, MapBiomas, Embrapa Solos, INMET, banco de espécies e relatórios exportáveis.",
    },
  ],
};
