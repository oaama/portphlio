
"use client"

import { motion } from 'framer-motion';
import { ExternalLink, Github, FileBox, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/portfolio-store';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "backOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass rounded-3xl overflow-hidden border-white/5 flex flex-col group h-full shadow-xl hover:shadow-2xl transition-shadow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={project.image || 'https://picsum.photos/seed/placeholder/800/600'} 
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
              <ExternalLink size={20} />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
              <Github size={20} />
            </a>
          )}
          {project.drive && (
            <a href={project.drive} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
              <FileBox size={20} />
            </a>
          )}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(project.tech) ? project.tech : project.tech.split(',')).map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary/50 transition-colors"
            >
              {typeof t === 'string' ? t.trim() : t}
            </motion.span>
          ))}
        </div>
        <h3 className="text-2xl font-headline font-bold mb-3">{project.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
          {project.description}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
           <a 
             href={project.demo || '#'} 
             target="_blank" rel="noopener noreferrer"
             className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-70 transition-opacity"
           >
             View Live <ArrowRight size={14} />
           </a>
        </div>
      </div>
    </motion.div>
  );
}
