import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, getProducts } from '@/features/admin/api/product-api';
import { Category, getCategories } from '@/features/admin/api/category-api';
import { addToCart } from '@/lib/cart';

const Accessories: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(1, 100),
          getCategories(1, 100),
        ]);

        setProducts(productData.filter((item) => item.isActive));
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to load shop data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products;
    }

    return products.filter((item) => item.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  const getCategoryName = (id: string) =>
    categories.find((item) => item.categoryId === id)?.categoryName || 'Uncategorized';

  const handleAdd = (product: Product) => {
    addToCart({
      productId: product.productId,
      productName: product.productName,
      sku: product.sku,
      basePrice: product.basePrice,
      quantity: 1,
      categoryId: product.categoryId,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
    });
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block">
        <div className="border-b border-border-dark pb-6">
            <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-4">Category</h3>
            <div className="space-y-2 text-sm text-gray-400">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full rounded px-2 py-1 text-left transition-colors ${selectedCategory === '' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => setSelectedCategory(category.categoryId)}
                    className={`block w-full rounded px-2 py-1 text-left transition-colors ${selectedCategory === category.categoryId ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
                  >
                    {category.categoryName}
                  </button>
                ))}
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-border-dark pb-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white uppercase italic tracking-tighter">Motorcycle Accessories</h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base">Upgrade your ride with live inventory from your admin panel.</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-text-muted">Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-text-muted">No products found in this category.</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.productId} className="group relative bg-surface-dark rounded-md border border-border-dark overflow-hidden transition-all hover:border-primary/50">
                    <div className="absolute top-3 right-3 z-10"><span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm">{product.isFeatured ? 'Featured' : 'In Stock'}</span></div>
                    <div className="h-48 w-full bg-[#151515] relative p-6 flex items-center justify-center overflow-hidden">
                        <span className="text-4xl text-white/30 material-symbols-outlined">two_wheeler</span>
                    </div>
                    <div className="p-5">
                        <div className="text-xs text-gray-500 font-mono mb-1">{getCategoryName(product.categoryId).toUpperCase()}</div>
                        <Link to={`/product/${product.productId}`} className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors block">{product.productName}</Link>
                        <p className="text-text-muted text-sm mb-3 line-clamp-2">{product.description || 'Premium riding product.'}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary font-mono">${product.basePrice.toFixed(2)}</span>
                          <button
                            onClick={() => handleAdd(product)}
                            className="rounded bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                    </div>
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );
};

export default Accessories;