import { ethers } from "ethers";

export const isMetaMaskInstalled = () =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const address = accounts[0];
  localStorage.setItem("lumi_wallet", address);

  // notify other parts of the app in the same tab
  try {
    window.dispatchEvent(new CustomEvent('lumi_wallet_changed', { detail: { address } }));
  } catch (e) {}

  return address;
};

export const getCurrentWallet = async () => {
  if (!isMetaMaskInstalled()) return null;

  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });

  return accounts.length > 0 ? accounts[0] : null;
};

export const disconnectWallet = () => {
  try { localStorage.removeItem("lumi_wallet"); } catch(e){}
  try {
    window.dispatchEvent(new CustomEvent('lumi_wallet_changed', { detail: { address: null } }));
  } catch (e) {}
};

/**
 * Send a transaction using MetaMask + ethers.js
 * @param {Object} param0 
 * @param {string} param0.to - Receiver address
 * @param {string} param0.amount - Amount in ETH/BDAG (string)
 */
export const sendViaWallet = async ({ to, amount }) => {
  if (!isMetaMaskInstalled()) throw new Error("MetaMask not installed");

  // Initialize provider injected by MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // The signer is the connected account
  const signer = provider.getSigner();

  // Convert amount to wei (blockdag uses ETH units too unless specified otherwise)
  const value = ethers.utils.parseEther(amount);

  const tx = await signer.sendTransaction({
    to,
    value,
  });

  // Wait for confirmation (1 block)
  await tx.wait(1);

  return tx;
};
