import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, DollarSign, Target, CheckCircle , Wallet , Shield , LockIcon } from 'lucide-react';






export default function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative card-clip overflow-hidden rounded-2xl"
      style={{ minHeight: 220 }}
    >
      {/* clipped image background (top-left diagonal reveal) */}
      <div className="absolute inset-0">
        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />
      </div>

      <div className="glass p-6 h-full relative">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-black"><Icon size={18} /></div>
          <div>
            <h4 className="text-xl font-semibold">{feature.title}</h4>
            <p className="text-slate-300 mt-1">{feature.body}</p>
          </div>
        </div>

        <div className="absolute -left-6 -top-6 w-40 h-40 bg-linear-to-br from-cyan-500/10 to-indigo-600/6 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 20% 100%, 0 100%)' }} />

        <div className="mt-6">
          <button className="text-sm text-cyan-400 hover:underline flex items-center gap-2">
            Learn more <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

