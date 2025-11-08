import { useEffect, useState } from "react";

// Liste des coins + nouvelles paires 0G et ASTER
const pairs = [
  "BTC", "ETH", "BNB", "SOL", "ADA", "XRP", "DOGE", "DOT", "AVAX", "MATIC",
  "LTC", "SHIB", "TRX", "ATOM", "LINK", "ETC", "XLM", "FIL", "NEAR", "ALGO",
  "ICP", "FTM", "EGLD", "XTZ", "VET", "AAVE", "EOS", "SAND", "MANA", "KSM",
  "CRV", "KLAY", "CHZ", "AR", "GRT", "HNT", "ONE", "ZIL", "FLOW", "QNT",
  "BTT", "BAT", "STX", "DASH", "COMP", "MKR", "YFI", "LRC", "CRO", "MINA",
  "CELO", "FTT", "ENJ", "KAVA", "RVN", "KNC", "ZRX", "OMG", "ICX", "ZEN",
  "HOT", "ANKR", "BTG", "BTS", "ONT", "NANO", "DGB", "0G", "ASTER"
];

function App() {
  const [fundings, setFundings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const results = {};
      for (let coin of pairs) {
        const pair = `${coin}-USDT`;
        try {
          const [asterRes, hyperRes] = await Promise.all([
            fetch(`/api/asterdex?pair=${pair}`),
            fetch(`/api/hyperliquid?pair=${pair}`)
          ]);
          const asterData = await asterRes.json();
          const hyperData = await hyperRes.json();

          results[pair] = {
            aster: asterData.funding ?? "?",
            hyper: hyperData.funding ?? "?"
          };
        } catch (e) {
          results[pair] = { aster: "?", hyper: "?" };
          console.error(`Erreur fetch ${pair}:`, e);
        }
      }
      setFundings(results);
      setLoading(false);
    }

    fetchAll();
  }, []);

  if (loading) return <div>Chargement des fundings...</div>;

  return (
    <div>
      <h1>Funding Arbitrage Comparer</h1>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>AsterDex</th>
            <th>Hyperliquid</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fundings).map(([pair, data]) => (
            <tr key={pair}>
              <td>{pair}</td>
              <td>{data.aster}</td>
              <td>{data.hyper}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
