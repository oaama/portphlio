
import { 
  Atom, 
  Smartphone, 
  Database, 
  Cpu, 
  Code, 
  Layers, 
  Server, 
  Zap, 
  Palette, 
  Github, 
  Terminal,
  Globe,
  Layout,
  Flame,
  Wind
} from 'lucide-react';
import React from 'react';

export const getTechIcon = (name: string, size = 24) => {
  const n = name.toLowerCase();
  
  if (n.includes('react') || n.includes('next') || n.includes('native')) return <Atom size={size} />;
  if (n.includes('flutter') || n.includes('dart') || n.includes('mobile')) return <Smartphone size={size} />;
  if (n.includes('node') || n.includes('backend') || n.includes('express')) return <Server size={size} />;
  if (n.includes('firebase') || n.includes('flame')) return <Flame size={size} />;
  if (n.includes('cloud') || n.includes('aws') || n.includes('google cloud') || n.includes('azure') || n.includes('database') || n.includes('mongo') || n.includes('sql')) return <Database size={size} />;
  if (n.includes('tailwind') || n.includes('wind')) return <Wind size={size} />;
  if (n.includes('css') || n.includes('style') || n.includes('sass') || n.includes('less')) return <Layers size={size} />;
  if (n.includes('js') || n.includes('ts') || n.includes('javascript') || n.includes('typescript') || n.includes('code')) return <Code size={size} />;
  if (n.includes('design') || n.includes('figma') || n.includes('adobe') || n.includes('ui') || n.includes('ux')) return <Palette size={size} />;
  if (n.includes('github') || n.includes('git') || n.includes('gitlab')) return <Github size={size} />;
  if (n.includes('python') || n.includes('terminal') || n.includes('bash') || n.includes('shell')) return <Terminal size={size} />;
  if (n.includes('web') || n.includes('browser')) return <Globe size={size} />;
  if (n.includes('layout') || n.includes('frontend')) return <Layout size={size} />;
  
  return <Zap size={size} />;
};
