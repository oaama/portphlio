
"use client"

import { motion } from 'framer-motion';
import { initialPortfolioData, PortfolioData } from '@/lib/portfolio-store';
import { getTechIcon } from '@/lib/icons';
import { useState, useEffect } from 'react';

export function TechStack() {
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
    <section id="stack" className="relative py-24 scroll-mt-32 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute top-10 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(214, 88, 248, 0.2), transparent 70%)"
        }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-0 -left-40 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.15), transparent 70%)"
        }}
        animate={{
          y: [0, -30, 0],
          scale: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Mastering the <span className="text-primary">Tools</span></h2>
          <p className="text-muted-foreground">My technical arsenal for building world-class software.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {data.techStack.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "backOut" }}
              whileHover={{ y: -12, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="glass p-8 rounded-3xl border-white/5 text-center group transition-all hover:bg-primary hover:text-white cursor-pointer"
            >
              <motion.div 
                className="mb-4 flex justify-center text-primary group-hover:text-white transition-colors"
                whileHover={{ rotate: 15, scale: 1.2 }}
              >
                {getTechIcon(item.name, 32)}
              </motion.div>
              <h4 className="font-bold mb-1">{item.name}</h4>
              <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors uppercase tracking-widest font-bold">
                {item.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
