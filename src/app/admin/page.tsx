
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useProjectsAPI } from '@/hooks/use-projects-api';
import AdminLogin from '@/components/AdminLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2, Edit2, LogOut, Plus, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Project } from '@/hooks/use-projects-api';

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const { getProjects, createProject, updateProject, deleteProject, uploadImage, loading, error } = useProjectsAPI();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tech: [] as string[],
    image: '',
    demo: '',
    github: '',
    drive: ''
  });
  const [techInput, setTechInput] = useState('');

  // Check authentication and load projects
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        return;
      }
      loadProjects();
    };

    checkAuth();
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive'
      });
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.image || formData.tech.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        await updateProject(editingId, formData);
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await createProject(formData);
        toast({ title: 'Success', description: 'Project created successfully' });
      }
      
      setFormData({
        name: '',
        description: '',
        tech: [],
        image: '',
        demo: '',
        github: '',
        drive: ''
      });
      setEditingId(null);
      setIsFormOpen(false);
      loadProjects();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save project',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      tech: Array.isArray(project.tech) ? project.tech : project.tech.split(',').map(t => t.trim()),
      image: project.image,
      demo: project.demo || '',
      github: project.github || '',
      drive: project.drive || ''
    });
    setEditingId(project.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      toast({ title: 'Success', description: 'Project deleted successfully' });
      loadProjects();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete project',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      tech: [],
      image: '',
      demo: '',
      github: '',
      drive: ''
    });
  };

  // Show login if not authenticated
  if (!isAuthenticated()) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio Admin</h1>
            <p className="text-slate-400 text-sm">Manage your projects</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add/Edit Form */}
        {isFormOpen && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Project Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. E-commerce Platform"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Demo URL
                    </label>
                    <Input
                      type="url"
                      value={formData.demo}
                      onChange={(e) => setFormData(prev => ({ ...prev, demo: e.target.value }))}
                      placeholder="https://..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Project description..."
                      className="bg-slate-700 border-slate-600 text-white min-h-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      GitHub URL
                    </label>
                    <Input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Drive/Documentation URL
                    </label>
                    <Input
                      type="url"
                      value={formData.drive}
                      onChange={(e) => setFormData(prev => ({ ...prev, drive: e.target.value }))}
                      placeholder="https://..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Technology Stack */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Technologies * (Add one at a time)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="e.g. React, Node.js, MongoDB"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTech}
                      variant="outline"
                      className="border-slate-600 text-slate-200"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tech.map(tech => (
                      <div
                        key={tech}
                        className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="hover:text-blue-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Project Image * {uploadingImage ? '(Uploading...)' : ''}
                  </label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:border-slate-500 transition">
                        <Upload className="w-5 h-5 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-300 text-sm">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="mt-3">
                      <p className="text-slate-300 text-sm mb-2">Preview:</p>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="max-w-xs h-auto rounded-lg border border-slate-600"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingId ? 'Update Project' : 'Create Project'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Projects ({projects.length})</h2>
            {!isFormOpen && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            )}
          </div>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : projects.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-8">
                <p className="text-center text-slate-400">No projects yet. Create one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <Card key={project.id} className="bg-slate-800 border-slate-700 overflow-hidden">
                  <div className="aspect-video bg-slate-700 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-white mb-1">{project.name}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {Array.isArray(project.tech) ? project.tech.map((t: string) => (
                        <span
                          key={t}
                          className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs"
                        >
                          {t}
                        </span>
                      )) : (
                        <span className="text-slate-400 text-xs">
                          {project.tech}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
