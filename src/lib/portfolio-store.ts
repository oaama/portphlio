
"use client"

export interface Venture {
  title: string;
  role: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  image: string;
  demo: string;
  github: string;
}

export interface TechItem {
  id: string;
  name: string;
  category: 'Web' | 'Mobile' | 'Backend' | 'Cloud';
}

export interface PortfolioData {
  hero: {
    name: string;
    specialty: string;
    bio: string;
    imageUrl?: string;
  };
  about: {
    title: string;
    bio: string;
    ventures: Venture[];
    imageUrl?: string;
  };
  projects: Project[];
  techStack: TechItem[];
  contact: {
    email: string;
    whatsapp: string;
    linkedin: string;
    github: string;
  };
}

export const initialPortfolioData: PortfolioData = {
  hero: {
    name: "Angelo",
    specialty: "Web & Flutter",
    bio: "I build modern websites and powerful mobile applications. Founder of Zone A & Sidra. Driven by code, led by innovation.",
    imageUrl: "https://picsum.photos/seed/angelo-hero/800/800"
  },
  about: {
    title: "Driven by Innovation, Led by Passion.",
    bio: "I am a Software Engineer based in Egypt, specializing in crafting premium web experiences and cross-platform mobile applications using Flutter. I focus on creating clean, efficient, and scalable code that solves real-world problems.",
    imageUrl: "https://picsum.photos/seed/angelo-about/800/800",
    ventures: [
      {
        title: "Zone A",
        role: "Founder & CEO",
        description: "An integrated software house and tech academy empowering businesses and developers with cutting-edge solutions."
      },
      {
        title: "Sidra",
        role: "Founder",
        description: "Innovative tech venture focused on driving digital transformation through unique software products."
      }
    ]
  },
  projects: [],
  techStack: [
    { id: '1', name: 'React', category: 'Web' },
    { id: '2', name: 'Flutter', category: 'Mobile' },
    { id: '3', name: 'Node.js', category: 'Backend' },
    { id: '4', name: 'Firebase', category: 'Cloud' },
    { id: '5', name: 'Next.js', category: 'Web' },
    { id: '6', name: 'Tailwind CSS', category: 'Web' }
  ],
  contact: {
    email: "angluosr@gmail.com",
    whatsapp: "+201127570256",
    linkedin: "https://www.linkedin.com/in/angluos-rezq-4405b221a/",
    github: "@oaama"
  }
};
