
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, RocketIcon,Star, User, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import Lottie from "lottie-react";
import SiriLogo from "../SiriLogo.json";

import { postChat, postSend, getBalance } from "../api"; 
import {
  getCurrentWallet,
  disconnectWallet,
  connectWallet,
  sendViaWallet,
  isMetaMaskInstalled,
} from "../utils/Wallet";
import Orb from "../background/Orb";
import Particles from "../background/Particles";

export default function ChatPage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(localStorage.getItem("lumi_wallet") || null);
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      role: "assistant",
      text: "👋 Hi — I'm Lumi. Ask about your wallet, transactions, gas fees, or say `send 0.01 BDAG to 0x...` and I'll help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lumiTyping, setLumiTyping] = useState(false);
  const [confirmTx, setConfirmTx] = useState(null);
  const [sendingTx, setSendingTx] = useState(false);
  const bottomRef = useRef(null);

 
  const quickActions = [
    { id: "q-balance", label: "Check balance", action: "what's my balance?" },
    { id: "q-yesterday", label: "Yesterday's transactions", action: "show all transactions for yesterday" },
    { id: "q-send-small", label: "Send 0.01 BDAG", action: "send 0.01 BDAG to 0x000000000000000000000000000000000000dEaD" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const w = await getCurrentWallet();
        if (!w) {
          // Not connected → redirect to landing page
          navigate("/");
          return;
        }
        setWallet(w);
        // Optionally welcome back
        toast.success("Wallet connected: " + w.slice(0,6) + "..." + w.slice(-4));
      } catch (err) {
        console.warn("wallet check failed", err);
      }
    })();

    // handle account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (!accounts || accounts.length === 0) {
          disconnectWallet();
          setWallet(null);
          navigate("/");
        } else {
          setWallet(accounts[0]);
          localStorage.setItem("lumi_wallet", accounts[0]);
          toast("Account changed: " + accounts[0].slice(0,6) + "..." + accounts[0].slice(-4));
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, lumiTyping, confirmTx, sendingTx]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  };

  const handleQuickAction = (act) => {
    setInput(act);
    handleSend(act);
  };

  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    // push user message
    addMessage({ role: "user", text });
    setInput("");
    setLoading(true);
    setLumiTyping(true);

    // small simulated typing delay for UX
    await new Promise((r) => setTimeout(r, 500));

    try {
      const res = await postChat(text, wallet); // backend expected shape
      // backend response shape assumed: { response: { text: "...", action?: "...", data?: {...} } }
      const reply = res?.response || { text: "Sorry, no response." };

      // show assistant typing for a short time if text is long
      const replyText = reply.text || "I got that!";
      const readDelay = Math.min(1200 + replyText.length * 12, 3000);
      await new Promise((r) => setTimeout(r, Math.min(readDelay, 3000)));

      addMessage({ role: "assistant", text: replyText });

      // handle special actions from backend
      if (reply.action === "confirm_transaction" && reply.data) {
        // show confirm modal data
        setConfirmTx({ recipient: reply.data.recipient, amount: String(reply.data.amount) });
        toast.info("Transaction detected — confirm to send.");
      } else if (reply.action === "show_balance" && reply.data) {
        addMessage({ role: "assistant", text: `Balance: ${reply.data.balance} ${reply.data.token} (≈ $${reply.data.usdValue})` });
      } else if (reply.action === "alert" && reply.data) {
        toast(reply.data.message || "Alert from Lumi");
      }

      // if backend gave quick suggestions, show them as a toast (optional)
      if (reply.suggestions && Array.isArray(reply.suggestions)) {
        reply.suggestions.slice(0,3).forEach((s) => {
          // show small actionable toasts
          toast(s);
        });
      }
    } catch (err) {
      console.error("chat error", err);
      toast.error("Failed to reach Lumi backend.");
      addMessage({ role: "assistant", text: "❌ Sorry — I couldn't reach the backend." });
    } finally {
      setLumiTyping(false);
      setLoading(false);
    }
  };

  const confirmAndSend = async () => {
    if (!confirmTx) return;
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask not installed.");
      return;
    }

    try {
      setSendingTx(true);
      toast("Sending transaction — please confirm in your wallet...");

      // Use ethers via sendViaWallet (client signing)
      const tx = await sendViaWallet({ to: confirmTx.recipient, amount: String(confirmTx.amount) });
      toast.success("Transaction submitted! Waiting for confirmation...");
      addMessage({ role: "assistant", text: `✅ Transaction submitted. Hash: ${tx.hash}` });

      // optional: inform backend of tx
      try {
        await postSend(wallet, confirmTx.recipient, confirmTx.amount);
      } catch (e) {
        // not critical — show toast but continue
        console.warn("postSend failed", e);
      }

      // after confirmation wait
      await tx.wait(1);
      toast.success("Transaction confirmed 🎉");
      addMessage({ role: "assistant", text: `🎉 Transaction confirmed — Hash: ${tx.hash}` });
      setConfirmTx(null);
    } catch (err) {
      console.error("tx error", err);
      toast.error("Transaction failed or denied.");
      addMessage({ role: "assistant", text: `❌ Transaction failed: ${err?.message || err}` });
    } finally {
      setSendingTx(false);
    }
  };

  const cancelConfirm = () => {
    setConfirmTx(null);
    toast("Transaction cancelled");
  };

  const handleLogout = () => {
    try {
      disconnectWallet();
    } catch (e) {
      try { localStorage.removeItem('lumi_wallet'); } catch(_){}
    }
    setWallet(null);
    navigate('/');
  };

  const checkBalanceQuick = async () => {
    try {
      const b = await getBalance(wallet);
      toast.success(`Balance: ${b.balance} ${b.token} (≈ $${b.usdValue})`);
      addMessage({ role: "assistant", text: `Balance: ${b.balance} ${b.token} (≈ $${b.usdValue})` });
    } catch (err) {
      toast.error("Failed to fetch balance");
    }
  };

  // Typing indicator component
  const TypingDots = () => (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/6 rounded-full">
      <div className="w-2 h-2 rounded-full animate-bounce bg-white/80" />
      <div className="w-2 h-2 rounded-full animate-bounce delay-75 bg-white/60" />
      <div className="w-2 h-2 rounded-full animate-bounce delay-150 bg-white/40" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Toaster position="top-right" richColors />
      
      <div className="fixed inset-0 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#7f5af0']}
          particleCount={100}
          particleSpread={10}
          speed={0.08}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div> 
      <div className='w-full lg:h-[300px] h-[300px] absolute'>
      {/* <div style={{ width: '100%', height: '600px', position: 'absolute' }}> */}
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <Lottie animationData={SiriLogo} className='w-5' />
            <span className=" text-white text-lg font-semibold">LUMI-chat</span>
          </Link>
          <div className="hidden md:block text-sm text-slate-400">Conversational Web3 Companion</div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button
            onClick={checkBalanceQuick}
            className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm flex items-center gap-2"
            title="Balance"
          >
            <AlertCircle size={16} /> Balance
          </button> */}

          <div className="font-mono text-xs px-3 py-3 bg-white/5 rounded">
            {wallet ? wallet.slice(0,6) + "..." + wallet.slice(-4) : "Not connected"}
          </div>

          <button onClick={handleLogout} className="md:px-4 px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-sm flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

   
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-5 px-2 sm:px-0">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`p-2 rounded-full ${m.role === "user" ? "" : ""}`}>
                {m.role === "user" ? ''  :<Lottie animationData={SiriLogo} className='size-5' />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[60%] px-3 sm:px-4 py-3 rounded-2xl text-sm leading-6 wrap-break-word ${m.role === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-white/6 text-slate-100 rounded-bl-none"}`}
                dangerouslySetInnerHTML={{ __html: String(m.text).replace(/\n/g, "<br/>") }}
              />
            </motion.div>
          ))}

          {lumiTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="p-2 rounded-full "><Lottie animationData={SiriLogo} className='size-5' /></div>
              <div className="bg-white/6 px-4 py-3 rounded-2xl">
                <TypingDots />
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

 
      <div className="max-w-3xl mx-auto px-6 pb-3">
        <div className="flex gap-3">
          {quickActions.map((q) => (
            <button
              key={q.id}
              onClick={() => handleQuickAction(q.action)}
              className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/10 text-sm"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

   
      <footer className="p-4 border-t border-white/10 bg-black/20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Lumi: “What's my balance?” or “Send 0.01 BDAG to 0x...”"
            className="flex-1 rounded-full px-4 py-3 bg-white/6 border border-white/10 focus:outline-none text-white placeholder-white/40"
          />

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSend()}
            className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2"
            disabled={loading}
          >
            <Send size={16} />
            {loading ? "Thinking..." : "Send"}
          </motion.button>
        </div>
      </footer>

      {/* Transaction confirmation modal */}
      {confirmTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Confirm Transaction</h3>
                <p className="text-sm text-slate-400">Please confirm the transaction in your wallet</p>
              </div>
              <div className="text-sm text-slate-300 font-mono">{wallet ? wallet.slice(0,6) + "..." + wallet.slice(-4) : ""}</div>
            </div>

            <div className="mt-4">
              <div className="text-slate-400 text-xs">Recipient</div>
              <div className="mt-2 p-3 bg-white/6 rounded font-mono text-sm break-all">{confirmTx.recipient}</div>

              <div className="mt-3 text-slate-400 text-xs">Amount</div>
              <div className="mt-2 p-3 bg-white/6 rounded text-sm">{confirmTx.amount} BDAG</div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={cancelConfirm} className="px-4 py-2 rounded bg-white/6">Cancel</button>
              <button
                onClick={confirmAndSend}
                className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2"
                disabled={sendingTx}
              >
                {sendingTx ? "Sending..." : <><CheckCircle size={16} /> Confirm & Send</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
