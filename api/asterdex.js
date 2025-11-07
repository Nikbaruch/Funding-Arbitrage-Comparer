// api/asterdex.js
export default async function handler(req, res) {
  try {
    const pair = req.query.pair || "BTC-USDT";
    const [base, quote] = pair.split("-");
    const symbol = `${base}${quote}`;         // ex “BTCUSDT”

    // Utiliser le bon endpoint public de AsterDex
    const url = `https://fapi.asterdex.com/fapi/v1/premiumIndex?symbol=${symbol}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(502).json({ error: "asterdex_bad_response", detail: txt });
    }

    const data = await response.json();
    // Exemple de format attendu : { "symbol":"BTCUSDT", "lastFundingRate":"0.00038246", … }  :contentReference[oaicite:2]{index=2}

    let funding = null;
    if (data && typeof data === "object") {
      if (data.lastFundingRate != null) {
        funding = Number(data.lastFundingRate);
      } else if (data.fundingRate != null) {
        funding = Number(data.fundingRate);
      }
    }

    return res.status(200).json({ funding });
  } catch (e) {
    console.error("Erreur AsterDex:", e);
    return res.status(500).json({ error: "server_error", message: String(e) });
  }
}
