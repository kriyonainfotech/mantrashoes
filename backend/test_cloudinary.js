require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY
});

const base = "8zUNKZfrHkaqa0XvJ7TU5VauuDI";

// Variations to try
const chars = {
  '8': ['8', 'B'],
  'z': ['z', 'Z', '2'],
  'U': ['U', 'u', 'V'],
  'N': ['N', 'n'],
  'K': ['K', 'k'],
  'Z': ['Z', 'z', '2'],
  'f': ['f', 't'],
  'r': ['r'],
  'H': ['H', 'h'],
  'k': ['k', 'K'],
  'a': ['a'],
  'q': ['q', 'g'],
  'a': ['a'],
  '0': ['0', 'O', 'o'],
  'X': ['X', 'x'],
  'v': ['v', 'V'],
  'J': ['J', 'j', 'I', 'l'],
  '7': ['7', 'T'],
  'T': ['T', '7'],
  'U': ['U', 'u'],
  '5': ['5', 'S', 's'],
  'V': ['V', 'v', 'U'],
  'a': ['a'],
  'u': ['u', 'U', 'v'],
  'u': ['u', 'U', 'v'],
  'D': ['D', 'O', '0'],
  'I': ['I', 'l', '1', 'i']
};

async function testSecret(secret) {
  cloudinary.config({ api_secret: secret });
  try {
    await cloudinary.api.ping();
    return true;
  } catch (e) {
    return false;
  }
}

async function bruteForce() {
  console.log("Starting brute force... this might take a minute.");
  // To avoid massive combinatorial explosion, let's just try the most likely ones first.
  
  const mostLikely = [
    "8zUNKZfrHkaqa0XvJ7TU5VauuDI",
    "8zUNKZfrHkaqaOXvJ7TU5VauuDI",
    "8zUNKZfrHkaqaoXvJ7TU5VauuDI",
    
    "8zUNKZfrHkaqa0XvJ7TU5VauuDl",
    "8zUNKZfrHkaqaOXvJ7TU5VauuDl",
    "8zUNKZfrHkaqaoXvJ7TU5VauuDl",
    
    "8zUNKzfrHkaqa0XvJ7TU5VauuDI",
    "8zUNKzfrHkaqaOXvJ7TU5VauuDI",
    "8zUNkZfrHkaqa0XvJ7TU5VauuDI",
    
    "BzUNKZfrHkaqa0XvJ7TU5VauuDI",
    "BzUNKZfrHkaqaOXvJ7TU5VauuDI",
    
    // what if I is 1?
    "8zUNKZfrHkaqa0XvJ7TU5VauuD1",
    "8zUNKZfrHkaqaOXvJ7TU5VauuD1",
  ];
  
  for(let secret of mostLikely) {
    if(await testSecret(secret)) {
      console.log("FOUND IT! Secret is:", secret);
      return;
    }
  }
  
  console.log("Most likely failed. Please ask the user.");
}

bruteForce();
