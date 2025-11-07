// api/asterdex.js

export default async function handler(req, res) {
  try {
    // Pour compatibilité avec Vercel (req.url est une URL absolue côté serveur)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pair = url.searchParams.get("pair") || "BTC-USDT";
    const [base, quote] = pair.split("-");
    const symbol = `${base}/${quote}`;

    // L'API publique d'AsterDex
    const response = await fetch("https://api.asterdex.com/api/fundingRate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });

    if (!response.ok) {
      const txt = await response.text();
      return new Response(
        JSON.stringify({ error: "asterdex_bad_response", detail: txt }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // Recherche du champ le plus probable
    let funding = null;
    if (data && typeof data === "object") {
      if (typeof data.fundingRate === "number") funding = data.fundingRate;
      else if (data.rate) funding = Number(data.rate);
      else if (Array.isArray(data) && data.length && data[0].fundingRate)
        funding = Number(data[0].fundingRate);
    }

    return new Response(JSON.stringify({ funding }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Erreur AsterDex:", e);
    return new Response(
      JSON.stringify({ error: "server_error", message: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

