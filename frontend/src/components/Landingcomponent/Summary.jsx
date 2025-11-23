import { motion } from "framer-motion";
export default function Summary() {
  const cards = [
    { title: 'Swap', desc: 'Core experience: select tokens, preview estimate, confirm.' },
    { title: 'Compare', desc: 'Compare prices across different liquidity routes.' },
    { title: 'Route Preview', desc: 'See step-by-step route: pools, fees, impact.' },
    { title: 'Settlement', desc: 'Receipt with proof and tx hash for audit.' },
  ];

  return (
    <section className="py-12 px-6">
       
        <h1 className=" text-white text-4xl text-center mb-4 font-bold">PROBLEM WE SOLVE </h1>

      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass p-5 rounded-xl border border-white/6">
              <div className="text-sm text-slate-300 font-semibold">{c.title}</div>
              <div className="mt-2 text-slate-200">{c.desc}</div>
            
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}