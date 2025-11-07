import { useEffect, useState } from "react";

function App() {
  const [fundings, setFundings] = useState(null);
  const [pair, setPair] = useState("BTC-USDT");

  useEffect(() => {
    async function fetchData() {
      try {
        const [asterRes, hlRes] = await Promise.all([
          fetch(`/api/asterdex?pair=${pair}`),
          fetch(`/api/hyperliquid?pair=${pair}`),
        ]);
        const aster = await asterRes.json();
        const hl = await hlRes.json();
        setFundings({ aster, hl });
      } catch (e) {
        console.error("Erreur de fetch:", e);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [pair]);

  if (!fundings) return <p>Chargement des fundings...</p>;

  const diff = fundings.aster.rate - fundings.hl.rate;
  const side = diff > 0 ? "Short HL / Long Asterdex" : "Short Asterdex / Long HL";

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>Funding Arbitrage Comparer</h1>
      <label>
        Choisir la paire :
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          <option>BTC-USDT</option>
          <option>ETH-USDT</option>
          <option>SOL-USDT</option>
        </select>
      </label>

      <h2>Résultats</h2>
      <p>Asterdex : {fundings.aster.rate}%</p>
      <p>Hyperliquid : {fundings.hl.rate}%</p>
      <p>
        <strong>Arbitrage conseillé :</strong> {side}
      </p>
    </div>
  );
}

export default App;
