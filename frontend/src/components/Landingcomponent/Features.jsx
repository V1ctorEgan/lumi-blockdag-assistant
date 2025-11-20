import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, DollarSign, Target, CheckCircle , Wallet , Shield , LockIcon } from 'lucide-react';
import FeatureCard from '../features/FeatureCard';

const CARD_IMAGES = {
  feature1: './assets/cards/blockchain.jpg',
  feature2: '/assets/cards/feature2.jpg',
  feature3: '/assets/cards/feature3.jpg',
  heroCard: '/assets/cards/hero-card.jpg',
};

function Features() {
  const features = [
    { title: 'Lightning Fast', body: 'BlockDAG enables near-instant finality.', image: CARD_IMAGES.feature1, icon: Zap },
    { title: 'Best Price Routing', body: 'Aggregator routes to the optimal pool.', image: CARD_IMAGES.feature2, icon: DollarSign },
    { title: 'Silly Simple', body: 'Minimal UX while exposing advanced controls.', image: CARD_IMAGES.feature3, icon: Target },
    { title: 'Security', body: 'Maximum Security. Secure and safe', image: CARD_IMAGES.feature3, icon: LockIcon },
    { title: 'Flexibility', body: 'Flexible Solutions.', image: CARD_IMAGES.feature3, icon: Zap },
    { title: 'Reliable', body: 'it protects you assets.', image: CARD_IMAGES.feature3, icon: Shield },
  ];

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Features;