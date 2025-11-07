import { useEffect, useState } from "react";

function App() {
  const [fundings, setFundings] = useState(null);
  const [pair, setPair] = useState("BTC-USDT");

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
      }
    }
    fetchData();
  }, [pair]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Funding Arbitrage Comparer</h1>

      <select value={pair} onChange={(e) => setPair(e.target.value)}>
        <option>BTC-USDT</option>
        <option>ETH-USDT</option>
        <option>SOL-USDT</option>
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
