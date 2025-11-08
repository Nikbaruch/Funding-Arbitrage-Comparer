// api/hyperliquid.js
export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const coin = (url.searchParams.get("coin") || "BTC").toUpperCase();
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const payload = {
      type: "fundingHistory",
      coin,
      startTime: oneHourAgo,
      endTime: now
    };

    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(502).json({ error: "hyperliquid_bad_response", detail: txt });
    }

    const json = await response.json();

    let funding = null;
    if (Array.isArray(json) && json.length > 0 && json[json.length - 1].fundingRate != null) {
      funding = Number(json[json.length - 1].fundingRate);
    }

    return res.status(200).json({ funding });
  } catch (e) {
    console.error("Erreur Hyperliquid:", e);
    return res.status(500).json({ error: "server_error", message: String(e) });
  }
}
