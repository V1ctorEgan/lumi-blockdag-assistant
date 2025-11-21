import React from 'react';
import { Wallet, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import Lottie from 'lottie-react';
import Swapcoin from '../../Swapcoin.json'
import receipt from '../../receipt.json'
import MoneyTransfer from '../../MoneyTransfer.json'
import Notificationbell from '../../Notificationbell.json'

export default function AnimationStack() {
  const features = [
    {
      icon: <ArrowRight size={36} className="text-cyan-400" />,
      title: 'Swap Coins Instantly',
      description: 'Swap any token directly through chat — no wallet menus needed.',
      animation: Swapcoin
    },
    {
      icon: <Wallet size={36} className="text-indigo-400" />,
      title: 'Check Balances & Receipts',
      description: 'See your wallet balance, gas fees, and transaction history instantly.',
      animation: receipt
    },
    {
      icon: <Zap size={36} className="text-yellow-400" />,
      title: 'Send Money Safely',
      description: 'Transfer crypto through chat with automatic warnings for risky transactions.',
      animation: MoneyTransfer
    },
    {
      icon: <AlertCircle size={36} className="text-red-400" />,
      title: 'Alerts & Smart Notifications',
      description: 'Get notified of unusual activity, gas spikes, or low balances.',
      animation: Notificationbell
    },
  ];

  return (
    <section className="relative w-full bg-black text-white py-24">
      <div className="container mx-auto space-y-5">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
         LUMI Chat-Based  Actions
          <span id="actions" ></span>
        </h2>

        {features.map((feature, index) => (
          <div
            key={index}
            className="sticky lg:mx-10 mx-3 top-32 flex flex-col md:flex-row items-center justify-between gap-12 bg-gray-900 p-8 rounded-3xl shadow-lg"
          >
        
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-sm md:text-base">{feature.description}</p>
            </div>

         
            <div className="flex-1 flex items-center justify-center min-h-[200px] bg-gray-800 rounded-xl">
          
              <span className="text-slate-500">
                <Lottie animationData={feature.animation} className="w-50 h-50" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
