
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkProduct() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Using simple object search if model not loaded
    const Product = mongoose.model('Product', new mongoose.Schema({ images: Array }, { strict: false }));
    
    const product = await Product.findById('69d1f3f30a71b84463e32529');
    if (!product) {
      console.log('Product not found');
    } else {
      console.log('Product Name:', product.name);
      console.log('Images Count:', product.images ? product.images.length : 0);
      console.log('Images:', JSON.stringify(product.images, null, 2));
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkProduct();
