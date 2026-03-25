
"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Edit, LogOut, User, Briefcase, Cpu, Phone, LayoutGrid, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  PortfolioData, 
  TechItem, 
  Venture, 
  Project,
  initialPortfolioData
} from '@/lib/portfolio-store';
import { getTechIcon } from '@/lib/icons';

export default function DashAdminPage() {
  const router = useRouter();

  const [localData, setLocalData] = useState<PortfolioData>(initialPortfolioData);
  const [newTechCategory, setNewTechCategory] = useState<TechItem['category']>('Web');
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const aboutFileRef = useRef<HTMLInputElement>(null);
  const projectFileRef = useRef<HTMLInputElement>(null);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const isAuth = localStorage.getItem('is_admin_auth');
    if (!isAuth) {
      router.push('/login');
      return;
    }
    
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        setLocalData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('is_admin_auth');
    router.push('/login');
  };

  const persistData = (newData: PortfolioData) => {
    setLocalData(newData);
    localStorage.setItem('portfolio_data', JSON.stringify(newData));
    toast({ title: "Updated", description: "Changes saved locally." });
  };

  const updateHero = (field: keyof PortfolioData['hero'], value: string) => {
    persistData({ ...localData, hero: { ...localData.hero, [field]: value } });
  };

  const updateContact = (field: keyof PortfolioData['contact'], value: string) => {
    persistData({ ...localData, contact: { ...localData.contact, [field]: value } });
  };

  const updateAbout = (field: keyof Omit<PortfolioData['about'], 'ventures'>, value: string) => {
    persistData({ ...localData, about: { ...localData.about, [field]: value } });
  };

  const updateVenture = (index: number, field: keyof Venture, value: string) => {
    const newVentures = [...localData.about.ventures];
    newVentures[index] = { ...newVentures[index], [field]: value };
    persistData({ ...localData, about: { ...localData.about, ventures: newVentures } });
  };

  const handleFileUpload = async (file: File, type: string, onComplete: (url: string) => void) => {
    setIsUploading(type);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // استخدم /api/upload بدلاً من الـ backend القديم
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data.secure_url) {
        const imageUrl = data.data.secure_url;
        onComplete(imageUrl);
        toast({ title: "Success", description: "Image uploaded successfully!" });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to upload image.",
        variant: "destructive" 
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleSaveProject = () => {
    const projectId = editingProjectId || Date.now().toString();
    const projectToSave: Project = { ...projectForm, id: projectId };
    
    let updatedProjects = localData.projects || [];
    if (editingProjectId) {
      updatedProjects = updatedProjects.map(p => p.id === editingProjectId ? projectToSave : p);
    } else {
      updatedProjects = [...updatedProjects, projectToSave];
    }
    
    persistData({ ...localData, projects: updatedProjects });
    
    setIsAddingProject(false);
    setEditingProjectId(null);
    setProjectForm({ name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: '' });
    toast({ title: "Project Saved", description: editingProjectId ? "Updated successfully." : "Added to portfolio." });
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = (localData.projects || []).filter(p => p.id !== id);
    persistData({ ...localData, projects: updatedProjects });
    toast({ title: "Project Removed", description: "Deleted from portfolio." });
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    const newItem: TechItem = { 
      id: Date.now().toString(), 
      name: techInput.trim(), 
      category: newTechCategory 
    };
    persistData({ ...localData, techStack: [...localData.techStack, newItem] });
    setTechInput('');
  };

  const removeTech = (id: string) => {
    persistData({ ...localData, techStack: localData.techStack.filter(t => t.id !== id) });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" size={48}/></div>;

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12 bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-bold mb-1">Portfolio Manager</h1>
            <p className="text-xs text-primary font-bold uppercase tracking-widest">Local Storage (Admin Dashboard)</p>
          </div>
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-destructive gap-2 rounded-xl" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <div className="overflow-x-auto no-scrollbar pb-2">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-max flex">
              <TabsTrigger value="hero" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><User size={14}/> Hero</TabsTrigger>
              <TabsTrigger value="about" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><Briefcase size={14}/> About</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><LayoutGrid size={14}/> Projects</TabsTrigger>
              <TabsTrigger value="tech" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><Cpu size={14}/> Tech</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><Phone size={14}/> Contact</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hero">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Your Name</label>
                  <Input value={localData.hero.name} onChange={e => updateHero('name', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Specialty / Title</label>
                  <Input value={localData.hero.specialty} onChange={e => updateHero('specialty', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Short Bio</label>
                <Textarea value={localData.hero.bio} onChange={e => updateHero('bio', e.target.value)} rows={3} className="bg-white/5 border-white/10 rounded-2xl p-4" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">About Title</label>
                  <Input value={localData.about.title} onChange={e => updateAbout('title', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <Input 
                      value={localData.about.imageUrl || ''} 
                      onChange={e => updateAbout('imageUrl', e.target.value)} 
                      placeholder="Image URL" 
                      className="bg-white/5 border-white/10 h-14 rounded-2xl" 
                    />
                    <Button 
                      variant="secondary" 
                      className="rounded-2xl h-14 px-5 gap-2"
                      onClick={() => aboutFileRef.current?.click()}
                      disabled={!!isUploading}
                    >
                      {isUploading === 'about' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={18}/>}
                    </Button>
                    <input type="file" ref={aboutFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'about', (url) => updateAbout('imageUrl', url)); }} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Main Description</label>
                <Textarea value={localData.about.bio} onChange={e => updateAbout('bio', e.target.value)} rows={4} className="bg-white/5 border-white/10 rounded-2xl p-4" />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Featured Ventures</h4>
                <div className="grid gap-4">
                  {localData.about.ventures.map((v, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 grid md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Title</label>
                        <Input placeholder="Venture Name" value={v.title} onChange={e => updateVenture(i, 'title', e.target.value)} className="bg-black/20 border-white/5 rounded-xl h-12" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Role</label>
                        <Input placeholder="Your Role" value={v.role} onChange={e => updateVenture(i, 'role', e.target.value)} className="bg-black/20 border-white/5 rounded-xl h-12" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Summary</label>
                        <Input placeholder="Short Summary" value={v.description} onChange={e => updateVenture(i, 'description', e.target.value)} className="bg-black/20 border-white/5 rounded-xl h-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass rounded-[2.5rem] border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="font-headline font-bold text-xl">Projects</h3>
                <Button size="sm" onClick={() => { setEditingProjectId(null); setProjectForm({name:'', description:'', tech:'', image:'https://picsum.photos/seed/1/800/600', demo:'', github:''}); setIsAddingProject(true); }} className="bg-primary rounded-2xl px-6 h-12">
                  <Plus size={18} className="mr-2"/> New Project
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="py-6 px-8">Project Name</TableHead>
                      <TableHead className="py-6">Stack</TableHead>
                      <TableHead className="py-6 text-right px-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(localData.projects || []).map((p) => (
                      <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.01]">
                        <TableCell className="font-bold px-8 py-5">{p.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.tech}</TableCell>
                        <TableCell className="text-right space-x-2 px-8 py-5">
                          <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-primary/10 rounded-xl" onClick={() => { setEditingProjectId(p.id); setProjectForm({...p}); setIsAddingProject(true); }}>
                            <Edit size={16}/>
                          </Button>
                          <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-xl" onClick={() => handleDeleteProject(p.id)}>
                            <Trash2 size={16}/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10 space-y-10">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Tool Name</label>
                  <Input 
                    placeholder="e.g. Next.js" 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-14" 
                  />
                </div>
                <div className="space-y-2 w-full sm:w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Category</label>
                  <Select value={newTechCategory} onValueChange={(v) => setNewTechCategory(v as TechItem['category'])}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 rounded-2xl">
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Cloud">Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addTech} className="bg-primary h-14 rounded-2xl px-10">Add Tool</Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {localData.techStack.map(t => (
                  <div key={t.id} className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col items-center gap-3 hover:border-primary/30 transition-all text-center">
                    <div className="text-primary">{getTechIcon(t.name, 28)}</div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" 
                      onClick={() => removeTech(t.id)}
                    >
                      <Trash2 size={12}/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Public Email</label>
                  <Input value={localData.contact.email} onChange={e => updateContact('email', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">WhatsApp Number</label>
                  <Input value={localData.contact.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">LinkedIn Link</label>
                  <Input value={localData.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">GitHub Username</label>
                  <Input value={localData.contact.github} onChange={e => updateContact('github', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isAddingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
             <div className="glass w-full max-w-2xl p-8 md:p-10 rounded-[3rem] border-white/10 my-10 relative">
                <h3 className="text-2xl font-headline font-bold mb-8">{editingProjectId ? 'Update Project' : 'New Creation'}</h3>
                <div className="space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Name</label>
                      <Input placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Description</label>
                      <Textarea placeholder="What did you build?" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl p-4 h-32" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Stack (Separated by commas)</label>
                      <Input placeholder="e.g. Flutter, Firebase, Dart" value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                   </div>
                   
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Cover Image</label>
                      <div className="flex items-center gap-4">
                        <Input placeholder="Image URL or Base64" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                        <Button variant="secondary" className="h-14 rounded-2xl px-5" onClick={() => projectFileRef.current?.click()}>
                          {isUploading === 'project' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={18}/>}
                        </Button>
                        <input type="file" ref={projectFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'project', (url) => setProjectForm({...projectForm, image: url})); }} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Live Demo</label>
                      <Input placeholder="URL" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Source Code</label>
                      <Input placeholder="GitHub URL" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                   <Button variant="ghost" onClick={() => setIsAddingProject(false)} className="rounded-2xl h-14 px-8">Cancel</Button>
                   <Button onClick={handleSaveProject} className="bg-primary px-12 rounded-2xl h-14 font-bold shadow-xl shadow-primary/20">Save Project</Button>
                </div>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
