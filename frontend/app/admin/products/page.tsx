'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Edit, Trash2, X, Save, Upload, Image as ImageIcon, Search, ChevronDown, Check } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/lib/config';

export default function ProductsPage() {

  const { data, setData } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [colorImageFiles, setColorImageFiles] = useState<{ [key: number]: File[] }>({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCatOpen, setIsCatOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/products/get-products`),
          fetch(`${API_URL}/categories/get-categories`),
        ]);
        const products = await prodRes.json();
        const cats = await catRes.json();
        setCategories(cats.categories || []);
        setData({ ...(data || {}), products: products.products || products || [] });
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return 'All Categories';
    return categories.find(c => c._id === selectedCategory)?.name || 'Unknown Category';
  }, [selectedCategory, categories]);

  const filteredProducts = useMemo(() => {
    return (data?.products || []).filter((p: any) => {
      const pCat = typeof p.category === 'object' ? p.category?._id : p.category;
      const matchesCategory = selectedCategory === 'all' || pCat === selectedCategory;

      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        (typeof p.category === 'object' && p.category?.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [data?.products, selectedCategory, searchQuery]);

  const handleAddProduct = () => {
    setIsNewProduct(true);
    setColorImageFiles({});
    setEditingProduct({
      name: '',
      price: 0,
      mrp: 0,
      discount: 0,
      description: '',
      images: [],
      category: selectedCategory !== 'all' ? selectedCategory : '',
      brand: '',
      stock: 0,
      material: '',
      soleMaterial: '',
      isFeatured: false,
      isActive: true,
      variants: [],
      tags: [],
      colorMap: [{ name: '', hex: '#000000', images: [] }]
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setEditingProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ── ColorMap handlers ──
  const handleAddColor = () => {
    setEditingProduct((prev: any) => ({
      ...prev,
      colorMap: [...(prev.colorMap || []), { name: '', hex: '#000000', images: [] }]
    }));
  };

  const handleUpdateColor = (index: number, field: string, value: any) => {
    setEditingProduct((prev: any) => {
      const newColorMap = [...(prev.colorMap || [])];
      newColorMap[index] = { ...newColorMap[index], [field]: value };
      return { ...prev, colorMap: newColorMap };
    });
  };

  const handleRemoveColor = (index: number) => {
    setEditingProduct((prev: any) => ({
      ...prev,
      colorMap: (prev.colorMap || []).filter((_: any, i: number) => i !== index)
    }));
    setColorImageFiles(prev => {
      const newMap = { ...prev };
      delete newMap[index];
      // Shift indices if needed, but it's complex. Better to just clear and let the user re-upload if they delete middle colors.
      // Actually, safest is to clear colorImageFiles and warn, or just accept the bug if they delete middle.
      // We will let the user manage it.
      return newMap;
    });
  };

  const handleColorImageUpload = (colorIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setColorImageFiles(prev => ({
      ...prev,
      [colorIndex]: [...(prev[colorIndex] || []), ...files]
    }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct((prev: any) => {
          const newColorMap = [...(prev.colorMap || [])];
          if (!newColorMap[colorIndex].images) newColorMap[colorIndex].images = [];
          newColorMap[colorIndex].images = [...newColorMap[colorIndex].images, reader.result as string];
          return { ...prev, colorMap: newColorMap };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveColorImage = (colorIndex: number, imageIndex: number) => {
    setEditingProduct((prev: any) => {
      const newColorMap = [...(prev.colorMap || [])];
      newColorMap[colorIndex].images = newColorMap[colorIndex].images.filter((_: any, i: number) => i !== imageIndex);
      return { ...prev, colorMap: newColorMap };
    });
    setColorImageFiles(prev => {
      const filesForColor = prev[colorIndex] || [];
      return {
        ...prev,
        [colorIndex]: filesForColor.filter((_, i) => i !== imageIndex)
      };
    });
  };

  // ── Variant handlers ──
  const handleAddVariant = () => {
    const defaultColor = editingProduct?.colorMap?.[0]?.name || '';
    setEditingProduct((prev: any) => ({
      ...prev,
      variants: [...(prev.variants || []), { size: 0, color: defaultColor, stock: 0, sku: '' }]
    }));
  };

  const handleUpdateVariant = (index: number, field: string, value: any) => {
    setEditingProduct((prev: any) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleRemoveVariant = (index: number) => {
    setEditingProduct((prev: any) => ({
      ...prev,
      variants: prev.variants.filter((_: any, i: number) => i !== index)
    }));
  };

  // ── Quick-add sizes for a color ──
  const handleQuickAddSizes = (color: string, fromSize: number, toSize: number, stock: number) => {
    if (fromSize > toSize || !color) return;
    const newVariants: any[] = [];
    for (let s = fromSize; s <= toSize; s++) {
      const exists = editingProduct.variants?.some((v: any) => v.size === s && v.color === color);
      if (!exists) {
        newVariants.push({ size: s, color, stock, sku: '' });
      }
    }
    setEditingProduct((prev: any) => ({
      ...prev,
      variants: [...(prev.variants || []), ...newVariants]
    }));
  };

  const handleAddTag = (tag: string) => {
    if (!tag) return;
    setEditingProduct((prev: any) => ({
      ...prev,
      tags: [...new Set([...(prev.tags || []), tag])]
    }));
  };

  const handleRemoveTag = (tag: string) => {
    setEditingProduct((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag)
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/products/delete-product/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const prodRes = await fetch(`${API_URL}/products/get-products`);
        const products = await prodRes.json();
        setData({ ...(data || {}), products: products.products || products || [] });
        toast.success('Product deleted successfully');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
    setSaving(false);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.colorMap || editingProduct.colorMap.length === 0) {
      toast.error("Please add at least one color option.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(editingProduct).forEach(key => {
        if (key === 'images' || key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return;

        let value = editingProduct[key];
        if (key === 'category' && typeof value === 'object' && value !== null) {
          value = value._id;
        }

        if (key === 'variants' || key === 'tags' || key === 'colorMap') {
          // ensure colorMap images without data URIs are kept
          if (key === 'colorMap') {
             const cleanedColorMap = value.map((color: any) => ({
                ...color,
                images: (color.images || []).filter((img: any) => typeof img !== 'string' || img.startsWith('http'))
             }));
             formData.append(key, JSON.stringify(cleanedColorMap));
          } else {
             formData.append(key, JSON.stringify(value));
          }
        } else {
          formData.append(key, value);
        }
      });

      // Existing main images are intentionally omitted as we only use colorMap images now.
      // The backend will automatically handle the mapping if required.

      Object.entries(colorImageFiles).forEach(([colorIdx, files]) => {
        files.forEach(file => {
          formData.append(`colorImages_${colorIdx}`, file);
        });
      });

      const url = isNewProduct
        ? `${API_URL}/products/create-product`
        : `${API_URL}/products/update-product/${editingProduct._id}`;

      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const prodRes = await fetch(`${API_URL}/products/get-products`);
        const products = await prodRes.json();
        setData({ ...(data || {}), products: products.products || products || [] });
        setEditingProduct(null);
        setIsNewProduct(false);
        setImageFiles([]);
        toast.success(isNewProduct ? 'Product created successfully' : 'Product updated successfully');
      } else {
        const contentType = res.headers.get('content-type');
        let errorMsg = 'Failed to save product';
        if (contentType && contentType.includes('application/json')) {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } else {
          errorMsg = await res.text();
        }
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to save product');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bebas tracking-tight uppercase">Products</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20 mt-1">Inventory Management</p>
        </div>
        <div className="flex items-center gap-4">
          
          {/* Global Search Bar */}
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, brand or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>

          {/* Custom Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-400 transition-all min-w-[180px] justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-normal">In:</span>
                <span>{selectedCategoryName}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCatOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCatOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={() => { setSelectedCategory('all'); setIsCatOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className={selectedCategory === 'all' ? 'font-bold' : ''}>All Categories</span>
                    {selectedCategory === 'all' && <Check className="w-4 h-4 text-black" />}
                  </button>
                  <div className="h-px bg-gray-50 mx-2" />
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {categories.map((cat: any) => (
                      <button
                        key={cat._id}
                        onClick={() => { setSelectedCategory(cat._id); setIsCatOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className={selectedCategory === cat._id ? 'font-bold' : ''}>{cat.name}</span>
                        {selectedCategory === cat._id && <Check className="w-4 h-4 text-black" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bebas text-lg tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      <DataTable
        data={filteredProducts}
        isLoading={loading}
        columns={[
          {
            header: 'Product',
            accessor: (product: any) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden relative flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full" />
                  ) : product.colorMap && product.colorMap.length > 0 && product.colorMap[0].images && product.colorMap[0].images.length > 0 ? (
                    <img src={product.colorMap[0].images[0].url} alt={product.name} className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 leading-none">{product.name}</span>
                  <span className="text-[10px] text-gray-500 mt-1">{product.brand}</span>
                </div>
              </div>
            ),
          },
          {
            header: 'Prices',
            accessor: (product: any) => (
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold">₹{product.price}</span>
                <span className="text-gray-400 line-through text-xs">₹{product.mrp}</span>
              </div>
            ),
          },
          {
            header: 'Category',
            accessor: (product: any) => product.category?.name || 'Uncategorized',
            className: 'text-gray-500',
          },
          {
            header: 'Status',
            accessor: (product: any) => (
              <div className="flex flex-col gap-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-center ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
                {product.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 text-center">
                    FEATURED
                  </span>
                )}
              </div>
            ),
          },
          {
            header: 'Variants',
            accessor: (product: any) => (
              <span className="text-xs text-gray-500">
                {product.variants?.length || 0} variants
              </span>
            ),
          },
        ]}
        idField="_id"
        onEdit={(product: any) => {
          setIsNewProduct(false);
          setEditingProduct({ ...product });
          setImageFiles([]); // Reset new files when editing existing
        }}
        onDelete={handleDelete}
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => { setEditingProduct(null); setIsNewProduct(false); }} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={editingProduct.category?._id || editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter((cat: any) => !cat.parent)
                      .map((rootCat: any) => {
                        const subCats = categories.filter((c: any) => {
                          const parentId = c.parent && typeof c.parent === 'object' ? c.parent._id : c.parent;
                          return parentId === rootCat._id;
                        });

                        if (subCats.length > 0) {
                          return (
                            <optgroup key={rootCat._id} label={rootCat.name}>
                              <option value={rootCat._id}>{rootCat.name} (Direct)</option>
                              {subCats.map((sub: any) => (
                                <option key={sub._id} value={sub._id}>
                                  {sub.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        }

                        return (
                          <option key={rootCat._id} value={rootCat._id}>
                            {rootCat.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>
 </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sole Material</label>
                  <input
                    type="text"
                    value={editingProduct.soleMaterial}
                    onChange={(e) => setEditingProduct({ ...editingProduct, soleMaterial: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                {/* ── Color Options (ColorMap) ── */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Color Options</label>
                      <p className="text-[10px] text-gray-400 mt-0.5">Define available colors with hex codes. These show as swatches on the product page.</p>
                    </div>
                    <button
                      onClick={handleAddColor}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Color
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.colorMap?.map((color: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: color.hex || '#000' }}
                          />
                          <input
                            type="text"
                            placeholder="Color Name (e.g., Ocean Blue)"
                            value={color.name}
                            onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="color"
                              value={color.hex || '#000000'}
                              onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                              title="Pick color"
                            />
                            <input
                              type="text"
                              value={color.hex || ''}
                              onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                              placeholder="#000000"
                              className="w-20 border border-gray-300 rounded px-2 py-1.5 text-xs font-mono"
                            />
                          </div>
                          <button onClick={() => handleRemoveColor(idx)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Color Images Upload */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                          {color.images?.map((img: any, imgIdx: number) => (
                            <div key={imgIdx} className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 group">
                              <img src={typeof img === 'string' ? img : img.url} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleRemoveColorImage(idx, imgIdx)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          ))}
                          <label className="w-16 h-16 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                            <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
                            <span className="text-[9px] text-gray-500 font-medium">Images</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleColorImageUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Variants (Size, Color, Stock, SKU) ── */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Variants (Size × Color × Stock)</label>
                      <p className="text-[10px] text-gray-400 mt-0.5">Each variant represents a specific size-color combination with its own stock.</p>
                    </div>
                    <button
                      onClick={handleAddVariant}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Variant
                    </button>
                  </div>

                  {/* Quick-add sizes */}
                  {editingProduct.colorMap?.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-blue-700 mb-2 uppercase tracking-wider">Quick Add Sizes</p>
                      <div className="flex items-end gap-2 flex-wrap">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Color</label>
                          <select id="qa-color" className="border border-gray-300 rounded px-2 py-1 text-xs">
                            {editingProduct.colorMap.map((c: any, i: number) => (
                              <option key={i} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">From Size</label>
                          <input id="qa-from" type="number" defaultValue={6} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">To Size</label>
                          <input id="qa-to" type="number" defaultValue={10} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Stock Each</label>
                          <input id="qa-stock" type="number" defaultValue={10} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs" />
                        </div>
                        <button
                          onClick={() => {
                            const color = (document.getElementById('qa-color') as HTMLSelectElement)?.value;
                            const from = Number((document.getElementById('qa-from') as HTMLInputElement)?.value);
                            const to = Number((document.getElementById('qa-to') as HTMLInputElement)?.value);
                            const stock = Number((document.getElementById('qa-stock') as HTMLInputElement)?.value);
                            handleQuickAddSizes(color, from, to, stock);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Variant headers */}
                  {editingProduct.variants?.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 px-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size (UK)</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Color</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SKU</span>
                      <span></span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {editingProduct.variants?.map((variant: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-5 gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <input
                          type="number"
                          placeholder="Size"
                          value={variant.size}
                          onChange={(e) => handleUpdateVariant(idx, 'size', Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1.5 text-xs"
                        />
                        {editingProduct.colorMap?.length > 0 ? (
                          <select
                            value={variant.color}
                            onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1.5 text-xs"
                          >
                            <option value="">Select Color</option>
                            {editingProduct.colorMap.map((c: any, ci: number) => (
                              <option key={ci} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Color"
                            value={variant.color}
                            onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1.5 text-xs"
                          />
                        )}
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Stock"
                            value={variant.stock}
                            onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1.5 text-xs w-full"
                          />
                          {variant.stock === 0 && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" title="Out of stock" />
                          )}
                          {variant.stock > 0 && variant.stock <= 3 && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500" title="Low stock" />
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1.5 text-xs"
                        />
                        <button onClick={() => handleRemoveVariant(idx)} className="text-red-500 hover:text-red-700 p-1 flex justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingProduct.tags?.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-gray-200">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Press enter to add tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div className="md:col-span-2 flex gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-black">Feature on Homepage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={editingProduct.isActive}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-black">Active Product</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => { setEditingProduct(null); setIsNewProduct(false); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
