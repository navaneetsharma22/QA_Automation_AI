import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LayoutTemplate, Plus, Trash2, Edit2, Save, X, PlusCircle, Folder, Check, RefreshCw, Power } from 'lucide-react';

export const AdminProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form State for new/edit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([]);

  const fetchProjects = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getTotalCards = (cardList) => {
    let count = 0;
    const countCards = (list) => {
      list.forEach(c => {
        count++;
        if (c.children?.length) countCards(c.children);
      });
    };
    countCards(cardList);
    return count;
  };

  const handleAddCard = (parentId = null) => {
    if (getTotalCards(cards) >= 50) {
      toast.error('Maximum limit of 50 cards reached per schema.');
      return;
    }

    const newCard = { id: 'card_' + Math.random().toString(36).substr(2, 9), heading: 'New Card', type: 'text', children: [] };
    
    if (!parentId) {
      setCards([...cards, newCard]);
    } else {
      const updateChildren = (list) => {
        return list.map(c => {
          if (c.id === parentId) {
            return { ...c, children: [...(c.children || []), newCard] };
          }
          if (c.children?.length) {
            return { ...c, children: updateChildren(c.children) };
          }
          return c;
        });
      };
      setCards(updateChildren(cards));
    }
  };

  const handleRemoveCard = (cardId) => {
    const removeCard = (list) => {
      return list.filter(c => c.id !== cardId).map(c => {
        if (c.children?.length) {
          return { ...c, children: removeCard(c.children) };
        }
        return c;
      });
    };
    setCards(removeCard(cards));
  };

  const handleUpdateCard = (cardId, updates) => {
    const updateCard = (list) => {
      return list.map(c => {
        if (c.id === cardId) {
          return { ...c, ...updates };
        }
        if (c.children?.length) {
          return { ...c, children: updateCard(c.children) };
        }
        return c;
      });
    };
    setCards(updateCard(cards));
  };

  const handleSaveProject = async () => {
    if (!name) {
      toast.error('Project name is required');
      return;
    }
    if (cards.length === 0) {
      toast.error('Please add at least one card to the schema');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const url = editingProject ? `${apiUrl}/v1/projects/${editingProject._id}` : `${apiUrl}/v1/projects`;
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, cards })
      });

      if (!res.ok) throw new Error('Failed to save project');
      
      setIsSaved(true);
      toast.success(editingProject ? 'Project updated' : 'Project created');
      resetForm();
      fetchProjects();
      
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setCards([]);
  };

  const handleEdit = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description || '');
    setCards(proj.cards || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await fetch(`${apiUrl}/v1/projects/${id}`, { method: 'DELETE' });
        toast.success('Project deleted');
        if (editingProject?._id === id) resetForm();
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleToggleStatus = async (proj) => {
    try {
      const newStatus = proj.status === 'Archived' ? 'Active' : 'Archived';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/projects/${proj._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proj, status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(newStatus === 'Archived' ? 'Project Disabled' : 'Project Enabled');
      if (editingProject?._id === proj._id) {
        setEditingProject({ ...proj, status: newStatus });
      }
      fetchProjects();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const renderCardEditor = (card, depth = 0) => {
    return (
      <div key={card.id} className={`border border-[#374151] rounded-xl p-4 bg-[#111827] mb-3 ml-${depth * 6}`}>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="text"
            value={card.heading}
            onChange={(e) => handleUpdateCard(card.id, { heading: e.target.value })}
            className="flex-1 bg-[#1F2937] border border-[#374151] rounded-lg px-3 py-1.5 text-sm text-theme-text-primary focus:border-indigo-500"
            placeholder="Card Heading"
          />
          <select
            value={card.type}
            onChange={(e) => handleUpdateCard(card.id, { type: e.target.value })}
            className="bg-[#1F2937] border border-[#374151] rounded-lg px-3 py-1.5 text-sm text-theme-text-primary focus:border-indigo-500"
          >
            <option value="text">Text / String</option>
            <option value="list">List / Array</option>
            <option value="parent">Parent Container</option>
            <option value="row">Horizontal Row Layout</option>
            <option value="grid-2">2-Column Grid Layout</option>
            <option value="grid-3">3-Column Grid Layout</option>
          </select>
          <button onClick={() => handleRemoveCard(card.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {['parent', 'grid-2', 'grid-3', 'row'].includes(card.type) && (
          <div className="pl-6 border-l-2 border-[#1F2937] mt-3 space-y-3">
            {card.children?.map(child => renderCardEditor(child, depth + 1))}
            <button 
              onClick={() => handleAddCard(card.id)}
              className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Child Card
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List Projects */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-theme-text-primary flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-400" />
              Projects
            </h2>
            <button onClick={resetForm} className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {loading ? <p className="text-theme-text-secondary text-sm">Loading...</p> : 
             projects.length === 0 ? <p className="text-theme-text-secondary text-sm">No projects created yet.</p> :
             projects.map(p => (
              <div key={p._id} className={`p-4 bg-[#0B1020] border border-[#1F2937] rounded-xl flex items-center justify-between group transition-opacity ${p.status === 'Archived' ? 'opacity-50' : ''}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-theme-text-primary font-medium">{p.name}</h3>
                    {p.status === 'Archived' && <span className="text-[10px] bg-gray-800 text-theme-text-secondary px-1.5 py-0.5 rounded font-semibold uppercase">Disabled</span>}
                  </div>
                  <p className="text-xs text-theme-text-secondary/70">{p.cards?.length || 0} Dynamic Cards</p>
                </div>
                <div className="flex gap-2 transition-opacity">
                  <button onClick={() => handleToggleStatus(p)} className="p-1.5 text-yellow-500 hover:bg-yellow-500/10 rounded-md" title={p.status === 'Archived' ? 'Enable Format' : 'Disable Format'}>
                    <Power className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleEdit(p)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-md" title="Edit">
                    <Edit2 className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md" title="Delete">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="lg:col-span-2">
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-theme-text-primary mb-6 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-emerald-400" />
            {editingProject ? 'Edit Project Schema' : 'Create New Project Schema'}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-theme-text-primary focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Technical Support QA"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-theme-text-primary focus:outline-none focus:border-indigo-500"
                  placeholder="Optional description"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-8 border-t border-[#1F2937] pt-6">
                <label className="block text-sm font-bold text-theme-text-primary uppercase tracking-wider">Dynamic Report Cards</label>
                <button 
                  onClick={() => handleAddCard()}
                  className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-600/30 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Root Card
                </button>
              </div>

              <div className="bg-[#0B1020] p-4 rounded-xl border border-[#1F2937] min-h-[300px]">
                {cards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-theme-text-secondary/70">
                    <LayoutTemplate className="w-8 h-8 mb-3 opacity-50" />
                    <p className="text-sm">No cards defined. Click "Add Root Card" to start building your layout.</p>
                  </div>
                ) : (
                  cards.map(card => renderCardEditor(card))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-[#1F2937]">
              {editingProject && (
                <button onClick={resetForm} className="px-6 py-2.5 rounded-xl border border-[#374151] text-theme-text-secondary font-medium hover:bg-[#1F2937]">
                  Cancel
                </button>
              )}
              <button 
                onClick={handleSaveProject}
                disabled={isSubmitting || isSaved || cards.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-xl shadow-lg transition-all ${
                  isSaved 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default'
                    : cards.length === 0
                    ? 'bg-gray-700 text-theme-text-secondary cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-theme-text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
