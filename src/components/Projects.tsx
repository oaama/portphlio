
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[] | string;
  image: string;
  demo?: string;
  github?: string;
  drive?: string;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Zone A - Tech Academy',
    description: 'Integrated software house and academy empowering businesses and developers with cutting-edge solutions.',
    tech: ['React', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    demo: 'https://zone-a.com',
    github: 'https://github.com'
  },
  {
    id: '2',
    name: 'Sidra - Digital Transformation',
    description: 'Innovative tech venture focused on driving digital transformation through unique software products.',
    tech: ['Flutter', 'Firebase', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1516534775068-bb57e39c139f?w=500&h=400&fit=crop',
    demo: 'https://sidra-app.com',
    github: 'https://github.com'
  },
  {
    id: '3',
    name: 'Portfolio Platform',
    description: 'Modern web portfolio with admin dashboard for managing projects and content dynamically.',
    tech: ['Next.js', 'Express', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db13?w=500&h=400&fit=crop',
    demo: 'https://portfolio.example.com',
    github: 'https://github.com'
  }
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // أولاً حاول قراءة من localStorage
        const saved = localStorage.getItem('portfolio_data');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.projects && data.projects.length > 0) {
              setProjects(data.projects);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse localStorage data', e);
          }
        }

        // إذا ما موجود في localStorage أو فارغ، حاول الـ API
        const response = await fetch('/api/projects');
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          setProjects(result.data);
        }
      } catch (error) {
        console.warn('Backend unavailable, using fallback projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative py-24 scroll-mt-32 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute top-1/3 -left-64 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(214, 88, 248, 0.25), transparent 70%)"
        }}
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute -bottom-40 right-0 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2), transparent 70%)"
        }}
        animate={{
          y: [0, -50, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight">
              Selected <span className="text-gradient">Creations</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              A collection of digital experiences built across web and mobile platforms, solving real-world challenges.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-3xl" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
