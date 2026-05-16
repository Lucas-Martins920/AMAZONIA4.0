const API_URL = "http://127.0.0.1:5000";

const appState = {
  alerts: [...window.AMAZONIA40_DATA.alerts],
  selectedAlertId: window.AMAZONIA40_DATA.alerts[0]?.id,
  biomeFilter: "todos",
  apiOnline: false,
};

const byId = (id) => document.getElementById(id);
const percent = (value) => `${Math.round(value * 100)}%`;
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function getSelectedAlert() {
  return appState.alerts.find((alert) => alert.id === appState.selectedAlertId) ?? appState.alerts[0];
}

function getFilteredAlerts() {
  if (appState.biomeFilter === "todos") return appState.alerts;
  return appState.alerts.filter((alert) => alert.biome === appState.biomeFilter);
}

function renderKpis() {
  byId("kpiAlerts").textContent = appState.alerts.length;
  byId("kpiCritical").textContent = appState.alerts.filter((alert) => alert.urgency === "Crítica").length;
  byId("kpiBiomes").textContent = new Set(window.AMAZONIA40_DATA.biomes.map((biome) => biome.name)).size;
  byId("kpiSpecies").textContent = window.AMAZONIA40_DATA.species.length;
}

function renderFilters() {
  const filter = byId("biomeFilter");
  const formBiome = document.querySelector("[name='biome']");
  const options = window.AMAZONIA40_DATA.biomes.map((biome) => `<option value="${biome.name}">${biome.name}</option>`).join("");

  filter.innerHTML = `<option value="todos">Todos os biomas</option>${options}`;
  filter.value = appState.biomeFilter;
  formBiome.innerHTML = options;
}

function renderAlertList() {
  const alerts = getFilteredAlerts();
  byId("alertList").innerHTML = alerts
    .map(
      (alert) => `
        <button class="alert-item ${alert.id === appState.selectedAlertId ? "active" : ""}" data-alert="${alert.id}">
          <strong>${alert.title}</strong>
          <span>${alert.biome} · ${alert.degradation} · ${alert.urgency}</span>
        </button>
      `,
    )
    .join("");

  if (!alerts.some((alert) => alert.id === appState.selectedAlertId) && alerts[0]) {
    appState.selectedAlertId = alerts[0].id;
  }
}

function renderPins() {
  document.querySelectorAll(".pin").forEach((pin) => {
    const matchingAlert = appState.alerts.find((alert) => alert.id === pin.dataset.alert);
    const visible = matchingAlert && (appState.biomeFilter === "todos" || matchingAlert.biome === appState.biomeFilter);
    pin.hidden = !visible;
    pin.classList.toggle("active", pin.dataset.alert === appState.selectedAlertId);
  });
}

function renderDiagnostic() {
  const alert = getSelectedAlert();
  if (!alert) return;

  byId("alertTitle").textContent = alert.title;
  byId("alertUrgency").textContent = alert.urgency;
  byId("alertUrgency").classList.toggle("critical", alert.urgency === "Crítica");
  byId("alertBiome").textContent = alert.biome;
  byId("alertSoil").textContent = alert.soil;
  byId("alertDegradation").textContent = alert.degradation;
  byId("alertProblem").textContent = alert.problem;
  byId("alertImpact").textContent = alert.humanImpact;
}

function renderRecommendation() {
  const alert = getSelectedAlert();
  const ranked = window.AMAZONIA40_RECOMMENDER.rankSpecies(alert);

  byId("recommendation").innerHTML = ranked
    .map(
      (species, index) => `
        <article class="species-card ${index === 0 ? "primary" : ""}">
          <strong>${species.commonName}</strong>
          <em>${species.scientificName}</em>
          <p>${species.reason}</p>
          ${
            index === 0
              ? `
                <div class="bioeconomy-mini">
                  <span>Potencial Bioeconômico</span>
                  <strong>${species.valor_comercial}</strong>
                  <small>${species.bioprodutos.join(" · ")}</small>
                </div>
              `
              : ""
          }
          <div class="scorebar" aria-label="Pontuação ${percent(species.score)}">
            <span style="width: ${percent(species.score)}"></span>
          </div>
        </article>
      `,
    )
    .join("");

  renderBioeconomyHighlight(alert, ranked[0]);
}

function renderBioeconomyHighlight(alert = getSelectedAlert(), species = null) {
  const container = byId("bioeconomyHighlight");
  if (!container || !alert) return;

  const [recommendedSpecies] = species ? [species] : window.AMAZONIA40_RECOMMENDER.rankSpecies(alert);
  if (!recommendedSpecies) return;

  container.innerHTML = `
    <article class="bioeconomy-card">
      <div>
        <span class="eyebrow">Potencial Bioeconômico</span>
        <h3>${escapeHtml(recommendedSpecies.commonName)}</h3>
        <p>${escapeHtml(recommendedSpecies.valor_comercial)}</p>
      </div>
      <div class="bioeconomy-products" aria-label="Bioprodutos recomendados">
        ${recommendedSpecies.bioprodutos.map((product) => `<span>${escapeHtml(product)}</span>`).join("")}
      </div>
      <strong class="bioeconomy-proof">Floresta em pé gera lucro sustentável.</strong>
    </article>
  `;
}

function renderAll() {
  renderKpis();
  renderAlertList();
  renderPins();
  renderDiagnostic();
  renderRecommendation();
}

function selectAlert(alertId) {
  appState.selectedAlertId = alertId;
  renderAll();
}

