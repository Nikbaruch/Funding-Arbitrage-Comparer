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
    "BNB-USDT",
    "XRP-USDT",
    "ADA-USDT",
    "DOGE-USDT",
    "LTC-USDT",
    "DOT-USDT",
    "AVAX-USDT",
    "MATIC-USDT",
    "SHIB-USDT",
    "UNI-USDT",
    "LINK-USDT",
    "ATOM-USDT",
    "ALGO-USDT",
    "FTM-USDT",
    "TRX-USDT",
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [asterRes, hlRes] = await Promise.all([
          fetch(`/api/asterdex?pair=${pair}`),
          fetch(`/api/hyperliquid?coin=${pair.split("-")[0]}`),
        ]);

        const aster = await asterRes.json();
        const hl = await hlRes.json();

        const harmonized = {
          aster: aster?.funding != null ? aster.funding * 100 : null,
          hl: hl?.funding != null ? hl.funding * 100 : null,
        };

        setFundings({ raw: { aster, hl }, harmonized });
      } catch (e) {
        console.error("Erreur de fetch:", e);
      }
    }
    fetchData();
  }, [pair]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
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
            <h2>Comme sur le site :</h2>
            <p>AsterDex funding : {fundings.raw.aster?.funding ?? "?"}</p>
            <p>Hyperliquid funding : {fundings.raw.hl?.funding ?? "?"}</p>

            <h2>Harmonisé pour comparaison (%/h) :</h2>
            <p>
              AsterDex funding (hourly %) :{" "}
              {fundings.harmonized.aster?.toFixed(4) ?? "?"} %
            </p>
            <p>
              Hyperliquid funding (hourly %) :{" "}
              {fundings.harmonized.hl?.toFixed(4) ?? "?"} %
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
