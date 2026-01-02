document.addEventListener("DOMContentLoaded", () => {

    // -------------------------
    // DOM REFERENCES
    // -------------------------
    const form = document.getElementById("formdata");
    const analyzeBtn = document.getElementById("analyze");
    const resultBox = document.getElementById("result");

    if (!form || !analyzeBtn || !resultBox) {
        console.error("Required DOM elements missing");
        return;
    }

    // -------------------------
    // SAVE DATA TO BACKEND
    // -------------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            gold: Number(document.getElementById("gold").value),
            oil: Number(document.getElementById("oil").value),
            intrest: Number(document.getElementById("intrest").value),
            dollar: Number(document.getElementById("dollar").value),
            bitcoin: Number(document.getElementById("bitcoin").value),
            index_value: Number(document.getElementById("index_value").value),
            beat: document.getElementById("beatEarnings").checked
        };

        try {
            const res = await fetch("http://localhost:5000/stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save data");

            console.log("✔ Market data saved");

        } catch (err) {
            console.error("Save error:", err);
        }
    });

    // -------------------------
    // ANALYZE MARKET REGIME
    // -------------------------
    analyzeBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/stock");
            if (!res.ok) throw new Error("Failed to fetch data");

            const rows = await res.json();
            if (!rows.length) {
                console.warn("No market data available");
                return;
            }

            const {
                gold,
                oil,
                intrest,
                dollar,
                bitcoin,
                index_value
            } = rows[0];

            // -------------------------
            // VALIDATION
            // -------------------------
            if (!index_value || index_value <= 0) {
                resultBox.innerHTML = "Invalid index value";
                return;
            }

            // -------------------------
            // ECONOMIC RATIOS
            // -------------------------
            const goldIndex = gold / index_value;
            const oilIndex = oil / index_value;
            const dollarIndex = dollar / index_value;
            const bitcoinIndex = bitcoin / index_value;

            console.table({
                goldIndex,
                oilIndex,
                dollarIndex,
                bitcoinIndex,
                intrest
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
            const band = 0.05; // 5% tolerance

            // Gold → fear hedge
            if (goldIndex > 1 + band) score += weights.gold;
            if (goldIndex < 1 - band) score -= weights.gold;

            // Dollar → liquidity tightening
            if (dollarIndex > 1 + band) score += weights.dollar;
            if (dollarIndex < 1 - band) score -= weights.dollar;

            // Oil → growth proxy
            if (oilIndex > 1 + band) score -= weights.oil;
            if (oilIndex < 1 - band) score += weights.oil;

            // Bitcoin → speculation proxy
            if (bitcoinIndex > 1 + band) score -= weights.bitcoin;
            if (bitcoinIndex < 1 - band) score += weights.bitcoin;

            // Interest rates → policy pressure
            if (intrest > 0) score += weights.intrest;

            // -------------------------
            // REGIME CLASSIFICATION
            // -------------------------
            let regime;

            if (score >= 0.4) {
                regime = "Risk-Off: Defensive assets favored, capital preservation mode";
            } else if (score <= -0.4) {
                regime = "Risk-On: Growth and speculative assets favored";
            } else {
                regime = "Neutral: Mixed signals, range-bound market conditions";
            }

            console.log("📊 Regime Score:", score.toFixed(2));
            resultBox.innerHTML = regime;

        } catch (err) {
            console.error("Analyze error:", err);
        }
    });

});






// document.addEventListener("DOMContentLoaded", () => {

//     const form = document.getElementById("formdata");
//     const analyze = document.getElementById("analyze");

//     if (!form || !analyze) {
//         console.error("Form or Analyze button not found in DOM");
//         return;
//     }

//     // -------------------------
//     // SAVE DATA
//     // -------------------------
//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const data = {
//             gold: Number(document.getElementById("gold").value),
//             oil: Number(document.getElementById("oil").value),
//             intrest: Number(document.getElementById("intrest").value),
//             dollar: Number(document.getElementById("dollar").value),
//             beat: document.getElementById("beatEarnings").checked,
//             bitcoin: Number(document.getElementById("bitcoin").value),
//             index_value: Number(document.getElementById("index_value").value)
//         };

//         try {
//             const res = await fetch("http://localhost:5000/stock", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data)
//             });

//             if (!res.ok) throw new Error("Save failed");

//             console.log("Data saved");

//         } catch (err) {
//             console.error("Submit error:", err);
//         }
//     });

//     // -------------------------
//     // ANALYZE DATA
//     // -------------------------
//     analyze.addEventListener("click", async (e) => {
//         e.preventDefault();

//         try {
//             const req = await fetch("http://localhost:5000/stock");
//             if (!req.ok) throw new Error("Fetch failed");

//             const data = await req.json();
//             if (!data.length) {
//                 console.log("No data in DB");
//                 return;
//             }

//             const row = data[0];

//             const gold = Number(row.gold);
//             const oil = Number(row.oil);
//             const intrest = Number(row.intrest);
//             const dollar = Number(row.dollar);
//             const bitcoin = Number(row.bitcoin);
//             const index_value = Number(row.index_value);

//             // --- ECONOMETRIC RATIOS ---
//             const gold_index = gold / index_value;
//             const oil_index = oil / index_value;
//             const dollar_index = dollar / index_value;
//             const bitcoin_index = bitcoin / index_value;



//             console.log("Ratios:", {
//                 gold_index,
//                 oil_index,
//                 dollar_index,
//                 bitcoin_index,
//                 intrest
//             });

//             //make an over all synpsis and put that in explaniton 
//                 let regime;
//             if(gold_index > 1){
//                 regime = "the market is risk adverse"
//             }else if(gold_index<1){
//                 regime = "the market is more dollar leaning"
//             }else{
//                 regime = "its pretty netrual"
//             }

//             const result = document.getElementById("result")
//             result.innerHTML =regime

//         } catch (err) {
//             console.error("Analyze error:", err);
//         }
//     });

// });
