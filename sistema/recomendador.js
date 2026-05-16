window.AMAZONIA40_RECOMMENDER = {
  weights: {
    soil: 0.25,
    degradation: 0.25,
    growth: 0.2,
    economy: 0.15,
    ecosystem: 0.15,
  },

  degradationFactor(level) {
    return {
      Baixa: 0.45,
      Moderada: 0.62,
      Severa: 0.82,
      Crítica: 0.96,
    }[level] ?? 0.6;
  },

  scoreSpecies(alert, species) {
    const biomeMatch = species.biomes.includes(alert.biome);
    if (!biomeMatch) return 0;

    const soilScore = species.soils.includes(alert.soil) ? 1 : species.soils.includes("Adaptável") ? 0.82 : 0.45;
    const targetDegradation = this.degradationFactor(alert.degradation);
    const degradationScore = 1 - Math.abs(species.degradationTolerance - targetDegradation);

    return (
      soilScore * this.weights.soil +
      degradationScore * this.weights.degradation +
      species.growthSpeed * this.weights.growth +
      species.economicViability * this.weights.economy +
      species.ecosystemServices * this.weights.ecosystem
    );
  },

  rankSpecies(alert) {
    return window.AMAZONIA40_DATA.species
      .map((species) => ({
        ...species,
        score: this.scoreSpecies(alert, species),
      }))
      .filter((species) => species.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  },
};
