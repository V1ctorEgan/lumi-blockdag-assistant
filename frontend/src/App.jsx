import Orb from './background/Orb';
import { useState } from 'react'
import { motion } from 'framer-motion';
import { ArrowRight, Zap, DollarSign, Target, CheckCircle , Wallet , Shield , LockIcon } from 'lucide-react';
import { Sparkles } from "lucide-react";
import './App.css'
import lumichat from './lumichat.json'

import NetworkBackground from "./background/BlockchainNodesAnimation";




import Lottie from 'lottie-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=''>

<div style={{ width: '100%', height: '600px', position: 'absolute' }}>
  <Orb
    hoverIntensity={0.5}
    rotateOnHover={true}
    hue={0}
    forceHoverState={false}
  />
</div>
      <section className="pt-10  md:mt-3 pb-10  lg:px-12 px-3 flex items-center    ">
      <div className=" mx-auto grid lg:grid-cols-2 gap-12 items-center pt-5 ">
        {/* Left: copy + CTA */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Powered by BlockDAG</span>
          </div>
          <h1
            className="hero-headline text-4xl md:text-5xl font-extrabold leading-tight mb-4"
           
          >
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-200 via-white to-cyan-200 drop-shadow-[0_6px_30px_rgba(69,90,255,0.08)]">
               Lumi — Your Conversational Web3 Companion
            </span>
            <br />
            {/* <span className="block text-slate-200/95"> Chat with your crypto wallet. Get insights. Stay informed.</span> */}
          </h1>

          <p className="hero-sub text-lg text-slate-300 max-w-xl mb-6">
            Swap tokens, check balances, monitor gas fees, and manage your entire Web3 life — just by talking to Lumi
          {/* Chat with your crypto wallet. Get insights. Stay informed. */}
          </p>

          <div className="flex items-center gap-4">
            <motion.a
              whileHover={{ y: -3 }}
              href="/swap"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold bg-linear-to-r from-[#06b6d4] to-[#6d28d9] text-black shadow-[0_12px_50px_rgba(6,182,212,0.12)]"
            >
              Start Chatting <ArrowRight />
            </motion.a>

         
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

          {/* small trust badges */}
          <div className="mt-8 flex gap-4 items-center text-sm text-slate-400">
            <div className="glass rounded-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">⚡</div>
              <div>
                <div className="font-semibold text-sm text-slate-100">Instant Swap </div>
                <div className="text-xs text-slate-400 hidden md:block">Sub-second swap estimates</div>
              </div>
            </div>

            <div className="glass p-3 rounded-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6D28D9]/20 flex items-center justify-center text-[#6D28D9]">🔒</div>
              <div>
                <div className="font-semibold text-sm text-slate-100">Immutable receipts</div>
                <div className="text-xs text-slate-400 hidden md:block">Future smart contract support</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: fancy glass card with clip-path image + details */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className=" justify-center hidden md:flex">
          {/* Card wrapper */}
          <div className="relative w-full max-w-lg card-clip">
            {/* Background image area - you'll supply an image path here */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              aria-hidden
              style={{
                // TODO: replace this URL with your own card image path or pass as prop
                backgroundImage: `url('/images/your-card-image.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                mixBlendMode: "overlay",
                opacity: 0.12,
              }}
            />

            {/* glass card */}
         <div>
           <div className='  scale-125'>
   

          <Lottie animationData={lumichat} className='' />
         </div>

         </div>

            {/* decorative neon border (glow) */}
            <div
              className="pointer-events-none absolute -inset-0.5 rounded-2xl"
              style={{
                boxShadow: "0 20px 60px rgba(109,40,217,0.08), 0 6px 30px rgba(6,182,212,0.06) inset",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.02)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
     
       

     


    </div>
  )
}

export default App
