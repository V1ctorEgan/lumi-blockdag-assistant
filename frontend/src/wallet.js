// src/wallet.js
import { ethers } from "ethers";

export const isMetaMaskInstalled = () => {
  return typeof window !== "undefined" && !!window.ethereum;
};

export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) throw new Error("MetaMask not installed");
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
};

export const getCurrentAddress = async () => {
  if (!isMetaMaskInstalled()) return null;
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts?.[0] || null;
};

// send a simple ETH/BDAG-like transaction via user's wallet
export const sendViaWallet = async ({ to, amount /* string in ETH units */ }) => {
  if (!isMetaMaskInstalled()) throw new Error("MetaMask not installed");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // amount is expected as string like "0.01"
  const tx = await signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount),
  });
  // wait for 1 confirmation (optional)
  await tx.wait(1);
  return tx;
};
