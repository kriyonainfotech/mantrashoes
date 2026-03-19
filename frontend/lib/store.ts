import { create } from 'zustand';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      const prodRes = await fetch(`${API_URL}/api/products/get-products`);
      const products = await prodRes.json();
      
      const catRes = await fetch(`${API_URL}/api/categories/get-categories`);
      const categoriesData = await catRes.json();
      
      // Keep existing structure for sections/theme but update products/categories
      const currentData = get().data || {
        theme: { 
          accent: '#000000', 
          secondary: '#ffffff',
          softBackground: '#f9fafb'
        },
        sections: {
          hero: { 
            enabled: true, 
            title: 'MANTRA', 
            subtitle: 'Step into the future of luxury footwear.', 
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80' 
          },
          featuredProducts: { 
            enabled: true, 
            title: 'Featured Selection' 
          },
          brandStory: { 
            enabled: true, 
            title: 'A Legacy of Excellence',
            description: 'Founded on the principles of quality and craftsmanship, Mantra represents the pinnacle of luxury footwear. Each pair is handcrafted using the finest materials sourced globally.',
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80'
          },
          reviews: { 
            enabled: true, 
            title: 'Customer Stories' 
          },
          instagram: { 
            enabled: true, 
            title: 'Mantra on Instagram' 
          },
          footer: { 
            enabled: true, 
            description: 'Premium luxury footwear for the modern individual.',
            email: 'hello@mantrashoes.com',
            phone: '+91 74050 40700',
            address: 'Shop No B-3, Varachha Main Rd, nr. Rise On Plaza, Sarthana Jakat Naka, Nana Varachha, Surat, Gujarat 395013'
          }
        },
        reviews: [
          { id: 1, name: 'John Doe', review: 'Best shoes I have ever owned. The quality is unmatched.', rating: 5, image: 'https://picsum.photos/100/100?random=1' },
          { id: 2, name: 'Jane Smith', review: 'Exceptional service and beautiful designs.', rating: 5, image: 'https://picsum.photos/100/100?random=2' },
          { id: 3, name: 'Robert Brown', review: 'A true luxury experience from start to finish.', rating: 5, image: 'https://picsum.photos/100/100?random=3' }
        ]
      };

      set({ 
        data: { 
          ...currentData,
          products: products || [], 
          categories: categoriesData.categories || [] 
        } 
      });
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  },
}));
