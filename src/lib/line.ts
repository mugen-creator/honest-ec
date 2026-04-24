const WEBHOOK_URL = process.env.LINE_NEW_ARRIVAL_WEBHOOK_URL;
const SECRET = process.env.LINE_NEW_ARRIVAL_SECRET;

export async function broadcastNewArrivalToLine(params: {
  name: string;
  price: number;
  imageUrl?: string;
  productId: string;
}) {
  if (!WEBHOOK_URL || !SECRET) {
    console.warn("LINE broadcast skipped: env not configured");
    return;
  }

  const url = `https://maison.k-honest.com/products/${params.productId}`;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hook-secret": SECRET,
      },
      body: JSON.stringify({
        name: params.name,
        price: params.price,
        image_url: params.imageUrl,
        url,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`LINE broadcast failed: ${res.status} ${text}`);
    }
  } catch (err) {
    console.error("LINE broadcast error:", err);
  }
}
