// src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const postChat = async (message, walletAddress) => {
  const res = await axios.post(`${BASE}/chat`, { message, walletAddress });
  return res.data;
};

export const getBalance = async (address) => {
  const res = await axios.get(`${BASE}/wallet/balance/${address}`);
  return res.data;
};

export const getTransactions = async (address, limit = 10) => {
  const res = await axios.get(`${BASE}/wallet/transactions/${address}?limit=${limit}`);
  return res.data;
};

export const postSend = async (from, to, amount) => {
  // backend mock endpoint (if you want server-side send logging)
  const res = await axios.post(`${BASE}/wallet/send`, { from, to, amount });
  return res.data;
};

export const getAlerts = async (address) => {
  const res = await axios.get(`${BASE}/alerts/${address}`);
  return res.data;
};

export const createAlert = async (walletAddress, type, threshold) => {
  const res = await axios.post(`${BASE}/alerts`, { walletAddress, type, threshold });
  return res.data;
};
