"use client"

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-headline font-bold mb-8">Privacy <span className="text-primary">Policy</span></h1>
          <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8 leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p>
                Welcome to Angelo's Portfolio. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Collection</h2>
              <p>
                We do not collect personal data unless you voluntarily provide it through the contact form (Name, Email, and Message). This data is used solely to facilitate communication via WhatsApp or Email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies & Tracking</h2>
              <p>
                Our website may use local storage (LocalStorage) to save your portfolio preferences or session data for a better user experience. We do not use third-party tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <p>
                Our site may contain links to external sites like LinkedIn or GitHub. We are not responsible for the privacy practices of these external platforms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Me</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact me at angluosr@gmail.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
