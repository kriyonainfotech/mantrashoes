const mongoose = require('mongoose');

async function checkData() {
    await mongoose.connect('mongodb+srv://mantrashoessurat_db_user:mantrashoessurat_db_user@cluster0.ptnrudr.mongodb.net/mantrashoes');
    
    // Minimal schemes
    const Category = mongoose.model('Category', new mongoose.Schema({
        name: String,
        parent: mongoose.Schema.Types.ObjectId,
        isActive: Boolean,
        isFeatured: Boolean,
        showOnHome: Boolean
    }, { strict: false }));
    const Product = mongoose.model('Product', new mongoose.Schema({
        name: String,
        category: mongoose.Schema.Types.ObjectId,
        isActive: Boolean,
        isFeatured: Boolean
    }, { strict: false }));
    
    console.log('--- Categories ---');
    const categories = await Category.find().lean();
    categories.forEach(c => {
        console.log(`Name: ${c.name}, Parent: ${c.parent}, isActive: ${c.isActive}, isFeatured: ${c.isFeatured}, showOnHome: ${c.showOnHome}`);
    });
    
    console.log('\n--- Products ---');
    const products = await Product.find({ isActive: { $ne: false } }).lean();
    console.log(`Total Active Products: ${products.length}`);
    const featured = products.filter(p => p.isFeatured);
    console.log(`Featured Products: ${featured.length}`);
    if (featured.length > 0) {
        featured.forEach(p => console.log(`  - ${p.name} (Category: ${p.category})`));
    }
    
    process.exit(0);
}

checkData();
