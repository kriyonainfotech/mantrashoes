'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Edit, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


export default function ProductsPage() {
  const { data, setData } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

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

  const handleAddProduct = () => {
    setIsNewProduct(true);
    setEditingProduct({
      name: '',
      price: 0,
      mrp: 0,
      discount: 0,
      description: '',
      images: [],
      category: '',
      brand: '',
      stock: 0,
      whatsapp: '',
      material: '',
      soleMaterial: '',
      isFeatured: false,
      isActive: true,
      variants: [],
      tags: []
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

  const handleAddVariant = () => {
    setEditingProduct((prev: any) => ({
      ...prev,
      variants: [...(prev.variants || []), { size: 0, color: '', stock: 0, sku: '' }]
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
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete product');
    }
    setSaving(false);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(editingProduct).forEach(key => {
        if (key === 'images' || key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return;

        let value = editingProduct[key];
        if (key === 'category' && typeof value === 'object' && value !== null) {
          value = value._id;
        }

        if (key === 'variants' || key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      imageFiles.forEach(file => {
        formData.append('images', file);
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
      } else {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const err = await res.json();
          alert(err.message || 'Failed to save product');
        } else {
          const errorText = await res.text();
          console.error('Server error (non-JSON):', errorText);
          alert(`Failed to save product: ${res.status} ${res.statusText}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <DataTable
        data={data?.products || []}
        isLoading={loading}
        columns={[
          {
            header: 'Product',
            accessor: (product: any) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden relative flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full" />
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
                <span className="text-gray-900 font-bold">${product.price}</span>
                <span className="text-gray-400 line-through text-xs">${product.mrp}</span>
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {editingProduct.images?.map((img: any, idx: number) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={typeof img === 'string' ? img : img.url} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && <div className="absolute top-0 left-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-bold">HERO</div>}
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 font-medium">Upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">The first image will be used as the hero image.</p>
                </div>

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
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MRP ($)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    value={editingProduct.whatsapp}
                    onChange={(e) => setEditingProduct({ ...editingProduct, whatsapp: e.target.value })}
                    placeholder="e.g. 14155552671"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black text-sm"
                  />
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

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Variants (Size, Color, Stock, SKU)</label>
                    <button
                      onClick={handleAddVariant}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Variant
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.variants?.map((variant: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-5 gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <input
                          type="number"
                          placeholder="Size"
                          value={variant.size}
                          onChange={(e) => handleUpdateVariant(idx, 'size', Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={variant.stock}
                          onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
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
