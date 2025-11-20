// src/components/Header.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lumilogo from '../Lumilogo.json'
import SiriLogo from '../SiriLogo.json'
import Lottie from 'lottie-react'

// import Logo from '../assets/Logo.svg'; // add your logo here
import { LayoutDashboard, ArrowRightLeft, History, Settings, Wallet } from 'lucide-react';

const navItems = [
  { path: '/swap', name: 'Swap', icon: ArrowRightLeft },
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/history', name: 'History', icon: History },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 lg:px-10 px-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          <Link to="/" className="flex items-center gap-3">
            <Lottie animationData={SiriLogo} className='w-7'/>
            {/* <motion.img src={Logo} alt="IntentSwap" className="h-9 w-9" whileHover={{ rotate: 8 }} /> */}
            {/* <p className='text-white'>lumi</p> */}
            <span className="hidden md:inline text-white text-lg font-semibold">LUMI</span>
          </Link>
{/* 
          <nav className="hidden md:flex items-center gap-3 bg-white/3 backdrop-blur-md px-2 py-1 rounded-full border border-white/6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive ? 'bg-linear-to-r from-cyan-500 to-indigo-600 text-black shadow-[0_8px_40px_rgba(6,182,212,0.18)]' : 'text-slate-300 hover:text-white hover:bg-white/6'
                  }`
                }
              >
                <item.icon size={16} />
                {item.name}
              </NavLink>
            ))}
          </nav> */}

          <div className="flex items-center gap-4">
            <Link to="/settings" className="text-slate-300 hover:text-white transition-colors">
              {/* <Settings size={20} /> */}
            </Link>

            <motion.button
              aria-label="Connect wallet"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-5 py-2 rounded-2xl font-semibold text-white bg-linear-to-r from-cyan-500 to-indigo-600 shadow-lg border border-cyan-400/30 overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-black/0 hover:bg-black/25 transition-all pointer-events-none" />
              <div className="flex items-center gap-2 relative z-10">
                <Wallet size={16} /> <span className="hidden sm:inline">Connect Wallet</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
