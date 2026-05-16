const state = {
  selectedAlertId: window.AMAZONIA40_DATA.alerts[0].id,
};

const formatPercent = (value) => `${Math.round(value * 100)}%`;

function renderBiomes() {
  const grid = document.querySelector("#biomeGrid");
  grid.innerHTML = window.AMAZONIA40_DATA.biomes
    .map(
      (biome) => `
        <article class="biome-card">
          <div class="biome-visual visual-${biome.slug}" aria-hidden="true"></div>
          <div class="biome-card-content">
            <h3>${biome.name}</h3>
            <p>${biome.summary}</p>
            <div class="tag-list">
              ${biome.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderAlerts() {
  const list = document.querySelector("#alertList");
  const alerts = window.AMAZONIA40_DATA.alerts;
  document.querySelector("#alertCount").textContent = `${alerts.length} ativos`;
  list.innerHTML = alerts
    .map(
      (alert) => `
        <button class="alert-button ${alert.id === state.selectedAlertId ? "active" : ""}" data-alert="${alert.id}">
          <strong>${alert.title}</strong>
          <span>${alert.biome} · ${alert.problem}</span>
        </button>
      `,
    )
    .join("");
}

function renderSelectedAlert() {
  const alert = window.AMAZONIA40_DATA.alerts.find((item) => item.id === state.selectedAlertId);
  const result = window.AMAZONIA40_RECOMMENDER.rankSpecies(alert);
  const [main, ...alternatives] = result;

  document.querySelector("#selectedTitle").textContent = alert.title;
  document.querySelector("#selectedUrgency").textContent = alert.urgency;
  document.querySelector("#selectedBiome").textContent = alert.biome;
  document.querySelector("#selectedSoil").textContent = alert.soil;
  document.querySelector("#selectedProblem").textContent = alert.problem;
  document.querySelector("#selectedImpact").textContent = alert.humanImpact;
  document.querySelector("#mainSpecies").textContent = `${main.commonName} (${main.scientificName})`;
  document.querySelector("#speciesReason").textContent = main.reason;
  document.querySelector("#scoreBar").style.width = formatPercent(main.score);
  document.querySelector("#alternatives").textContent = `Alternativas: ${alternatives
    .map((species) => species.commonName)
    .join(" e ")}`;

  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.style.background = pin.dataset.alert === alert.id ? "var(--sun)" : "var(--danger)";
  });
}

function selectAlert(alertId) {
  state.selectedAlertId = alertId;
  renderAlerts();
  renderSelectedAlert();
}

function renderTimeline() {
  const timeline = document.querySelector("#timeline");
  timeline.innerHTML = window.AMAZONIA40_DATA.roadmap
    .map(
      (item, index) => `
        <article>
          <span>Fase ${index + 1}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `,
    )
    .join("");
}

function renderAiScenario() {
  const scenarioKey = document.querySelector("#scenarioSelect").value;
  const scenario = window.AMAZONIA40_DATA.aiScenarios[scenarioKey];
  document.querySelector("#aiClassification").textContent = scenario.classification;
  document.querySelector("#aiDescription").textContent = scenario.description;
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const alertTrigger = event.target.closest("[data-alert]");
    if (alertTrigger) {
      selectAlert(alertTrigger.dataset.alert);
    }
  });

  document.querySelector("#scenarioSelect").addEventListener("change", renderAiScenario);
  document.querySelector("#analyzeButton").addEventListener("click", renderAiScenario);

  document.querySelector("#photoInput").addEventListener("change", (event) => {
    const [file] = event.target.files;
    const preview = document.querySelector("#photoPreview");
    if (!file) {
      preview.innerHTML = "<span>Prévia da imagem</span>";
      return;
    }

    const image = document.createElement("img");
    image.alt = "Foto enviada para análise simulada";
    image.src = URL.createObjectURL(file);
    preview.replaceChildren(image);
  });
}

renderBiomes();
renderAlerts();
renderSelectedAlert();
renderTimeline();
renderAiScenario();
bindEvents();
