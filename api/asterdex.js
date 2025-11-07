// api/asterdex.js
export default async function handler(req, res) {
  try {
    const pair = req.query.pair || "BTC-USDT";
    const [base, quote] = pair.split("-");
    const symbol = `${base}/${quote}`;

    const response = await fetch("https://api.asterdex.com/api/fundingRate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });

    if (!response.ok) {
      const txt = await response.text();
      return res
        .status(502)
        .json({ error: "asterdex_bad_response", detail: txt });
    }

    const data = await response.json();
    let funding = null;

    if (data && typeof data === "object") {
      if (typeof data.fundingRate === "number") funding = data.fundingRate;
      else if (data.rate) funding = Number(data.rate);
      else if (Array.isArray(data) && data[0]?.fundingRate)
        funding = Number(data[0].fundingRate);
    }

    return res.status(200).json({ funding });
  } catch (e) {
    console.error("Erreur AsterDex:", e);
    return res
      .status(500)
      .json({ error: "server_error", message: String(e) });
  }
}
