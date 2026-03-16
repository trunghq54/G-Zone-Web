import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Product, getProductById } from '@/features/admin/api/product-api';
import { addToCart } from '@/lib/cart';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/shop');
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart({
      productId: product.productId,
      productName: product.productName,
      sku: product.sku,
      basePrice: product.basePrice,
      quantity: qty,
      categoryId: product.categoryId,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
    });

    navigate('/cart');
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-text-muted">Loading product...</div>;
  }

  if (!product) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-text-muted">Product not found.</div>;
  }

  return (
    <div className="layout-container flex h-full grow flex-col max-w-[1280px] mx-auto px-4 md:px-8 py-6 w-full">
      <nav className="flex flex-wrap gap-2 py-4 mb-4 text-sm font-medium">
        <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link>
        <span className="text-text-muted">/</span>
        <Link to="/shop" className="text-text-muted hover:text-white transition-colors">Shop</Link>
        <span className="text-text-muted">/</span>
        <span className="text-primary">{product.productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-dark border border-[#3a1a1a] group flex items-center justify-center">
            <span className="material-symbols-outlined text-9xl text-white/20">inventory_2</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 flex flex-col gap-6 bg-surface-dark p-6 md:p-8 rounded-xl border border-[#3a1a1a] shadow-2xl shadow-black/50">
            <div className="border-b border-[#3a1a1a] pb-6">
              <h3 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-1">{product.brand || 'G-Zone Collection'}</h3>
              <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{product.productName}</h1>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">{product.description || 'No description yet.'}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-primary text-3xl font-bold">${product.basePrice.toFixed(2)}</span>
                <span className="text-[#4caf50] text-xs font-bold bg-[#1b3320] px-2 py-1 rounded ml-auto">{product.isActive ? 'In Stock' : 'Inactive'}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-text-muted">
              <p>SKU: <span className="text-white font-medium">{product.sku}</span></p>
              <p>Material: <span className="text-white font-medium">{product.material || 'N/A'}</span></p>
              <p>Weight: <span className="text-white font-medium">{product.weight || 0} kg</span></p>
              <p>Dimensions: <span className="text-white font-medium">{product.dimension || 'N/A'}</span></p>
              <p>Warranty: <span className="text-white font-medium">{product.warrantyPeriodMonths || 0} months</span></p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="h-11 w-11 rounded-md border border-surface-border text-white hover:border-primary"
              >
                -
              </button>
              <div className="h-11 min-w-14 rounded-md border border-surface-border px-4 flex items-center justify-center text-white font-bold">
                {qty}
              </div>
              <button
                onClick={() => setQty((prev) => prev + 1)}
                className="h-11 w-11 rounded-md border border-surface-border text-white hover:border-primary"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="h-14 bg-primary hover:bg-[#c20000] text-white rounded-md font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Add to Cart</span>
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
