// src/pages/ConnectPage.jsx
import React, { useEffect, useState } from "react";
import { connectWallet, getCurrentAddress, isMetaMaskInstalled } from "../wallet";
import { ArrowRight, LogInIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConnectPage() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const a = await getCurrentAddress();
      if (a) {
        setAddress(a);
      }
    })();
    // listen to account changes
    const handler = (accounts) => {
      if (!accounts?.length) {
        setAddress(null);
        localStorage.removeItem("lumi_wallet");
      } else {
        setAddress(accounts[0]);
        localStorage.setItem("lumi_wallet", accounts[0]);
      }
    };
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handler);
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handler);
      }
    };
  }, []);

  const onConnect = async () => {
    if (!isMetaMaskInstalled()) {
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }
    try {
      setLoading(true);
      const a = await connectWallet();
      setAddress(a);
      localStorage.setItem("lumi_wallet", a);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <h1 className="text-3xl font-semibold">Welcome to Lumi</h1>
        <p className="mt-2 text-slate-300">Connect your wallet to start chatting with your Web3 assistant.</p>

        <div className="mt-6 flex gap-4 items-center">
          <button
            onClick={onConnect}
            className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2"
            disabled={loading}
          >
            <LogInIcon size={18} />
            {loading ? "Connecting..." : address ? "Connected — Continue" : "Connect MetaMask"}
            <ArrowRight size={16} />
          </button>

          {address && (
            <div className="ml-4 text-sm">
              <div>Connected:</div>
              <div className="mt-1 font-mono text-xs text-slate-200">{address}</div>
            </div>
          )}
        </div>

        <div className="mt-6 text-slate-400 text-sm">
          <strong>Tip:</strong> If you don't have MetaMask, install it and then come back.
        </div>
      </div>
    </div>
  );
}
