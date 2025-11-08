import { useEffect, useState } from "react";

function App() {
  const [fundings, setFundings] = useState(null);
  const [pair, setPair] = useState("BTC-USDT");

  const pairs = [
    "BTC-USDT",
    "ETH-USDT",
    "SOL-USDT",
    "0G-USDT",
    "ASTER-USDT",
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const baseCoin = pair.split("-")[0];
        const [asterRes, hlRes] = await Promise.all([
          fetch(`/api/asterdex?pair=${pair}`),
          fetch(`/api/hyperliquid?coin=${baseCoin}`),
        ]);

        const aster = await asterRes.json();
        const hl = await hlRes.json();

        // Harmonisation : convertir tous les taux en %/heure pour comparer
        const harmonized = {
          aster: aster?.funding ?? null, // AsterDex retourne déjà hourly
          hl: hl?.funding ? hl.funding / 8 : null, // Hyperliquid retourne sur 8h → diviser pour hourly
        };

        setFundings({ aster, hl, harmonized });
      } catch (e) {
        console.error("Erreur de fetch:", e);
      }
    }
    fetchData();
  }, [pair]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Funding Arbitrage Comparer</h1>

      <select value={pair} onChange={(e) => setPair(e.target.value)}>
        {pairs.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <div style={{ marginTop: "2rem" }}>
        {!fundings ? (
          <p>Chargement des fundings...</p>
        ) : (
          <div>
            <h3>Comme sur le site :</h3>
            <p>AsterDex funding : {fundings.aster?.funding ?? "?"}</p>
            <p>Hyperliquid funding : {fundings.hl?.funding ?? "?"}</p>

            <h3 style={{ marginTop: "1rem" }}>Harmonisé pour comparaison :</h3>
            <p>
              AsterDex funding (hourly %) :{" "}
              {fundings.harmonized.aster != null
                ? (fundings.harmonized.aster * 100).toFixed(4) + " %"
                : "?"}
            </p>
            <p>
              Hyperliquid funding (hourly %) :{" "}
              {fundings.harmonized.hl != null
                ? (fundings.harmonized.hl * 100).toFixed(4) + " %"
                : "?"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
