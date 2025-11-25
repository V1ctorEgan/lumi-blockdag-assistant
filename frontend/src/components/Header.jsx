// // src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lumilogo from '../Lumilogo.json';
import SiriLogo from '../SiriLogo.json';
import Lottie from 'lottie-react';

import {
  ContactIcon,
  NotebookIcon,
  WorkflowIcon,
  Wallet,
  LogOut
} from 'lucide-react';

import { connectWallet, getCurrentWallet, disconnectWallet } from "../utils/Wallet";

const navItems = [
  { path: '#howitworks', name: 'How IT Works', icon: WorkflowIcon },
  { path: '#contact', name: 'Contact', icon: ContactIcon },
  { path: '#actions', name: 'Actions', icon: NotebookIcon },
];

export default function Header() {
  const [address, setAddress] = useState(null);
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(localStorage.getItem('lumi_wallet') || null);

  useEffect(() => {
    const onStorage = () => setWallet(localStorage.getItem('lumi_wallet'));
    const onWalletChanged = (e) => {
      const addr = e?.detail?.address ?? localStorage.getItem('lumi_wallet');
      setWallet(addr);
      setAddress(addr);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('lumi_wallet_changed', onWalletChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('lumi_wallet_changed', onWalletChanged);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out');
    try {
      disconnectWallet();
    } catch (e) {
      try { localStorage.removeItem('lumi_wallet'); } catch(_){}
    }
    setWallet(null);
    setAddress(null);
    console.log('Logged out, navigating to home');
    navigate('/');
  };

  useEffect(() => {
    (async () => {
      const w = await getCurrentWallet();
      if (w) setAddress(w);
    })();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (!accounts.length) {
          disconnectWallet();
          setAddress(null);
          setWallet(null);
        } else {
          setAddress(accounts[0]);
          setWallet(accounts[0]);
          localStorage.setItem("lumi_wallet", accounts[0]);
        }
      });
    }
  }, []);

  const handleConnect = async () => {
    try {
      const w = await connectWallet();
      setAddress(w);
      setWallet(w);
      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 lg:px-10 px-1">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          <Link to="/" className="flex items-center gap-2">
            <Lottie animationData={SiriLogo} className='w-7' />
            <span className=" text-white text-lg font-semibold">LUMI-chat</span>
          </Link>

          <nav className="hidden md:flex items-center gap-3 bg-white/3 backdrop-blur-md px-2 py-1 rounded-full border border-white/6">
            {navItems.map((item) => (
              <div className='text-slate-400' key={item.name}>
                <a
                  href={item.path}
                  className={
                    `px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all 
                    text-slate-300 hover:text-white hover:bg-white/6`
                  }
                >
                  <item.icon size={16} />
                  {item.name}
                </a>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {wallet ? (
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-sm flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <motion.button
                aria-label="Connect wallet"
                onClick={handleConnect}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-5 py-2 rounded-2xl font-semibold text-white bg-linear-to-r from-cyan-500 to-indigo-600 shadow-lg border border-cyan-400/30 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl bg-black/0 hover:bg-black/25 transition-all pointer-events-none" />
                <div className="flex items-center gap-2 relative z-10">
                  <Wallet size={16} /> <span className="hidden sm:inline">Connect Wallet</span>
                </div>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
