import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, getProducts } from '@/features/admin/api/product-api';
import { Category, getCategories } from '@/features/admin/api/category-api';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/providers/ToastProvider';

const PAGE_SIZE = 9;

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const Accessories: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(1, 200),
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

  // Reset page whenever filters change
  useEffect(() => { setPage(1); }, [selectedCategory, search, sort]);

  const processed = useMemo(() => {
    let list = [...products];
    if (selectedCategory) list = list.filter((p) => p.categoryId === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.productName.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }
    if (sort === 'price-asc') list.sort((a, b) => a.basePrice - b.basePrice);
    else if (sort === 'price-desc') list.sort((a, b) => b.basePrice - a.basePrice);
    else if (sort === 'name-asc') list.sort((a, b) => a.productName.localeCompare(b.productName));
    return list;
  }, [products, selectedCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
    showToast(`"${product.productName}" added to cart!`);
  };

  const CategoryList = () => (
    <div className="space-y-1 text-sm text-gray-400">
      <button
        onClick={() => setSelectedCategory('')}
        className={`block w-full rounded px-3 py-2 text-left transition-colors ${selectedCategory === '' ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-white/5'}`}
      >
        All Categories <span className="float-right text-xs opacity-60">{products.length}</span>
      </button>
      {categories.map((category) => {
        const count = products.filter((p) => p.categoryId === category.categoryId).length;
        return (
          <button
            key={category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
            className={`block w-full rounded px-3 py-2 text-left transition-colors ${selectedCategory === category.categoryId ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-white/5'}`}
          >
            {category.categoryName} <span className="float-right text-xs opacity-60">{count}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 border-b border-border-dark pb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase italic tracking-tighter">Shop</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {loading ? 'Loading...' : `${processed.length} product${processed.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base">search</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-lg border border-border-dark bg-surface-dark pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-lg border border-border-dark bg-surface-dark px-3 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden h-10 px-3 rounded-lg border border-border-dark bg-surface-dark text-white"
            >
              <span className="material-symbols-outlined text-base">filter_list</span>
            </button>
          </div>
        </div>
        {/* Mobile category filter */}
        {mobileFilterOpen && (
          <div className="md:hidden rounded-lg border border-border-dark bg-surface-dark p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Category</p>
            <CategoryList />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24 rounded-xl border border-border-dark bg-surface-dark p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Category</p>
            <CategoryList />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border-dark bg-surface-dark h-72 animate-pulse" />
              ))
            ) : paginated.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-white/20 mb-4">search_off</span>
                <p className="text-white font-bold">No products found</p>
                <p className="text-text-muted text-sm mt-1">Try adjusting your search or category filter.</p>
                <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="mt-4 text-primary text-sm font-bold hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              paginated.map((product) => (
                <div key={product.productId} className="group relative bg-surface-dark rounded-xl border border-border-dark overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm">Featured</span>
                    </div>
                  )}
                  <Link to={`/product/${product.productId}`} className="h-44 w-full bg-[#151515] flex items-center justify-center overflow-hidden">
                    <span className="text-5xl text-white/20 material-symbols-outlined group-hover:scale-110 transition-transform duration-300">two_wheeler</span>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-wider">{getCategoryName(product.categoryId)}</div>
                    <Link to={`/product/${product.productId}`} className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{product.productName}</Link>
                    <p className="text-text-muted text-xs mb-4 line-clamp-2 flex-1">{product.description || 'Premium riding product.'}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xl font-bold text-primary font-mono">${product.basePrice.toFixed(2)}</span>
                      <button
                        onClick={() => handleAdd(product)}
                        className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 w-9 rounded-lg border border-border-dark bg-surface-dark text-white disabled:opacity-30 hover:border-primary transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg border text-sm font-bold transition-colors ${p === page ? 'border-primary bg-primary text-white' : 'border-border-dark bg-surface-dark text-white hover:border-primary'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 w-9 rounded-lg border border-border-dark bg-surface-dark text-white disabled:opacity-30 hover:border-primary transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accessories;