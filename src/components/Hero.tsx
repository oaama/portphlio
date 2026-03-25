
"use client"

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { initialPortfolioData } from '@/lib/portfolio-store';
import { useState, useEffect } from 'react';

export function Hero() {
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

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.025, 
        delayChildren: 0.05 * i 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.08,
        ease: "backOut",
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
  };

  const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
    return (
      <motion.span
        variants={container}
        initial="hidden"
        animate="visible"
        className={className}
        style={{ display: 'inline-block' }}
      >
        {text.split("").map((char, index) => (
          <motion.span variants={child} key={index} style={{ display: 'inline-block' }}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-background">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
      
      {/* Floating Animated Boxes */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 border border-primary/30 rounded-3xl"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 5, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-16 w-40 h-40 border-2 border-accent/40 rounded-2xl bg-accent/5"
        animate={{
          y: [0, 40, 0],
          x: [0, 15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/3 w-24 h-24 border border-primary/40 rounded-full bg-primary/5"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Large Animated Orbs with Glow */}
      <motion.div 
        className="absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(214, 88, 248, 0.4), rgba(214, 88, 248, 0.1) 70%)"
        }}
        animate={{
          y: [0, 60, 0],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.35), rgba(59, 130, 246, 0.05) 70%)"
        }}
        animate={{
          y: [0, -60, 0],
          x: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Animated Float Dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
          style={{
            left: `${20 + i * 18}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Animated Gradient Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(214, 88, 248)" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
        <motion.path
          d="M -200,0 Q 300,200 800,100"
          stroke="url(#lineGrad1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.4, 0.8, 0.4] }}
          transition={{
            pathLength: { duration: 4, repeat: Infinity },
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.path
          d="M 0,400 Q 400,-100 1000,200"
          stroke="url(#lineGrad1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3] }}
          transition={{
            pathLength: { duration: 5, repeat: Infinity, delay: 0.5 },
            opacity: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        />
      </svg>

      {/* Pulsing Center Glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(214, 88, 248, 0.2), transparent 70%)"
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-headline font-bold leading-[1.1] md:leading-[0.9] mb-8 tracking-tighter">
              <AnimatedText text={data.hero.name} /> <br />
              <span className="text-muted-foreground">
                <AnimatedText text="Specialist in" />
              </span> <br />
              <AnimatedText text={data.hero.specialty} className="text-gradient" />
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="text-base md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl leading-relaxed"
            >
              {data.hero.bio}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-5 justify-start items-start sm:items-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/#projects" 
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-110 active:scale-95 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40"
                >
                  View Projects
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/#contact" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-secondary text-foreground border border-white/5 rounded-2xl font-bold transition-all hover:bg-white/10 hover:border-primary/30"
                >
                  Contact Me
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
