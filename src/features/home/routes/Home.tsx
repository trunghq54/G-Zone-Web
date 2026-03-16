import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import highPerformanceRedSportMotorcycle from '@/assets/high-performance-red-sport-motorcycle.png';
import helmet from '@/assets/helmet.png';
import jacket from '@/assets/jacket.png';
import gloves from '@/assets/gloves.png';
import { Product, getProducts } from '@/features/admin/api/product-api';
import { addToCart } from '@/lib/cart';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(1, 8);
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load featured products', error);
      }
    };

    loadProducts();
  }, []);

  const quickAdd = (product: Product) => {
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
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-black h-[500px] md:h-[600px]">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
              <img 
                alt="High performance red sport motorcycle" 
                className="h-full w-full object-cover object-center opacity-80" 
                src={highPerformanceRedSportMotorcycle} 
              />
            </div>
            <div className="relative z-20 flex h-full flex-col justify-end px-6 py-12 md:w-2/3 lg:w-1/2 lg:px-12">
              <div className="mb-6 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">New Arrival</span>
              </div>
              <h1 className="mb-4 text-5xl font-black uppercase leading-none tracking-tighter text-white sm:text-6xl lg:text-7xl">
                Ride Ready<br/>Everyday
              </h1>
              <p className="mb-8 max-w-md text-lg text-gray-300">
                Find certified gear, compare real prices, and checkout with COD in minutes.
              </p>
              <div className="mb-5 flex flex-wrap gap-4">
                <Link to="/shop" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold tracking-wide text-white transition-all hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(230,0,0,0.4)]">
                  SHOP NOW
                </Link>
                <Link to="/profile/orders" className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 text-base font-bold tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  TRACK ORDER
                </Link>
              </div>
              <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/80">COD available</div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/80">Fast support</div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/80">Verified gear</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white">Featured Categories</h2>
          <Link to="/shop" className="hidden text-sm font-bold text-primary hover:text-white sm:block">VIEW ALL CATEGORIES -&gt;</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px]">
          {/* Primary Feature: Helmets */}
          <Link to="/shop" className="group relative col-span-1 md:col-span-2 md:row-span-2 overflow-hidden rounded-xl bg-surface-dark border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
            <img alt="Helmet" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={helmet} />
            <div className="absolute bottom-0 left-0 z-20 p-8">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">Protection</span>
              <h3 className="text-4xl font-black uppercase text-white group-hover:text-primary transition-colors">Helmets</h3>
              <p className="mt-2 text-gray-400">DOT & SNELL certified for maximum safety.</p>
            </div>
          </Link>
          {/* Secondary Feature: Jackets */}
          <Link to="/shop" className="group relative col-span-1 overflow-hidden rounded-xl bg-surface-dark border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img alt="Jacket" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={jacket} />
            <div className="absolute bottom-0 left-0 z-20 p-6">
              <h3 className="text-2xl font-black uppercase text-white group-hover:text-primary transition-colors">Jackets</h3>
            </div>
          </Link>
          {/* Tertiary Feature: Gloves */}
          <Link to="/shop" className="group relative col-span-1 overflow-hidden rounded-xl bg-surface-dark border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img alt="Gloves" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={gloves} />
            <div className="absolute bottom-0 left-0 z-20 p-6">
              <h3 className="text-2xl font-black uppercase text-white group-hover:text-primary transition-colors">Gloves</h3>
            </div>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-surface-border pb-4">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-white">Hot Picks</h2>
            <p className="mt-1 text-sm text-text-muted">Bestsellers selected from your latest admin inventory.</p>
          </div>
          <Link to="/shop" className="text-sm font-bold text-primary hover:text-white">VIEW ALL -&gt;</Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div key={product.productId} className="rounded-xl border border-surface-border bg-surface-dark p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">{product.brand || 'G-Zone'}</p>
              <Link to={`/product/${product.productId}`} className="mb-3 block text-lg font-bold text-white hover:text-primary transition-colors">
                {product.productName}
              </Link>
              <p className="mb-4 text-sm text-text-muted line-clamp-2">{product.description || 'Premium riding gear for daily and track usage.'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-primary">${product.basePrice.toFixed(2)}</span>
                <button
                  onClick={() => quickAdd(product)}
                  className="rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-surface-border bg-surface-dark p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Step 1</p>
            <p className="mt-1 text-white font-bold">Browse Products</p>
            <p className="mt-1 text-sm text-text-muted">Filter by category and compare prices quickly.</p>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-dark p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Step 2</p>
            <p className="mt-1 text-white font-bold">Add To Cart</p>
            <p className="mt-1 text-sm text-text-muted">Adjust quantity directly from your cart anytime.</p>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-dark p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Step 3</p>
            <p className="mt-1 text-white font-bold">Checkout COD</p>
            <p className="mt-1 text-sm text-text-muted">Place order with cash-on-delivery in one simple form.</p>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="w-full border-y border-surface-border bg-[#1a0a0a] bg-[radial-gradient(#2e1a1a_15%,transparent_16%),radial-gradient(#2e1a1a_15%,transparent_16%)] bg-[length:10px_10px] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Ready for the <span className="text-primary">Track?</span>
            </h2>
            <p className="mt-2 max-w-xl text-gray-400">Join the Redline Club and get exclusive access to limited edition drops and track day discounts.</p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <input className="flex-1 rounded-lg border-none bg-black/50 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-primary" placeholder="Enter your email" type="email" />
            <button className="rounded-lg bg-white px-6 py-3 font-bold text-black hover:bg-gray-200">JOIN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;