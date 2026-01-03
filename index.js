document.addEventListener("DOMContentLoaded", () => {

    const analyzeBtn = document.getElementById("analyze");
    const resultBox = document.getElementById("result");

    analyzeBtn.addEventListener("click", () => {

        // -------------------------
        // READ INPUT VALUES
        // -------------------------
        const gold = Number(document.getElementById("gold").value);
        const oil = Number(document.getElementById("oil").value);
        const intrest = Number(document.getElementById("intrest").value);
        const dollar = Number(document.getElementById("dollar").value);
        const bitcoin = Number(document.getElementById("bitcoin").value);
        const indexValue = Number(document.getElementById("index_value").value);
        // const beatEarnings = document.getElementById("beatEarnings").checked;

        // -------------------------
        // VALIDATION
        // -------------------------
        if (!indexValue || indexValue <= 0) {
            resultBox.textContent = "Invalid index value";
            return;
        }

        // -------------------------
        // ECONOMIC RATIOS
        // -------------------------
        const goldIndex = gold / indexValue;
        const oilIndex = oil / indexValue;
        const dollarIndex = dollar / indexValue;
        const bitcoinIndex = bitcoin / indexValue;

        console.table({
            goldIndex,
            oilIndex,
            dollarIndex,
            bitcoinIndex,
            intrest,
            // beatEarnings
        });

        // -------------------------
        // WEIGHTED REGIME ENGINE
        // -------------------------
        const weights = {
            gold: 0.35,
            dollar: 0.30,
            oil: 0.15,
            bitcoin: 0.10,
            intrest: 0.10
        };

        let score = 0;
        const band = 0.05;

        if (goldIndex > 1 + band) score += weights.gold;
        if (goldIndex < 1 - band) score -= weights.gold;

        if (dollarIndex > 1 + band) score += weights.dollar;
        if (dollarIndex < 1 - band) score -= weights.dollar;

        if (oilIndex > 1 + band) score -= weights.oil;
        if (oilIndex < 1 - band) score += weights.oil;

        if (bitcoinIndex > 1 + band) score -= weights.bitcoin;
        if (bitcoinIndex < 1 - band) score += weights.bitcoin;

        if (intrest > 0) score += weights.intrest;

        // if (beatEarnings) score -= 0.05; // sentiment boost

        // -------------------------
        // REGIME CLASSIFICATION
        // -------------------------
        let regime;

        if (score >= 0.4) {
            regime = "Risk-Off: Defensive assets favored";
        } else if (score <= -0.4) {
            regime = "Risk-On: Growth and speculation favored";
        } else {
            regime = "Neutral: Mixed or range-bound conditions";
        }

        console.log("Regime Score:", score.toFixed(2));
        resultBox.textContent = regime;
    });
});
