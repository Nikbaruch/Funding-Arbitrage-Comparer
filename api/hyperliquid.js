// api/hyperliquid.js
export default async function handler(req, res) {
  try {
    const coin = (req.query.coin || req.body?.coin || "BTC").toUpperCase();

    const payload = {
      type: "assetContexts",
      coin,
    };

    const r = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: "hyperliquid_bad_response", detail: txt });
    }

    const json = await r.json();
    let funding = null;

    if (json && typeof json === "object") {
      if (json.assetContexts && Array.isArray(json.assetContexts)) {
        const ac = json.assetContexts.find(a => a.coin === coin || a.symbol?.toUpperCase()?.includes(coin));
        if (ac && ac.currentFundingRate != null) funding = Number(ac.currentFundingRate);
      }
      if (funding == null && json.currentFundingRate != null) {
        funding = Number(json.currentFundingRate);
      }
      if (funding == null && json.predictedFundings && Array.isArray(json.predictedFundings)) {
        const p = json.predictedFundings[0];
        if (p && p.rate != null) funding = Number(p.rate);
      }
    }

    return res.status(200).json({ funding });
  } catch (e) {
    console.error("Erreur Hyperliquid:", e);
    return res.status(500).json({ error: "server_error", message: String(e) });
  }
}
