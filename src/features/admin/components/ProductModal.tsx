
import React, { useState, useEffect } from "react";
import { Product, ProductRequest } from "../api/product-api";
import { Category } from "../api/category-api";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductRequest, id?: string) => Promise<void>;
  initialData?: Product | null;
  categories: Category[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  const [formData, setFormData] = useState<ProductRequest>({
    productName: "",
    sku: "",
    description: "",
    basePrice: 0,
    brand: "",
    material: "",
    specifications: "",
    weight: 0,
    dimension: "",
    viewCount: 0,
    soldCount: 0,
    averageRating: 0,
    totalReviews: 0,
    isActive: true,
    isFeatured: false,
    warrantyPeriodMonths: 0,
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        description: initialData.description || "",
        brand: initialData.brand || "",
        material: initialData.material || "",
        specifications: initialData.specifications || "",
        dimension: initialData.dimension || "",
      });
    } else {
      setFormData({
        productName: "",
        sku: "",
        description: "",
        basePrice: 0,
        brand: "",
        material: "",
        specifications: "",
        weight: 0,
        dimension: "",
        viewCount: 0,
        soldCount: 0,
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        isFeatured: false,
        warrantyPeriodMonths: 0,
        categoryId: categories.length > 0 ? categories[0].categoryId : "",
      });
    }
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (
      type === "number" ||
      ["basePrice", "weight", "warrantyPeriodMonths"].includes(name)
    ) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.categoryId) {
        alert("Please select a category");
        setLoading(false);
        return;
      }
      await onSave(formData, initialData?.productId);
      onClose();
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Something went wrong saving the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-3xl shadow-2xl my-auto">
        <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            {initialData ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. AGV K3 SV Helmet"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. HEL-AGV-K3-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="" disabled>Select a Category...</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. AGV, Alpinestars"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Product details..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Base Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimension"
                value={formData.dimension}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. 10x20x15 cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Warranty (Months)
              </label>
              <input
                type="number"
                min="0"
                name="warrantyPeriodMonths"
                value={formData.warrantyPeriodMonths}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Specifications
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                rows={2}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Technical specs..."
              />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="flex items-center h-[50px] px-4 bg-[#2a1212] border border-surface-border rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-white text-sm font-medium">Active</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Featured
              </label>
              <div className="flex items-center h-[50px] px-4 bg-[#2a1212] border border-surface-border rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-white text-sm font-medium">Featured Product</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

