
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 3D Tilt Effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple simulated local login
    // Email: admin@zonea.com, Password: admin
    setTimeout(() => {
      if (email === 'admin@zonea.com' && password === 'admin') {
        localStorage.setItem('is_admin_auth', 'true');
        toast({ title: "Welcome back, Angelo", description: "Simulated login successful." });
        router.push('/dash-admin');
      } else {
        toast({ 
          title: "Access Denied", 
          description: "Invalid credentials. Use admin@zonea.com / admin", 
          variant: "destructive" 
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden relative">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-white/10 shadow-2xl overflow-hidden group rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6 relative group">
              <ShieldCheck className="text-primary group-hover:scale-110 transition-transform" size={48} />
            </div>
            <CardTitle className="text-3xl font-headline font-bold tracking-tight mb-2">
              <span className="text-gradient">Admin Access</span>
            </CardTitle>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em]">Frontend Simulated Portal</p>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email (admin@zonea.com)</label>
                  <Input 
                    type="email" 
                    placeholder="admin@zonea.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password (admin)</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 font-bold text-lg bg-primary hover:bg-primary/90 text-white rounded-2xl flex items-center justify-center gap-3 transition-all"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Enter Dashboard"}
              </Button>
            </form>
          </CardContent>
          
          <div className="p-8 text-center border-t border-white/5 bg-white/[0.02]">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
              Simulated Auth (No Backend Required)
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
