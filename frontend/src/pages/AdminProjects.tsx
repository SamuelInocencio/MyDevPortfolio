import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Edit3,
  Image as ImageIcon,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import type { Project, ProjectFormData } from '../types';

const emptyForm: ProjectFormData = {
  name: '',
  description: '',
  techs: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  order: 0,
  imageFile: null,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Project[]>('/projects');
      setProjects(data);
    } catch {
      toast.error('Falha ao carregar projetos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalFeatured = useMemo(
    () => projects.filter((p) => p.featured).length,
    [projects],
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      techs: project.techs.join(', '),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl ?? '',
      featured: project.featured,
      order: project.order,
      imageFile: null,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const techs = form.techs
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (techs.length === 0) {
      toast.error('Informe ao menos uma tech');
      setSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('techs', JSON.stringify(techs));
    fd.append('githubUrl', form.githubUrl);
    if (form.liveUrl) fd.append('liveUrl', form.liveUrl);
    fd.append('featured', String(form.featured));
    fd.append('order', String(form.order));
    if (form.imageFile) fd.append('image', form.imageFile);

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Projeto atualizado');
      } else {
        await api.post('/projects', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Projeto criado');
      }
      closeForm();
      await fetchProjects();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          'Falha ao salvar'
        : 'Falha ao salvar';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Remover o projeto "${project.name}"?`)) return;
    try {
      await api.delete(`/projects/${project.id}`);
      toast.success('Projeto removido');
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch {
      toast.error('Falha ao remover');
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="hud-title text-xs mb-2">// CONTROL PANEL</p>
            <h1 className="text-3xl md:text-4xl text-ironman-gold">Projetos</h1>
            <p className="font-rajdhani text-white/70 mt-2">
              {projects.length} projetos — {totalFeatured} em destaque
            </p>
          </div>
          <button className="btn-cyan" onClick={openCreate}>
            <Plus size={16} /> Novo projeto
          </button>
        </div>

        <div className="hud-panel overflow-x-auto">
          <div className="relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-orbitron tracking-widest text-ironman-gold/80 border-b border-ironman-gold/30">
                  <th className="p-4">Projeto</th>
                  <th className="p-4 hidden md:table-cell">Techs</th>
                  <th className="p-4 hidden lg:table-cell">Ordem</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="font-rajdhani">
                {loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-ironman-cyan animate-pulse">
                      Carregando...
                    </td>
                  </tr>
                )}

                {!loading && projects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-white/60">
                      Nenhum projeto cadastrado.
                    </td>
                  </tr>
                )}

                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-ironman-gold/10 hover:bg-ironman-cyan/5 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-ironman-gold/30 bg-black/60 flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-ironman-gold/50" />
                          )}
                        </div>
                        <div>
                          <div className="text-ironman-gold">{p.name}</div>
                          <div className="text-xs text-white/60 line-clamp-1 max-w-xs">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.techs.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-orbitron tracking-wider px-2 py-0.5 rounded border border-ironman-cyan/50 text-ironman-cyan/90"
                          >
                            {t}
                          </span>
                        ))}
                        {p.techs.length > 4 && (
                          <span className="text-[11px] text-white/50">
                            +{p.techs.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-white/80">{p.order}</td>
                    <td className="p-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-orbitron tracking-widest text-ironman-gold">
                          <Star size={12} /> FEATURED
                        </span>
                      ) : (
                        <span className="text-xs font-orbitron tracking-widest text-white/50">
                          NORMAL
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-cyan !text-xs !px-3 !py-1.5"
                          onClick={() => openEdit(p)}
                        >
                          <Edit3 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 font-orbitron uppercase tracking-widest text-xs border rounded-md border-ironman-red text-ironman-red hover:bg-ironman-red hover:text-white transition"
                        >
                          <Trash2 size={14} /> Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-y-auto"
            onClick={closeForm}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="hud-panel w-full max-w-2xl p-6"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="hud-title text-xs mb-1">
                      // {editingId ? 'EDIT' : 'NEW'} PROJECT
                    </p>
                    <h2 className="text-xl text-ironman-gold">
                      {editingId ? 'Editar projeto' : 'Novo projeto'}
                    </h2>
                  </div>
                  <button
                    onClick={closeForm}
                    className="text-white/60 hover:text-ironman-red transition"
                    aria-label="fechar"
                  >
                    <X />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                        Nome
                      </label>
                      <input
                        className="input-hud"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                        Ordem
                      </label>
                      <input
                        type="number"
                        className="input-hud"
                        value={form.order}
                        onChange={(e) =>
                          setForm({ ...form, order: Number(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                      Descrição
                    </label>
                    <textarea
                      className="input-hud min-h-[110px]"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                      Techs (separadas por vírgula)
                    </label>
                    <input
                      className="input-hud"
                      value={form.techs}
                      onChange={(e) => setForm({ ...form, techs: e.target.value })}
                      placeholder="React, TypeScript, Tailwind"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        className="input-hud"
                        value={form.githubUrl}
                        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                        Live URL
                      </label>
                      <input
                        type="url"
                        className="input-hud"
                        value={form.liveUrl}
                        onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron tracking-widest text-white/70 mb-1">
                      Imagem {editingId && '(opcional — mantém a atual se vazia)'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({ ...form, imageFile: e.target.files?.[0] ?? null })
                      }
                      className="block w-full text-white/80 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border file:border-ironman-cyan/60 file:text-ironman-cyan file:bg-transparent hover:file:bg-ironman-cyan/10"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 font-rajdhani text-white/85">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="accent-ironman-gold"
                    />
                    Destaque (featured)
                  </label>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={closeForm} className="btn-hud">
                      Cancelar
                    </button>
                    <button type="submit" className="btn-cyan" disabled={submitting}>
                      <Save size={16} />
                      {submitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
