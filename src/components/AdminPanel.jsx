import React, { useState, useEffect } from 'react';
import { FaHome, FaBoxes } from 'react-icons/fa';
import AdminHeader from './admin/AdminHeader';
import AdminSidebar from './admin/AdminSidebar';
import ProductForm from './admin/ProductForm';
import ProductList from './admin/ProductList';
import ComboForm from './admin/ComboForm';
import ComboList from './admin/ComboList';
import ComboPreviewModal from './admin/ComboPreviewModal';
import PasswordForm from './admin/PasswordForm';
import EmailForm from './admin/EmailForm';
import EmptyState from './admin/EmptyState';
import { cache } from '../utils/cache';
import { getProducts, getCombos } from '../utils/api';
import { db, storage, auth } from '../utils/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', fabricType: '', texture: '', quality: '', care: '', images: [] });
  const [comboFormData, setComboFormData] = useState({ name: '', description: '', products: [], originalPrice: '', comboPrice: '', savings: '', images: [], popular: false });
  const [editingComboId, setEditingComboId] = useState(null);
  const [deletingComboId, setDeletingComboId] = useState(null);
  const [showComboPreview, setShowComboPreview] = useState(false);
  const [previewCombo, setPreviewCombo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPopular, setFilterPopular] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({ currentPassword: '', newEmail: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCombos();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const fetchCombos = async () => {
    const data = await getCombos();
    setCombos(data);
  };

  const handleSubmit = async (productData) => {
    setLoading(true);

    try {
      let imageUrls = [];
      
      // Upload new images to Storage if selected
      if (productData.images && productData.images.length > 0) {
        const uploadPromises = productData.images.map(async (image) => {
          const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        });
        imageUrls = await Promise.all(uploadPromises);
      } else if (editingId) {
        const existingProduct = products.find(p => p._id === editingId);
        imageUrls = existingProduct ? (existingProduct.images || [existingProduct.image]) : [];
      }

      const docData = {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        description: productData.description || '',
        fabricType: productData.fabricType || '',
        texture: productData.texture || '',
        quality: productData.quality || '',
        care: productData.care || '',
        images: imageUrls,
        image: imageUrls[0] || 'https://via.placeholder.com/400x400?text=No+Image',
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        const docRef = doc(db, 'products', editingId);
        await updateDoc(docRef, docData);
      } else {
        docData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'products'), docData);
      }
      
      cache.clear('products');
      fetchProducts();
      setFormData({ name: '', price: '', category: '', description: '', fabricType: '', texture: '', quality: '', care: '', images: [] });
      setEditingId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({ 
      name: product.name, 
      price: product.price, 
      category: product.category, 
      description: product.description || '',
      fabricType: product.fabricType || '',
      texture: product.texture || '',
      quality: product.quality || '',
      care: product.care || '',
      images: [] 
    });
    setEditingId(product._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      setDeletingId(id);
      try {
        await deleteDoc(doc(db, 'products', id));
        cache.clear('products');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEditCombo = (combo) => {
    setComboFormData({
      name: combo.name,
      description: combo.description,
      products: combo.products.map(p => p._id || p),
      originalPrice: combo.originalPrice,
      comboPrice: combo.comboPrice,
      savings: combo.savings,
      images: [],
      popular: combo.popular
    });
    setEditingComboId(combo._id);
    setShowAddForm(true);
  };

  const handleDeleteCombo = async (id) => {
    if (confirm('Delete this combo?')) {
      setDeletingComboId(id);
      try {
        await deleteDoc(doc(db, 'combos', id));
        cache.clear('combos');
        fetchCombos();
      } catch (error) {
        console.error('Error deleting combo:', error);
        alert('Error deleting combo: ' + error.message);
      } finally {
        setDeletingComboId(null);
      }
    }
  };

  const handleSubmitCombo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls = [];

      // Upload new combo images if selected
      if (comboFormData.images && comboFormData.images.length > 0) {
        const uploadPromises = comboFormData.images.map(async (image) => {
          const storageRef = ref(storage, `combos/${Date.now()}_${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        });
        imageUrls = await Promise.all(uploadPromises);
      } else if (editingComboId) {
        const existingCombo = combos.find(c => c._id === editingComboId);
        imageUrls = existingCombo ? (existingCombo.images || [existingCombo.image]) : [];
      }

      const docData = {
        name: comboFormData.name,
        description: comboFormData.description || '',
        products: comboFormData.products,
        originalPrice: comboFormData.originalPrice,
        comboPrice: comboFormData.comboPrice,
        savings: comboFormData.savings,
        popular: comboFormData.popular || false,
        images: imageUrls,
        image: imageUrls[0] || 'https://via.placeholder.com/400x400?text=No+Image',
        updatedAt: new Date().toISOString()
      };

      if (editingComboId) {
        const docRef = doc(db, 'combos', editingComboId);
        await updateDoc(docRef, docData);
      } else {
        docData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'combos'), docData);
      }
      
      cache.clear('combos');
      fetchCombos();
      setComboFormData({ name: '', description: '', products: [], originalPrice: '', comboPrice: '', savings: '', images: [], popular: false });
      setEditingComboId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving combo:', error);
      alert('Error saving combo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetComboForm = () => {
    setShowAddForm(false);
    setEditingComboId(null);
    setComboFormData({ name: '', description: '', products: [], originalPrice: '', comboPrice: '', savings: '', images: [], popular: false });
  };

  const handlePreviewCombo = (combo) => {
    setPreviewCombo(combo);
    setShowComboPreview(true);
  };

  const getSelectedProducts = () => {
    return products.filter(product => comboFormData.products.includes(product._id));
  };

  const calculateTotalOriginalPrice = () => {
    const selectedProducts = getSelectedProducts();
    return selectedProducts.reduce((total, product) => {
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, '')) || 0;
      return total + price;
    }, 0);
  };

  const filteredCombos = combos.filter(combo => {
    const matchesSearch = combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         combo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterPopular || combo.popular;
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        activeTab={activeTab}
        itemCount={activeTab === 'products' ? products.length : combos.length}
        onAddNew={() => setShowAddForm(true)}
        onChangePassword={() => setShowPasswordForm(true)}
        onChangeEmail={() => setShowEmailForm(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(true)}
      />

      <AdminSidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onClose={() => setSidebarOpen(false)}
        onAddNew={() => setShowAddForm(true)}
        onChangePassword={() => setShowPasswordForm(true)}
        onChangeEmail={() => setShowEmailForm(true)}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Navigation Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors text-center ${
                  activeTab === 'products'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaHome className="inline mr-2" />Products
                <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {products.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('combos')}
                className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors text-center ${
                  activeTab === 'combos'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaBoxes className="inline mr-2" />Combos
                <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {combos.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {showEmailForm && (
          <EmailForm
            emailData={emailData}
            setEmailData={setEmailData}
            onSubmit={async (e) => {
              e.preventDefault();
              setEmailLoading(true);
              try {
                const user = auth.currentUser;
                if (!user) throw new Error("No authenticated user found.");
                const credential = EmailAuthProvider.credential(user.email, emailData.currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updateEmail(user, emailData.newEmail);
                alert('Email changed successfully');
                setShowEmailForm(false);
                setEmailData({ currentPassword: '', newEmail: '' });
              } catch (error) {
                console.error('Error changing email:', error);
                alert('Failed to change email: ' + error.message);
              } finally {
                setEmailLoading(false);
              }
            }}
            onCancel={() => {setShowEmailForm(false); setEmailData({ currentPassword: '', newEmail: '' });}}
            loading={emailLoading}
          />
        )}

        {showPasswordForm && (
          <PasswordForm
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onSubmit={async (e) => {
              e.preventDefault();
              if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert('New passwords do not match');
                return;
              }
              setPasswordLoading(true);
              try {
                const user = auth.currentUser;
                if (!user) throw new Error("No authenticated user found.");
                const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, passwordData.newPassword);
                alert('Password changed successfully');
                setShowPasswordForm(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              } catch (error) {
                console.error('Error changing password:', error);
                alert('Failed to change password: ' + error.message);
              } finally {
                setPasswordLoading(false);
              }
            }}
            onCancel={() => {setShowPasswordForm(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });}}
            loading={passwordLoading}
          />
        )}

        {showAddForm && activeTab === 'combos' && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={resetComboForm}
          >
            <div 
              className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl transform transition-all duration-500 ease-out animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <ComboForm
                formData={comboFormData}
                setFormData={setComboFormData}
                products={products}
                onSubmit={handleSubmitCombo}
                onCancel={resetComboForm}
                loading={loading}
                isEditing={!!editingComboId}
                onPreview={handlePreviewCombo}
                calculatePrice={calculateTotalOriginalPrice}
              />
            </div>
          </div>
        )}

        {showAddForm && activeTab === 'products' && (
          <ProductForm
            product={editingId ? products.find(p => p._id === editingId) : null}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowAddForm(false);
              setEditingId(null);
              setFormData({ name: '', price: '', category: '', description: '', fabricType: '', texture: '', quality: '', care: '', images: [] });
            }}
            loading={loading}
          />
        )}

        {activeTab === 'products' && (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            onAddNew={() => setShowAddForm(true)}
          />
        )}

        {activeTab === 'combos' && (
          <ComboList
            combos={combos}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterPopular={filterPopular}
            setFilterPopular={setFilterPopular}
            onEdit={handleEditCombo}
            onDelete={handleDeleteCombo}
            onPreview={handlePreviewCombo}
            editingId={editingComboId}
            deletingId={deletingComboId}
            onAddNew={() => setShowAddForm(true)}
          />
        )}

        {/* Combo Preview Modal */}
        <ComboPreviewModal
          combo={previewCombo}
          isOpen={showComboPreview}
          onClose={() => setShowComboPreview(false)}
          onEdit={handleEditCombo}
        />
           
        {((activeTab === 'products' && products.length === 0) || (activeTab === 'combos' && combos.length === 0)) && (
          <EmptyState
            activeTab={activeTab}
            onAddNew={() => setShowAddForm(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;