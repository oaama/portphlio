
"use client"

import { motion } from 'framer-motion';
import { Building2, Sparkles } from 'lucide-react';
import { initialPortfolioData, PortfolioData } from '@/lib/portfolio-store';
import { useState, useEffect } from 'react';

export function About() {
  const [data, setData] = useState(initialPortfolioData);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load portfolio data', e);
      }
    }
  }, []);

  return (
    <section id="about" className="relative py-20 md:py-32 bg-card/30 border-y border-white/5 scroll-mt-32 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(214, 88, 248, 0.3), transparent 70%)"
        }}
        animate={{
          y: [0, 40, 0],
          scale: [0.9, 1.05, 0.9],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.25), transparent 70%)"
        }}
        animate={{
          y: [0, -40, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {data.about.imageUrl && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "backOut" }}
                className="mb-10 md:mb-12 relative"
              >
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-500">
                  <img 
                    src={data.about.imageUrl} 
                    alt="Angelo" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-headline font-bold mb-8 md:mb-10 tracking-tight uppercase px-2 text-gradient leading-tight">
              {data.about.title}
            </h2>
            <div className="space-y-6 md:space-y-8 text-muted-foreground text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
              <p>{data.about.bio}</p>
            </div>

            <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left w-full">
              {data.about.ventures.map((v: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: "backOut" }}
                  whileHover={{ y: -12, scale: 1.04 }}
                  className="glass p-8 md:p-10 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all duration-300">
                  <motion.div 
                    className="mb-6 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {i === 0 ? <Building2 className="text-primary" size={24} /> : <Sparkles className="text-primary" size={24} />}
                  </motion.div>
                  <h4 className="font-bold text-xl md:text-2xl mb-2">{v.title}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mb-5">{v.role}</p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{v.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
