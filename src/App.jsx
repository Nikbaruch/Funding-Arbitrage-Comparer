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
    // ajoute ici toutes les autres pairs que tu veux
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

        setFundings({ aster, hl });
      } catch (e) {
        console.error("Erreur de fetch:", e);
        setFundings({ aster: { funding: "?" }, hl: { funding: "?" } });
      }
    }
    fetchData();
  }, [pair]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Funding Arbitrage Comparer</h1>

      <select value={pair} onChange={(e) => setPair(e.target.value)}>
        {pairs.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "2rem" }}>
        {!fundings ? (
          <p>Chargement des fundings...</p>
        ) : (
          <div>
            <p>AsterDex funding : {fundings.aster?.funding ?? "?"}</p>
            <p>Hyperliquid funding : {fundings.hl?.funding ?? "?"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
