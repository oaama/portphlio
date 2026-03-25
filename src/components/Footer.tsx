
"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <motion.div 
            initial={{ rotate: -3 }}
            whileHover={{ rotate: -12 }}
            className="px-2 h-8 bg-primary/20 flex items-center justify-center rounded-lg"
          >
            <span className="font-headline font-bold text-primary">Eng</span>
          </motion.div>
          <span className="font-headline font-bold text-xl tracking-tighter uppercase">ANGELO</span>
        </motion.div>

        <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
          © {currentYear} Developed & Designed with passion by Angelo.
        </p>

        <div className="flex items-center gap-8">
          <motion.div
            whileHover={{ y: -2 }}
          >
            <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:w-0 hover:after:w-full after:transition-all after:duration-300">Privacy</Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
          >
            <Link href="/terms" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:w-0 hover:after:w-full after:transition-all after:duration-300">Terms</Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
