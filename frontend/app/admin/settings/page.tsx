'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { data, fetchData, setData } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (!formData) return <div className="p-8">Loading...</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setData(formData);
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleReviewChange = (index: number, field: string, value: any) => {
    const newReviews = [...formData.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, reviews: newReviews }));
  };

  const addReview = () => {
    setFormData((prev: any) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        { id: Date.now().toString(), name: '', rating: 5, review: '', image: '' }
      ]
    }));
  };

  const removeReview = (index: number) => {
    const newReviews = [...formData.reviews];
    newReviews.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, reviews: newReviews }));
  };

  const handleInstagramImageChange = (index: number, value: string) => {
    const newImages = [...(formData.sections.instagram?.images || [])];
    newImages[index] = value;
    handleChange('sections', 'instagram', { ...formData.sections.instagram, images: newImages });
  };

  const addInstagramImage = () => {
    const newImages = [...(formData.sections.instagram?.images || []), ''];
    handleChange('sections', 'instagram', { ...formData.sections.instagram, images: newImages });
  };

  const removeInstagramImage = (index: number) => {
    const newImages = [...(formData.sections.instagram?.images || [])];
    newImages.splice(index, 1);
    handleChange('sections', 'instagram', { ...formData.sections.instagram, images: newImages });
  };

  const handleCollectionChange = (index: number, field: string, value: any) => {
    const newCollections = [...(formData.collections || [])];
    newCollections[index] = { ...newCollections[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, collections: newCollections }));
  };

  const addCollection = () => {
    setFormData((prev: any) => ({
      ...prev,
      collections: [
        ...(prev.collections || []),
        { id: Date.now().toString(), title: '', description: '', image: '' }
      ]
    }));
  };

  const removeCollection = (index: number) => {
    const newCollections = [...(formData.collections || [])];
    newCollections.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, collections: newCollections }));
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Colors */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(formData.theme).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={value as string}
                  onChange={(e) => handleChange('theme', key, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={value as string}
                  onChange={(e) => handleChange('theme', key, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Hero Section (Fallback)</h3>
        <p className="text-sm text-gray-500">This content is shown if no products are selected for the Hero Slider.</p>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="heroEnabled"
              checked={formData.sections.hero.enabled}
              onChange={(e) => handleChange('sections', 'hero', { ...formData.sections.hero, enabled: e.target.checked })}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="heroEnabled" className="text-sm font-medium text-gray-700">Enable Hero Section</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              value={formData.sections.hero.title}
              onChange={(e) => handleChange('sections', 'hero', { ...formData.sections.hero, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input 
              type="text" 
              value={formData.sections.hero.subtitle}
              onChange={(e) => handleChange('sections', 'hero', { ...formData.sections.hero, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
            <input 
              type="text" 
              value={formData.sections.hero.image}
              onChange={(e) => handleChange('sections', 'hero', { ...formData.sections.hero, image: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Page Headers */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Page Headers</h3>
        
        <div className="space-y-6">
          {/* Shop Header */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Shop Page</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.sections.shopHeader?.title || ''}
                  onChange={(e) => handleChange('sections', 'shopHeader', { ...formData.sections.shopHeader, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={formData.sections.shopHeader?.subtitle || ''}
                  onChange={(e) => handleChange('sections', 'shopHeader', { ...formData.sections.shopHeader, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Collections Header */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900">Collections Page</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.sections.collectionsHeader?.title || ''}
                  onChange={(e) => handleChange('sections', 'collectionsHeader', { ...formData.sections.collectionsHeader, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={formData.sections.collectionsHeader?.subtitle || ''}
                  onChange={(e) => handleChange('sections', 'collectionsHeader', { ...formData.sections.collectionsHeader, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* About Header */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900">About Page</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.sections.aboutHeader?.title || ''}
                  onChange={(e) => handleChange('sections', 'aboutHeader', { ...formData.sections.aboutHeader, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={formData.sections.aboutHeader?.subtitle || ''}
                  onChange={(e) => handleChange('sections', 'aboutHeader', { ...formData.sections.aboutHeader, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Story */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Brand Story Section</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="brandStoryEnabled"
              checked={formData.sections.brandStory?.enabled ?? true}
              onChange={(e) => handleChange('sections', 'brandStory', { ...formData.sections.brandStory, enabled: e.target.checked })}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="brandStoryEnabled" className="text-sm font-medium text-gray-700">Enable Brand Story Section</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              value={formData.sections.brandStory?.title || ''}
              onChange={(e) => handleChange('sections', 'brandStory', { ...formData.sections.brandStory, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              value={formData.sections.brandStory?.description || ''}
              onChange={(e) => handleChange('sections', 'brandStory', { ...formData.sections.brandStory, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input 
              type="text" 
              value={formData.sections.brandStory?.image || ''}
              onChange={(e) => handleChange('sections', 'brandStory', { ...formData.sections.brandStory, image: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Instagram Gallery */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Instagram Gallery Section</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="instagramEnabled"
              checked={formData.sections.instagram?.enabled ?? true}
              onChange={(e) => handleChange('sections', 'instagram', { ...formData.sections.instagram, enabled: e.target.checked })}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="instagramEnabled" className="text-sm font-medium text-gray-700">Enable Instagram Section</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              value={formData.sections.instagram?.title || ''}
              onChange={(e) => handleChange('sections', 'instagram', { ...formData.sections.instagram, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Profile URL</label>
            <input 
              type="text" 
              value={formData.sections.instagram?.profileLink || ''}
              onChange={(e) => handleChange('sections', 'instagram', { ...formData.sections.instagram, profileLink: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Images (URLs)</label>
            <div className="space-y-2">
              {(formData.sections.instagram?.images || []).map((img: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={img}
                    onChange={(e) => handleInstagramImageChange(idx, e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                  <button 
                    onClick={() => removeInstagramImage(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={addInstagramImage}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Plus className="w-4 h-4" /> Add Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Collections Page</h3>
        <div className="space-y-6">
          {(formData.collections || []).map((collection: any, idx: number) => (
            <div key={collection.id || idx} className="p-4 border border-gray-200 rounded-lg relative">
              <button 
                onClick={() => removeCollection(idx)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Collection Title</label>
                  <input 
                    type="text" 
                    value={collection.title}
                    onChange={(e) => handleCollectionChange(idx, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea 
                    value={collection.description}
                    onChange={(e) => handleCollectionChange(idx, 'description', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Background Image URL</label>
                  <input 
                    type="text" 
                    value={collection.image}
                    onChange={(e) => handleCollectionChange(idx, 'image', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addCollection}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Collection
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Customer Reviews</h3>
        <div className="space-y-6">
          {(formData.reviews || []).map((review: any, idx: number) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-lg relative">
              <button 
                onClick={() => removeReview(idx)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name</label>
                  <input 
                    type="text" 
                    value={review.name}
                    onChange={(e) => handleReviewChange(idx, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Rating (1-5)</label>
                  <input 
                    type="number" 
                    min="1" max="5"
                    value={review.rating}
                    onChange={(e) => handleReviewChange(idx, 'rating', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Avatar Image URL</label>
                  <input 
                    type="text" 
                    value={review.image}
                    onChange={(e) => handleReviewChange(idx, 'image', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Review Text</label>
                  <textarea 
                    value={review.review}
                    onChange={(e) => handleReviewChange(idx, 'review', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addReview}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-4">Footer Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Description</label>
            <textarea 
              value={formData.sections.footer?.brandDescription || ''}
              onChange={(e) => handleChange('sections', 'footer', { ...formData.sections.footer, brandDescription: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={formData.sections.footer?.backgroundColor || '#000000'}
                  onChange={(e) => handleChange('sections', 'footer', { ...formData.sections.footer, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={formData.sections.footer?.backgroundColor || '#000000'}
                  onChange={(e) => handleChange('sections', 'footer', { ...formData.sections.footer, backgroundColor: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={formData.sections.footer?.textColor || '#ffffff'}
                  onChange={(e) => handleChange('sections', 'footer', { ...formData.sections.footer, textColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={formData.sections.footer?.textColor || '#ffffff'}
                  onChange={(e) => handleChange('sections', 'footer', { ...formData.sections.footer, textColor: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