function renderLocalAi() {
  const scenario = window.AMAZONIA40_DATA.aiScenarios[byId("scenarioSelect").value];
  byId("cameraMode").textContent = "simulação local";
  byId("aiClass").textContent = scenario.classification;
  byId("aiDescription").textContent = scenario.description;
  byId("aiMetrics").innerHTML = "";
}

function renderApiResult(result) {
  byId("cameraMode").textContent = result.metodo ?? "API Python";
  byId("aiClass").textContent = `${result.classe} · ${percent(result.confianca ?? 0)}`;
  byId("aiDescription").textContent = result.aviso_supabase
    ? `${result.explicacao ?? "Resultado retornado pela API da câmera IA."} Aviso: ${result.aviso_supabase}`
    : (result.explicacao ?? "Resultado retornado pela API da câmera IA.");
  byId("aiMetrics").innerHTML = Object.entries(result.metricas ?? {})
    .map(
      ([name, value]) => `
        <div class="metric-row">
          <span>${name.replaceAll("_", " ")}</span>
          <strong>${percent(value)}</strong>
        </div>
      `,
    )
    .join("");
}

async function analyzeWithApi() {
  const file = byId("imageInput").files[0];
  if (!file) {
    byId("aiClass").textContent = "Envie uma imagem";
    byId("aiDescription").textContent = "Escolha um arquivo para a API Python analisar com OpenCV ou YOLO.";
    return;
  }

  const formData = new FormData();
  formData.append("imagem", file);

  byId("aiClass").textContent = "Analisando...";
  byId("aiDescription").textContent = "Enviando imagem para a API Python em 127.0.0.1:5000.";

  try {
    const response = await fetch(`${API_URL}/analisar`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.erro ?? "Falha ao analisar imagem.");
    renderApiResult(result);
  } catch (error) {
    byId("cameraMode").textContent = "API indisponível";
    byId("aiClass").textContent = "API não respondeu";
    byId("aiDescription").textContent =
      "Rode `python3 sistema/ia_camera/api.py` e instale as dependências para usar OpenCV/YOLO. Enquanto isso, use a análise simulada.";
    byId("aiMetrics").innerHTML = `<div class="metric-row"><span>erro</span><strong>${error.message}</strong></div>`;
  }
}

async function checkApiStatus() {
  const status = byId("apiStatus");
  try {
    const response = await fetch(`${API_URL}/health`, { method: "GET" });
    const result = await response.json();
    appState.apiOnline = response.ok;
    status.classList.toggle("online", response.ok);
    status.classList.toggle("offline", !response.ok);
    status.querySelector("span").textContent = result.modelo_yolo_configurado ? "online com YOLO" : "online com OpenCV";
  } catch {
    appState.apiOnline = false;
    status.classList.add("offline");
    status.querySelector("span").textContent = "offline";
  }
}

function addAlert(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const title = data.get("title").toString().trim();

  const alert = {
    id: `alerta-${Date.now()}`,
    title,
    biome: data.get("biome").toString(),
    soil: data.get("soil").toString(),
    degradation: data.get("degradation").toString(),
    problem: data.get("problem").toString().trim(),
    urgency: data.get("degradation").toString() === "Crítica" ? "Crítica" : "Alta",
    humanImpact: data.get("humanImpact").toString().trim(),
  };

  appState.alerts.unshift(alert);
  appState.selectedAlertId = alert.id;
  appState.biomeFilter = "todos";
  byId("biomeFilter").value = "todos";
  form.reset();
  renderAll();
}

async function gerarRelatorioPdf(dadosRelatorio) {
  const response = await fetch(`${API_URL}/gerar-relatorio-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosRelatorio),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.erro ?? "Falha ao gerar relatório PDF.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "relatorio_diagnostico_amazonia40.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportReport() {
  const alert = getSelectedAlert();
  const [mainSpecies] = window.AMAZONIA40_RECOMMENDER.rankSpecies(alert);

  try {
    await gerarRelatorioPdf({
      bioma_identificado: alert.biome,
      nivel_degradacao: alert.degradation,
      especie_recomendada: `${mainSpecies.commonName} (${mainSpecies.scientificName})`,
      justificativa: mainSpecies.reason,
      acoes_imediatas: `${alert.problem}. Priorizar isolamento da área, proteção do solo, monitoramento e plantio de espécies nativas adequadas ao bioma.`,
    });
  } catch (error) {
    window.alert(error.message);
  }
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-alert]");
    if (trigger) selectAlert(trigger.dataset.alert);
  });

  byId("biomeFilter").addEventListener("change", (event) => {
    appState.biomeFilter = event.target.value;
    renderAll();
  });

  byId("scenarioSelect").addEventListener("change", renderLocalAi);
  byId("analyzeLocalButton").addEventListener("click", renderLocalAi);
  byId("analyzeApiButton").addEventListener("click", analyzeWithApi);
  byId("alertForm").addEventListener("submit", addAlert);
  byId("exportButton").addEventListener("click", exportReport);

  byId("imageInput").addEventListener("change", (event) => {
    const [file] = event.target.files;
    const preview = byId("preview");
    if (!file) {
      preview.textContent = "Prévia da imagem";
      return;
    }
    const image = document.createElement("img");
    image.alt = "Imagem enviada para análise";
    image.src = URL.createObjectURL(file);
    preview.replaceChildren(image);
  });
}

if (byId("biomeFilter")) {
  renderFilters();
  renderAll();
  renderLocalAi();
  bindEvents();
  checkApiStatus();
} else {
  renderBioeconomyHighlight();
}
