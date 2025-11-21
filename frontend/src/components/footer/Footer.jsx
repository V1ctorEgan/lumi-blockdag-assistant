import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, DollarSign, Target, CheckCircle , Wallet , Shield , LockIcon } from 'lucide-react';
import Lottie from 'lottie-react';
import SirrLogo from '../../SiriLogo.json'


export default function Footer() {
  return (
    <div>
           <footer className="py-12 px-6 border-t border-white/6 mt-10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className=' mt-8'>
            <div className=" items-center gap-3 ">
              <div className='flex  gap-2 items-center'>
                <Lottie animationData={SirrLogo} className='size-4'/>
                <div className="text-md font-semibold text-slate-400">Lumi</div>

              </div>
          
                <div className="text-slate-400 text-sm">BlockDAG-powered chat</div>
           
            </div>
            <p className="text-slate-400 mt-1 text-sm">© 2025 Lumi • Built by Aurion</p>
          </div>

          <div>
            <div className="flex gap-6 ">
              <div>
                <h5 className="font-semibold">Product</h5>
                <ul className="text-slate-400 text-sm mt-3 space-y-2">
                  <li>Lumi</li>
                  <li>History</li>
                  <li>Dashboard</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold">Company</h5>
                <ul className="text-slate-400 text-sm mt-3 space-y-2">
                  <li>About</li>
                  <li>Docs</li>
                  <li>Support</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold">Stay updated</h5>
            <p className="text-slate-400 text-sm mt-3">Subscribe for product updates</p>
            <form onSubmit={(e)=>e.preventDefault()} className="mt-3 flex">
              <input aria-label="Email" className="flex-1 px-3 py-2 rounded-l-md bg-[#061022] border border-white/6" placeholder="Aurion@domain.com" />
              <button className="lg:px-4 px-2 py-2 rounded-r-md bg-linear-to-r from-cyan-500 to-indigo-600 text-black">Subscribe</button>
            </form>
          </div>
        </div>

      </div>
    </footer>
      
    </div>
  )
}
