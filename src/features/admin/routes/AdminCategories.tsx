import React, { useEffect, useState } from 'react';
import { getCategories, deleteCategory, createCategory, updateCategory, Category, CategoryRequest } from '../api/category-api';
import CategoryModal from '../components/CategoryModal';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(1, 100);
      const list = Array.isArray(data) ? data : data?.items || data?.data || [];
      setCategories(list);
      setError(null);
    } catch (err: any) {
      console.error("Failed to load categories", err);
      setError("Failed to load categories. Backend might be down or not returning correct data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert("Failed to delete category");
      console.error(err);
    }
  };

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (data: CategoryRequest, id?: string) => {
    if (id) {
      await updateCategory(id, data);
    } else {
      await createCategory(data);
    }
    fetchCategories();
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">Categories</h1>
          <p className="text-text-muted">Manage product categories for G-Zone.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          New Category
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                  <th className="px-6 py-4 font-bold">Category Name</th>
                  <th className="px-6 py-4 font-bold">Slug</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Order</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.categoryId} className="border-b border-surface-border hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{cat.categoryName}</p>
                        {cat.description && <p className="text-xs text-text-muted mt-0.5">{cat.description}</p>}
                      </td>
                      <td className="px-6 py-4 text-text-muted">{cat.slug}</td>
                      <td className="px-6 py-4 text-center">
                        {cat.isActive ? (
                          <span className="bg-green-500/10 text-green-500 text-[10px] font-bold uppercase px-2 py-1 rounded">Active</span>
                        ) : (
                          <span className="bg-gray-500/10 text-gray-500 text-[10px] font-bold uppercase px-2 py-1 rounded">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-white">{cat.displayOrder}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(cat)}
                            className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex flex-col items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.categoryId)} 
                            className="w-8 h-8 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex flex-col items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pop-up for Create / Edit */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={selectedCategory}
        categories={categories}
      />
    </div>
  );
};

export default AdminCategories;