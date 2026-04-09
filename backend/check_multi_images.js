
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Product = mongoose.model('Product', new mongoose.Schema({ images: Array }, { strict: false }));
    const many = await Product.find({ 'images.1': { $exists: true } });
    console.log('Products with more than 1 image:', many.length);
    many.forEach(p => {
      console.log(`- ${p.name}: ${p.images.length} images`);
    });
    await mongoose.disconnect();
  } catch (err) { console.error(err); }
}
check();
