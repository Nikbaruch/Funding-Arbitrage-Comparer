// api/hyperliquid.js

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const coin = (url.searchParams.get("coin") || "BTC").toUpperCase();

    const payload = {
      type: "assetContexts",
      coin,
    };

    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: "hyperliquid_bad_response", detail: text });
    }

    const json = await response.json();

    // 🔍 debug: afficher tout ce que renvoie l'API
    console.log("Hyperliquid API response:", JSON.stringify(json, null, 2));

    let funding = null;

    if (json?.assetContexts && Array.isArray(json.assetContexts)) {
      const ctx = json.assetContexts.find(a => a.coin === coin);
      if (ctx && ctx.currentFundingRate != null) funding = Number(ctx.currentFundingRate);
    }

    if (funding == null && json?.currentFundingRate != null)
      funding = Number(json.currentFundingRate);

    if (funding == null && json?.predictedFundings?.length)
      funding = Number(json.predictedFundings[0]?.rate);

    return res.status(200).json({ funding });
  } catch (e) {
    console.error("Erreur Hyperliquid:", e);
    return res.status(500).json({ error: "server_error", message: String(e) });
  }
}
