import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import type { Product, Order, OrderItem } from '@/types';
import { toast } from 'sonner';
import { LogOut, Plus, Pencil, Trash2, Package, ShoppingBag, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import logo from '@/assets/Prime_Sport_Store_logo_design_202605081633.jpeg';
import AnimatedBackground from '@/components/AnimatedBackground';

const emptyProduct = { name: '', description: '', new_price: '', category: '', is_sold: false };

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin/login');
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate('/admin/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      new_price: product.new_price.toString(),
      category: product.category || '',
      is_sold: product.is_sold,
    });
    if (product.image_urls && product.image_urls.length > 0) {
      setImagePreviewUrls(product.image_urls);
    } else if (product.image_url) {
      setImagePreviewUrls([product.image_url]);
    } else {
      setImagePreviewUrls([]);
    }
    setImageFiles([]);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageFiles([]);
    setImagePreviewUrls([]);
    setShowForm(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return null; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    return urls;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      toast.error('Some images were skipped. Maximum size is 5MB per image.');
    }

    setImageFiles(prev => [...prev, ...validFiles]);
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    if (index < imageFiles.length) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviewUrls([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let newImageUrls: string[] = [];
    if (imageFiles.length > 0) {
      newImageUrls = await uploadImages(imageFiles);
      if (newImageUrls.length === 0 && imageFiles.length > 0) {
        setSaving(false);
        return;
      }
    }

    const existingImageUrls = imagePreviewUrls.slice(0, imagePreviewUrls.length - imageFiles.length);
    const allImageUrls = [...existingImageUrls, ...newImageUrls];

    const payload = {
      name: form.name,
      description: form.description || null,
      new_price: parseFloat(form.new_price),
      category: form.category || null,
      is_sold: form.is_sold,
      image_url: allImageUrls.length > 0 ? allImageUrls[0] : null,
      image_urls: allImageUrls,
    };

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
      if (error) toast.error(error.message); else toast.success('Product updated');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) toast.error(error.message); else toast.success('Product created');
    }

    setSaving(false);
    setShowForm(false);
    setImageFiles([]);
    setImagePreviewUrls([]);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(error.message); else toast.success('Product deleted');
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) toast.error(error.message); else toast.success('Order deleted');
  };

  if (!session) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          background: 'rgba(234,179,8,0.15)',
          border: '1px solid rgba(234,179,8,0.3)',
          color: '#FCD34D'
        };
      case 'confirmed':
        return {
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          color: '#86EFAC'
        };
      case 'cancelled':
        return {
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#FCA5A5'
        };
      default:
        return {
          background: 'rgba(139,92,246,0.15)',
          border: '1px solid rgba(139,92,246,0.3)',
          color: '#A78BFA'
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getDeliveryTypeLabel = (type: string) => {
    return type === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب';
  };

  return (
    <>
      <AnimatedBackground />
      <div style={{
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Admin Navbar */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(10, 10, 15, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left — logo + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))'
              }} 
            />
            <span style={{
              color: '#F1F0FF',
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Cairo'
            }}>لوحة التحكم</span>
          </div>

          {/* Right — nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a
              onClick={() => navigate('/')}
              style={{
                color: '#9B99B8',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s',
                cursor: 'pointer',
                fontFamily: 'Cairo'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#A78BFA'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#9B99B8'}
            >
              🌐 الذهاب للموقع
            </a>
            <a
              onClick={handleLogout}
              style={{
                color: '#9B99B8',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'Cairo'
              }}
            >
              🚪 تسجيل الخروج
            </a>
          </div>
        </nav>

        {/* Page content */}
        <div style={{
          background: 'transparent',
          minHeight: '100vh',
          paddingTop: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '40px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setTab('products')}
              style={{
                background: tab === 'products' 
                  ? 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(139,92,246,0.3))' 
                  : 'rgba(26, 26, 38, 0.6)',
                backdropFilter: 'blur(10px)',
                border: tab === 'products' 
                  ? '1px solid rgba(139, 92, 246, 0.5)' 
                  : '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                color: tab === 'products' ? '#F1F0FF' : '#9B99B8',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: tab === 'products' ? 700 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'Cairo',
                boxShadow: tab === 'products' ? '0 0 16px rgba(139,92,246,0.3)' : 'none'
              }}
            >
              <Package size={16} />
              إدارة المنتجات
            </button>
            <button
              onClick={() => setTab('orders')}
              style={{
                background: tab === 'orders' 
                  ? 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(139,92,246,0.3))' 
                  : 'rgba(26, 26, 38, 0.6)',
                backdropFilter: 'blur(10px)',
                border: tab === 'orders' 
                  ? '1px solid rgba(139, 92, 246, 0.5)' 
                  : '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                color: tab === 'orders' ? '#F1F0FF' : '#9B99B8',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: tab === 'orders' ? 700 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'Cairo',
                boxShadow: tab === 'orders' ? '0 0 16px rgba(139,92,246,0.3)' : 'none'
              }}
            >
              <ShoppingBag size={16} />
              إدارة الطلبات
            </button>
          </div>

          {/* Products Tab */}
          {tab === 'products' && (
            <div>
              {/* Section header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{
                  color: '#F1F0FF',
                  fontSize: '22px',
                  fontWeight: 800,
                  fontFamily: 'Cairo',
                  margin: 0,
                  background: 'linear-gradient(135deg, #F1F0FF, #A78BFA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>إدارة المنتجات</h2>
                
                <button
                  onClick={openNew}
                  style={{
                    background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: 700,
                    fontFamily: 'Cairo',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(139,92,246,0.4)',
                    transition: 'all 0.25s'
                  }}
                >
                  <Plus size={16} />
                  إضافة منتج
                </button>
              </div>

              {/* Product Form Modal */}
              {showForm && (
                <div 
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    padding: '20px'
                  }}
                  onClick={() => setShowForm(false)}
                >
                  <div
                    style={{
                      background: 'rgba(15, 10, 30, 0.95)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '20px',
                      padding: '32px 28px',
                      width: '100%',
                      maxWidth: '540px',
                      maxHeight: '90vh',
                      overflowY: 'auto'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <h3 style={{
                      color: '#F1F0FF',
                      fontSize: '20px',
                      fontWeight: 700,
                      marginBottom: '24px',
                      fontFamily: 'Cairo'
                    }}>{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                    
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{
                          color: '#9B99B8',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '6px',
                          fontFamily: 'Cairo'
                        }}>اسم المنتج</label>
                        <input 
                          required 
                          value={form.name} 
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          style={{
                            width: '100%',
                            background: 'rgba(26, 26, 38, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            borderRadius: '12px',
                            color: '#F1F0FF',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontFamily: 'Cairo',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          color: '#9B99B8',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '6px',
                          fontFamily: 'Cairo'
                        }}>الوصف</label>
                        <textarea 
                          value={form.description} 
                          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                          style={{
                            width: '100%',
                            background: 'rgba(26, 26, 38, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            borderRadius: '12px',
                            color: '#F1F0FF',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontFamily: 'Cairo',
                            outline: 'none',
                            minHeight: '80px',
                            resize: 'none'
                          }}
                          rows={2} 
                        />
                      </div>
                      <div>
                        <label style={{
                          color: '#9B99B8',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '6px',
                          fontFamily: 'Cairo'
                        }}>السعر</label>
                        <input 
                          required 
                          type="number" 
                          step="0.01" 
                          value={form.new_price} 
                          onChange={e => setForm(p => ({ ...p, new_price: e.target.value }))}
                          style={{
                            width: '100%',
                            background: 'rgba(26, 26, 38, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            borderRadius: '12px',
                            color: '#F1F0FF',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontFamily: 'Cairo',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          color: '#9B99B8',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '6px',
                          fontFamily: 'Cairo'
                        }}>الفئة</label>
                        <input 
                          value={form.category} 
                          onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                          style={{
                            width: '100%',
                            background: 'rgba(26, 26, 38, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            borderRadius: '12px',
                            color: '#F1F0FF',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontFamily: 'Cairo',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          color: '#9B99B8',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '6px',
                          fontFamily: 'Cairo'
                        }}>صور المنتج (الحد الأقصى 5MB لكل صورة)</label>
                        
                        {imagePreviewUrls.length > 0 && (
                          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                <img 
                                  src={url} 
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(139,92,246,0.2)'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'rgba(239,68,68,0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white'
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            style={{
                              padding: '10px 20px',
                              background: 'rgba(139,92,246,0.15)',
                              border: '1px solid rgba(139,92,246,0.3)',
                              borderRadius: '10px',
                              color: '#A78BFA',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 600,
                              fontFamily: 'Cairo',
                              transition: 'all 0.2s'
                            }}
                          >
                            {imagePreviewUrls.length > 0 ? 'إضافة المزيد' : 'اختر الصور'}
                          </button>
                          {imagePreviewUrls.length > 0 && (
                            <button
                              type="button"
                              onClick={clearAllImages}
                              style={{
                                padding: '10px 20px',
                                background: 'rgba(239,68,68,0.15)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '10px',
                                color: '#FCA5A5',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                fontFamily: 'Cairo',
                                transition: 'all 0.2s'
                              }}
                            >
                              حذف الكل
                            </button>
                          )}
                        </div>
                        
                        <p style={{ marginTop: '8px', fontSize: '13px', color: '#9B99B8', fontFamily: 'Cairo' }}>
                          {imagePreviewUrls.length} صورة محددة
                        </p>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Cairo' }}>
                        <input 
                          type="checkbox" 
                          checked={form.is_sold} 
                          onChange={e => setForm(p => ({ ...p, is_sold: e.target.checked }))}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', color: '#F1F0FF' }}>تحديد كمنتج تم بيعه</span>
                      </label>
                      <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                        <button 
                          type="submit" 
                          disabled={saving}
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 700,
                            fontFamily: 'Cairo',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
                            transition: 'all 0.25s',
                            opacity: saving ? 0.5 : 1
                          }}
                        >
                          {saving ? '...' : 'حفظ'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowForm(false)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(26, 26, 38, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            borderRadius: '12px',
                            color: '#9B99B8',
                            fontSize: '15px',
                            fontWeight: 700,
                            fontFamily: 'Cairo',
                            cursor: 'pointer',
                            transition: 'all 0.25s'
                          }}
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products List */}
              {productsLoading ? (
                <p style={{ color: '#9B99B8', fontFamily: 'Cairo' }}>جاري التحميل...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.map(product => (
                    <div 
                      key={product.id} 
                      style={{
                        background: 'rgba(15, 10, 30, 0.55)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Product image */}
                      {(product.image_url || (product.image_urls && product.image_urls[0])) && (
                        <img 
                          src={product.image_urls?.[0] || product.image_url} 
                          alt={product.name} 
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '1px solid rgba(139,92,246,0.2)',
                            flexShrink: 0
                          }} 
                        />
                      )}
                      
                      {/* Name + price */}
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          color: '#F1F0FF', 
                          fontWeight: 600, 
                          fontSize: '15px', 
                          margin: '0 0 4px',
                          fontFamily: 'Cairo'
                        }}>
                          {product.name}
                        </p>
                        <span style={{
                          background: 'rgba(139,92,246,0.15)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          color: '#A78BFA',
                          borderRadius: '8px',
                          padding: '2px 10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          fontFamily: 'Cairo'
                        }}>
                          <span dir="ltr">{t('currency')}</span> {product.new_price.toFixed(0)}
                        </span>
                        {product.is_sold && (
                          <span style={{
                            marginLeft: '8px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#FCA5A5',
                            borderRadius: '8px',
                            padding: '2px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            fontFamily: 'Cairo'
                          }}>
                            تم البيع
                          </span>
                        )}
                      </div>

                      {/* Edit button */}
                      <button 
                        onClick={() => openEdit(product)}
                        style={{
                          background: 'rgba(139,92,246,0.15)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          borderRadius: '10px',
                          color: '#A78BFA',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete button */}
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '10px',
                          color: '#F87171',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              <h2 style={{
                color: '#F1F0FF',
                fontSize: '22px',
                fontWeight: 800,
                fontFamily: 'Cairo',
                margin: '0 0 24px',
                background: 'linear-gradient(135deg, #F1F0FF, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>إدارة الطلبات</h2>
              
              {ordersLoading || orders.length === 0 ? (
                <p style={{ color: '#9B99B8', fontFamily: 'Cairo' }}>لا توجد طلبات</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.map(order => (
                    <div 
                      key={order.id} 
                      style={{
                        background: 'rgba(15, 10, 30, 0.55)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        borderRadius: '16px',
                        padding: '20px 24px'
                      }}
                    >
                      {/* Top row — name + status badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <p style={{ 
                          color: '#F1F0FF', 
                          fontWeight: 700, 
                          fontSize: '16px', 
                          margin: 0,
                          fontFamily: 'Cairo'
                        }}>
                          {order.customer_name}
                        </p>

                        {/* Status badge */}
                        <span style={{
                          ...getStatusStyle(order.status),
                          borderRadius: '8px',
                          padding: '4px 12px',
                          fontSize: '13px',
                          fontWeight: 600,
                          fontFamily: 'Cairo'
                        }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      {/* Customer details */}
                      <p style={{ color: '#9B99B8', fontSize: '13px', margin: '0 0 4px', fontFamily: 'Cairo' }}>
                        {order.phone}
                      </p>
                      <p style={{ color: '#9B99B8', fontSize: '13px', margin: '0 0 4px', fontFamily: 'Cairo' }}>
                        {order.address}
                      </p>
                      <p style={{ color: '#9B99B8', fontSize: '13px', margin: '0 0 12px', fontFamily: 'Cairo' }}>
                        ولاية: {order.wilaya} — {getDeliveryTypeLabel(order.delivery_type)}
                      </p>

                      {/* Product + total */}
                      {Array.isArray(order.items) && order.items.length > 0 && (
                        <p style={{ 
                          color: '#C4B5FD', 
                          fontSize: '14px', 
                          margin: '0 0 4px',
                          fontFamily: 'Cairo'
                        }}>
                          {order.items.map((item: OrderItem, i: number) => (
                            <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                          ))}
                        </p>
                      )}
                      <p style={{
                        color: '#A78BFA', 
                        fontSize: '16px', 
                        fontWeight: 700, 
                        margin: '0 0 16px',
                        fontFamily: 'Cairo'
                      }}>
                        <span dir="ltr">{t('currency')}</span> {order.total_price.toFixed(0)}
                      </p>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        {(['pending', 'confirmed', 'cancelled'] as const).map(status => (
                          <button 
                            key={status} 
                            onClick={() => updateOrderStatus(order.id, status)}
                            style={{
                              background: order.status === status 
                                ? getStatusStyle(status).background 
                                : 'rgba(26, 26, 38, 0.6)',
                              border: order.status === status 
                                ? getStatusStyle(status).border 
                                : '1px solid rgba(139, 92, 246, 0.2)',
                              color: order.status === status 
                                ? getStatusStyle(status).color 
                                : '#9B99B8',
                              borderRadius: '10px',
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: 600,
                              fontFamily: 'Cairo',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {getStatusLabel(status)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
