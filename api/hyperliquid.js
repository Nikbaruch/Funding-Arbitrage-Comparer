// api/hyperliquid.js

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const coin = (url.searchParams.get("coin") || "BTC").toUpperCase();

    // ✅ Nouveau payload attendu par Hyperliquid
    const payload = {
      type: "fundingHistory",
      coin,
    };

    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(502)
        .json({ error: "hyperliquid_bad_response", detail: text });
    }

    const json = await response.json();

    // 🔍 Exemple de structure : [ { "rate": -0.00008, "time": 1731000000 }, ... ]
    let funding = null;
    if (Array.isArray(json) && json.length > 0 && json[0].rate != null) {
      funding = Number(json[0].rate);
    }

    return res.status(200).json({ funding });
  } catch (e) {
    console.error("Erreur Hyperliquid:", e);
    return res
      .status(500)
      .json({ error: "server_error", message: String(e) });
  }
}
