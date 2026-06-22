export const defaultData = {
  theme: {
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    accentColor: "#E63946",
    softBackground: "#F7F7F7",
    borderColor: "#E5E5E5",
    hoverColor: "#111111",
  },
  sections: {
    hero: {
      enabled: true,
      title: "Move With Confidence",
      subtitle: "Premium shoes engineered for performance and style.",
      image: "https://picsum.photos/seed/mantrahero/1920/1080",
      button1Text: "Shop Now",
      button1Link: "/shop",
      button2Text: "Explore Collection",
      button2Link: "/collections"
    },
    featuredProducts: {
      enabled: true,
      title: "Featured Collection"
    },
    brandStory: {
      enabled: true,
      title: "Crafted for the Bold",
      description: "Every pair of Mantra shoes is a testament to our commitment to quality, performance, and uncompromising style. We believe in pushing boundaries and setting new standards.",
      image: "https://picsum.photos/seed/mantrastory/800/1000"
    },
    reviews: {
      enabled: true,
      title: "Customer Reviews"
    },
    instagram: {
      enabled: true,
      title: "Follow Us @MantraShoes",
      profileLink: "https://instagram.com",
      images: [
        "https://picsum.photos/seed/ig1/400/400",
        "https://picsum.photos/seed/ig2/400/400",
        "https://picsum.photos/seed/ig3/400/400",
        "https://picsum.photos/seed/ig4/400/400",
        "https://picsum.photos/seed/ig5/400/400",
        "https://picsum.photos/seed/ig6/400/400"
      ]
    },
    newsletter: {
      enabled: true,
      title: "Join the Mantra Club"
    },
    footer: {
      description: "Authentic, comfortable footwear trusted by Surat families for decades.",
      phone: "+91 74050 40700",
      address: "Shop No B-3, Varachha Main Rd, Sarthana Jakat Naka, Nana Varachha, Surat",
      email: "hello@mantrashoes.com",
    },
    shopHeader: {
      title: "ALL PRODUCTS",
      subtitle: "Explore our complete collection of premium footwear designed for performance and style."
    },
    collectionsHeader: {
      title: "COLLECTIONS",
      subtitle: "Curated series for every aspect of your active lifestyle."
    },
    aboutHeader: {
      title: "OUR STORY",
      subtitle: "The journey of Mantra Shoes and our commitment to excellence."
    }
  },
  products: [],
  collections: [
    {
      id: "1",
      title: "Running Collection",
      description: "Engineered for speed and endurance.",
      image: "https://picsum.photos/seed/running/1200/600"
    },
    {
      id: "2",
      title: "Urban Sneakers",
      description: "Street-ready style meets all-day comfort.",
      image: "https://picsum.photos/seed/urban/1200/600"
    },
    {
      id: "3",
      title: "Performance Series",
      description: "Push your limits with pro-level gear.",
      image: "https://picsum.photos/seed/performance/1200/600"
    }
  ],
  reviews: [
    {
      id: "1",
      name: "Alex Johnson",
      rating: 5,
      review: "The most comfortable running shoes I've ever owned. The Phantom series is incredible.",
      image: "https://picsum.photos/seed/user1/100/100"
    },
    {
      "id": "2",
      "name": "Sarah Williams",
      "rating": 5,
      "review": "Sleek, modern, and perfect for city life. I get compliments on my Stealths daily.",
      "image": "https://picsum.photos/seed/user2/100/100"
    },
    {
      "id": "3",
      "name": "Michael Chen",
      "rating": 4,
      "review": "Great performance and support. Took a few days to break in, but now they are perfect.",
      "image": "https://picsum.photos/seed/user3/100/100"
    }
  ]
};

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

export function getData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading data.json, returning defaultData:', error);
  }
  
  // Create file with default data if it doesn't exist
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing default data.json:', error);
  }
  return defaultData;
}

export function saveData(data: any) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving data.json:', error);
  }
}
