'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { RootState, AppDispatch } from '@/lib/redux/store';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '@/lib/redux/slices/categorySlice';
import { Category } from '@/lib/api/categoryService';
import DataTable, { Column } from '@/components/admin/DataTable';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading } = useSelector((state: RootState) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [bounce, setBounce] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    isActive: true,
    showInNavbar: false,
    showOnHome: false
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        parent: typeof editingCategory.parent === 'object' ? editingCategory.parent?._id || '' : editingCategory.parent || '',
        isActive: editingCategory.isActive !== undefined ? editingCategory.isActive : true,
        showInNavbar: editingCategory.showInNavbar !== undefined ? editingCategory.showInNavbar : false,
        showOnHome: editingCategory.showOnHome !== undefined ? editingCategory.showOnHome : false
      });
    } else {
      setFormData({ name: '', slug: '', description: '', parent: '', isActive: true, showInNavbar: false, showOnHome: false });
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        parent: formData.parent === '' ? null : formData.parent
      };

      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory._id, data: dataToSubmit })).unwrap();
      } else {
        await dispatch(addCategory(dataToSubmit)).unwrap();
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      toast.success(editingCategory ? 'Category updated' : 'Category created');
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Category deleted');
      } catch (error: any) {
        console.error('Error deleting category:', error);
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const columns: Column<Category>[] = [
    {
      header: 'Category Name',
      accessor: (category) => (
        <div className="flex flex-col">
          <span className="font-bebas text-xl tracking-wide">{category.name}</span>
          {category.description && (
            <span className="text-[11px] text-ink/40 line-clamp-1 max-w-xs">{category.description}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Slug',
      accessor: (category) => (
        <code className="px-2 py-1 bg-cream text-ink/60 text-[10px] font-mono tracking-tighter">
          /{category.slug}
        </code>
      ),
    },
    {
      header: 'Navbar',
      accessor: (category) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${category.showInNavbar ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
          {category.showInNavbar ? 'VISIBLE' : 'HIDDEN'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (category) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {category.isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 mb-1">Management</p>
          <h1 className="text-4xl font-bebas tracking-tight">Categories</h1>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-ink text-white font-bebas text-lg tracking-widest hover:bg-ink/90 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        emptyMessage="No categories found in the system"
      />

      {/* Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => {
              setBounce(true);
              setTimeout(() => setBounce(false), 400); // reset after animation
            }}
          >
          </div>
          <div
            className={`relative w-full max-w-md bg-white p-8 shadow-2xl transition-all duration-300
            ${bounce ? "animate-bounce-once" : "animate-in zoom-in-95"}`}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bebas tracking-tight">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-cream rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase tracking-wider text-ink/40">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 bg-cream border border-transparent focus:border-ink/20 outline-none font-medium transition-all"
                  placeholder="e.g. PERFORMANCE"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase tracking-wider text-ink/40">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-cream border border-transparent focus:border-ink/20 outline-none font-mono text-sm tracking-tighter transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase tracking-wider text-ink/40">Parent Category</label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full px-4 py-3 bg-cream border border-transparent focus:border-ink/20 outline-none font-medium appearance-none transition-all cursor-pointer"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(c => c._id !== editingCategory?._id)
                    .map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase tracking-wider text-ink/40">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-cream border border-transparent focus:border-ink/20 outline-none font-medium resize-none transition-all"
                  placeholder="Optional brief description..."
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-ink/60 group-hover:text-ink transition-colors">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.showInNavbar}
                    onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-ink/60 group-hover:text-ink transition-colors">Show in Navbar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.showOnHome}
                    onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-ink/60 group-hover:text-ink transition-colors">Show on Homepage</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xs bg-ink text-white font-bebas text-lg tracking-widest hover:bg-ink/90 transition-all active:scale-[0.98]"
                >
                  {editingCategory ? 'Update System' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
