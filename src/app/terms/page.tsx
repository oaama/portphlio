"use client"

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-headline font-bold mb-8">Terms of <span className="text-primary">Service</span></h1>
          <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8 leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Intellectual Property</h2>
              <p>
                The content, designs, and code displayed on this website are the intellectual property of Angelo, unless otherwise stated. Unauthorized reproduction is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Use License</h2>
              <p>
                Permission is granted to view the materials on this website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Disclaimer</h2>
              <p>
                The materials on this website are provided "as is". Angelo makes no warranties, expressed or implied, and hereby disclaims all other warranties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Governing Law</h2>
              <p>
                These terms are governed by the laws of Egypt, and any disputes shall be subject to the exclusive jurisdiction of its courts.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
