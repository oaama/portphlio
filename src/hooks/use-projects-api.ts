'use client';

import { useState, useCallback } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  image: string;
  demo?: string;
  github?: string;
  drive?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

export function useProjectsAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get auth token
  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }, []);

  // Helper to construct headers with auth
  const getHeaders = useCallback((includeAuth = true) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }, [getAuthToken]);

  // Get all projects (public - no auth required)
  const getProjects = useCallback(async (): Promise<Project[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/projects`);
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch projects');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project (requires auth)
  const createProject = useCallback(async (project: Omit<Project, 'id'>): Promise<Project> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(project)
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to create project');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Update project (requires auth)
  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<Project> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(updates)
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to update project');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Delete project (requires auth)
  const deleteProject = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Upload image (requires auth)
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ image: base64, filename: file.name })
      });
      const result = await response.json();
      if (result.success) {
        return result.data.url;
      }
      throw new Error(result.error || 'Failed to upload image');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  return {
    loading,
    error,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadImage
  };
}

// Authentication Hook
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (password: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const result = await response.json();
      if (result.success && result.token) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', result.token);
        }
        return result.token;
      }
      throw new Error(result.error || 'Login failed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }, []);

  return { login, logout, isAuthenticated, loading, error };
}
