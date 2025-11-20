import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, DollarSign, Target, CheckCircle , Wallet , Shield , LockIcon } from 'lucide-react';



export default function Footer() {
  return (
    <div>
           <footer className="py-12 px-6 border-t border-white/6 mt-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-black">IS</div>
              <div>
                <div className="text-lg font-semibold">Lumi</div>
                <div className="text-slate-400 text-sm">BlockDAG-powered swaps</div>
              </div>
            </div>
            <p className="text-slate-400 mt-4 text-sm">© 2025 Lumi • Built by your team</p>
          </div>

          <div>
            <div className="flex gap-6">
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
            <form onSubmit={(e)=>e.preventDefault()} className="mt-3 flex gap-2">
              <input aria-label="Email" className="flex-1 px-3 py-2 rounded-md bg-[#061022] border border-white/6" placeholder="you@domain.com" />
              <button className="px-4 py-2 rounded-md bg-linear-to-r from-cyan-500 to-indigo-600 text-black">Subscribe</button>
            </form>
          </div>
        </div>

      </div>
    </footer>
      
    </div>
  )
}
