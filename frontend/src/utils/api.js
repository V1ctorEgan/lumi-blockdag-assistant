export const API_BASE = "https://lumi-blockdag-assistant-2.onrender.com/api";

export async function askLumi(message, walletAddress) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, wallet: walletAddress }),
    });

    if (!res.ok) throw new Error("Backend error");

    return await res.json();
  } catch (err) {
    return { error: "Sorry — I couldn’t reach the backend." };
  }
}

export async function getBalance(walletAddress) {
  const res = await fetch(`${API_BASE}/wallet/balance/${walletAddress}`);
  return await res.json();
}

export async function getTransactions(walletAddress) {
  const res = await fetch(`${API_BASE}/wallet/transactions/${walletAddress}`);
  return await res.json();
}

export async function sendTransactionBackend(data) {
  const res = await fetch(`${API_BASE}/wallet/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await res.json();
}
