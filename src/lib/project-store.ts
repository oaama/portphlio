
"use client"

import initialData from '@/data/projects.json';

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  image: string;
  demo: string;
  github: string;
  drive: string;
}

const STORAGE_KEY = 'apex_portfolio_projects';

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return initialData.projects;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData.projects));
    return initialData.projects;
  }
  return JSON.parse(stored);
};

export const saveProjects = (projects: Project[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const addProject = (project: Omit<Project, 'id'>) => {
  const projects = getProjects();
  const newProject = { ...project, id: Date.now().toString() };
  const updated = [...projects, newProject];
  saveProjects(updated);
  return newProject;
};

export const deleteProject = (id: string) => {
  const projects = getProjects();
  const updated = projects.filter(p => p.id !== id);
  saveProjects(updated);
};

export const updateProject = (project: Project) => {
  const projects = getProjects();
  const updated = projects.map(p => p.id === project.id ? project : p);
  saveProjects(updated);
};
