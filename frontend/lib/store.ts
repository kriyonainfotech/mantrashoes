import { create } from 'zustand';
import { API_URL } from './config';


interface AppState {
  data: any;
  setData: (data: any) => void;
  fetchData: (force?: boolean) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  data: null,
  setData: (data) => set({ data }),
  fetchData: async (force = false) => {
    if (get().data && !force) return;
    try {
      // Fetch all three sources in parallel
      const [prodRes, catRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/products/get-products`),
        fetch(`${API_URL}/categories/get-categories`),
        fetch('/api/data'),           // ← settings: hero, brandStory, instagram, reviews etc.
      ]);

      // Products
      if (!prodRes.ok) throw new Error(`Products: ${prodRes.status}`);
      const prodData = await prodRes.json();
      const products = prodData.products || prodData || [];

      // Categories
      if (!catRes.ok) throw new Error(`Categories: ${catRes.status}`);
      const catData = await catRes.json();
      const categories = catData.categories || [];

      // Settings (sections, reviews, theme) — gracefully fallback if unavailable
      let settingsData: any = {};
      if (settingsRes.ok) {
        try { settingsData = await settingsRes.json(); } catch (_) {}
      }

      // Merge: settings sections override defaults, but products/categories always come from backend
      const defaultSections = {
        hero: {
          enabled: true,
          title: 'MANTRA',
          subtitle: 'Authentic footwear, trusted by Surat since years.',
          image: '',
        },
        brandStory: {
          enabled: true,
          title: 'A Legacy of Comfort',
          description: 'Founded on quality and trust, Mantra Shoes has been the go-to footwear destination in Surat for decades.',
          image: '',
        },
        reviews: { enabled: true, title: 'What Our Customers Say' },
        featured: { enabled: true, title: 'Featured Collection' },
        instagram: { enabled: true, title: 'Follow Us @MantraShoes', profileLink: '', images: [] },
        footer: {
          enabled: true,
          description: 'Authentic, comfortable footwear for the whole family.',
          email: 'hello@mantrashoes.com',
          phone: '+91 74050 40700',
          address: 'Shop No B-3, Varachha Main Rd, nr. Rise On Plaza, Sarthana Jakat Naka, Nana Varachha, Surat, Gujarat 395013',
        },
      };

      const sections = {
        ...defaultSections,
        ...(settingsData.sections || {}),
        // Deep merge each section so partial settings don't wipe out defaults
        hero:        { ...defaultSections.hero,        ...(settingsData.sections?.hero        || {}) },
        brandStory:  { ...defaultSections.brandStory,  ...(settingsData.sections?.brandStory  || {}) },
        reviews:     { ...defaultSections.reviews,     ...(settingsData.sections?.reviews     || {}) },
        featured:    { ...defaultSections.featured,    ...(settingsData.sections?.featured    || {}) },
        instagram:   { ...defaultSections.instagram,   ...(settingsData.sections?.instagram   || {}) },
        // Footer: always keep phone/address/email from defaults if not present in saved data
        footer: {
          ...defaultSections.footer,
          ...(settingsData.sections?.footer || {}),
        },
      };

      const reviews = settingsData.reviews && settingsData.reviews.length > 0
        ? settingsData.reviews
        : [
            { id: '1', name: 'Rahul Patel', review: 'Best shoe store in Surat! Quality is unmatched and very comfortable.', rating: 5, image: '' },
            { id: '2', name: 'Priya Shah', review: 'Amazing collection and helpful staff. Highly recommended!', rating: 5, image: '' },
            { id: '3', name: 'Amit Desai', review: 'Trustworthy brand with great prices. My whole family shops here.', rating: 5, image: '' },
          ];

      set({
        data: {
          ...(settingsData || {}),
          sections,
          reviews,
          products,
          categories,
        },
      });

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  },
}));
