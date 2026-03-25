
"use client"

import { motion } from 'framer-motion';
import { Mail, MessageCircle, Github, Linkedin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { initialPortfolioData, PortfolioData } from '@/lib/portfolio-store';
import { useState, useEffect } from 'react';

export function Contact() {
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

  const socials = [
    { 
      icon: <Mail />, 
      label: 'Email', 
      value: data.contact.email, 
      href: `mailto:${data.contact.email}` 
    },
    { 
      icon: <MessageCircle />, 
      label: 'WhatsApp', 
      value: data.contact.whatsapp, 
      href: `https://wa.me/${data.contact.whatsapp.replace(/\D/g, '')}` 
    },
    { 
      icon: <Linkedin />, 
      label: 'LinkedIn', 
      value: 'LinkedIn Profile', 
      href: data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://linkedin.com/in/${data.contact.linkedin.replace(/.*\//, '')}` 
    },
    { 
      icon: <Github />, 
      label: 'GitHub', 
      value: data.contact.github, 
      href: data.contact.github.startsWith('http') ? data.contact.github : `https://github.com/${data.contact.github.replace('@', '')}` 
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const whatsappNumber = data.contact.whatsapp.replace(/\D/g, '');
    const text = `Hello Angelo! 🚀\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
    const encodedText = encodeURIComponent(text);
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
    
    toast({
      title: "Opening WhatsApp...",
      description: "Redirecting you to start a conversation.",
    });
  };

  return (
    <section id="contact" className="relative py-24 bg-card/20 border-t border-white/5 scroll-mt-32 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute top-1/4 -right-32 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(214, 88, 248, 0.25), transparent 70%)"
        }}
        animate={{
          y: [0, 40, 0],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 -left-40 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2), transparent 70%)"
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 tracking-tight">
                Let's <span className="text-primary">Collaborate</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-12">
                Have a project in mind or just want to say hello? My inbox is always open.
              </p>

              <div className="space-y-8">
                {socials.map((social, i) => (
                  <motion.a 
                    key={i} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: "backOut" }}
                    whileHover={{ x: 16, scale: 1.03 }}
                    className="flex items-center gap-6 group hover:text-primary transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 glass flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-white transition-all"
                    >
                      {social.icon}
                    </motion.div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
                        {social.label}
                      </p>
                      <p className="text-lg font-bold truncate max-w-[200px] md:max-w-xs">{social.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0, duration: 0.5, ease: "backOut" }}
                  >
                    <label className="text-xs font-bold uppercase tracking-widest ml-1">Name</label>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="relative"
                    >
                      <Input 
                        name="name" 
                        placeholder="Your Name" 
                        className="bg-white/5 border-white/10 h-14 rounded-xl focus-visible:ring-primary transition-all focus-visible:bg-white/10 focus-visible:scale-105" 
                        required 
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "backOut" }}
                  >
                    <label className="text-xs font-bold uppercase tracking-widest ml-1">Email</label>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="relative"
                    >
                      <Input 
                        name="email" 
                        type="email" 
                        placeholder="Your Email" 
                        className="bg-white/5 border-white/10 h-14 rounded-xl focus-visible:ring-primary transition-all focus-visible:bg-white/10 focus-visible:scale-105" 
                        required 
                      />
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                >
                  <label className="text-xs font-bold uppercase tracking-widest ml-1">Message</label>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative"
                  >
                    <Textarea 
                      name="message" 
                      placeholder="Tell me about your project..." 
                      className="bg-white/5 border-white/10 min-h-[150px] rounded-xl focus-visible:ring-primary py-4 transition-all focus-visible:bg-white/10 focus-visible:scale-105" 
                      required 
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                    Send to WhatsApp <Send size={18} />
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
