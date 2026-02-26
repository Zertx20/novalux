import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useLanguage } from '@/hooks/useLanguage';
import type { Product, Order } from '@/types';
import { toast } from 'sonner';
import { LogOut, Plus, Pencil, Trash2, Package, ShoppingBag, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

const emptyProduct = { name: '', description: '', old_price: '', new_price: '', category: '', is_sold: false };

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
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
      old_price: product.old_price?.toString() || '',
      new_price: product.new_price.toString(),
      category: product.category || '',
      is_sold: product.is_sold,
    });
    // Set existing images for editing
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
    
    // Create preview URLs for new files
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
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

    // Upload new images if any
    let newImageUrls: string[] = [];
    if (imageFiles.length > 0) {
      newImageUrls = await uploadImages(imageFiles);
      if (newImageUrls.length === 0 && imageFiles.length > 0) {
        setSaving(false);
        return;
      }
    }

    // Combine existing preview URLs (which might be existing images) with new uploads
    const allImageUrls = [...imagePreviewUrls, ...newImageUrls];

    const payload = {
      name: form.name,
      description: form.description || null,
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      new_price: parseFloat(form.new_price),
      category: form.category || null,
      is_sold: form.is_sold,
      image_url: allImageUrls.length > 0 ? allImageUrls[0] : null, // Keep for backward compatibility
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

  const statusColors: Record<string, string> = {
    pending: 'bg-gold/20 text-gold-dark',
    confirmed: 'bg-green-500/20 text-green-700 dark:text-green-400',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full gold-gradient flex items-center justify-center">
              <span className="text-xs font-bold text-background font-heading">NL</span>
            </div>
            <h1 className="font-heading font-bold text-lg gold-text">{t('admin')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag size={16} /> {t('go_to_website')}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={16} /> {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'products' ? 'gold-gradient text-background' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
            <Package size={16} /> {t('product_management')}
          </button>
          <button onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'orders' ? 'gold-gradient text-background' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
            <ShoppingBag size={16} /> {t('order_management')}
          </button>
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-2xl font-bold">{t('products')}</h2>
              <button onClick={openNew} className="flex items-center gap-2 gold-gradient px-4 py-2 rounded-lg text-background text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus size={16} /> {t('add_product')}
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
                <div className="bg-background border border-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <h3 className="font-heading font-bold text-lg mb-4">{editing ? t('edit') : t('add_product')}</h3>
                  <form onSubmit={handleSave} className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">{t('product_name')}</label>
                      <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t('description')}</label>
                      <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground">{t('old_price')}</label>
                        <input type="number" step="0.01" value={form.old_price} onChange={e => setForm(p => ({ ...p, old_price: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">{t('new_price')}</label>
                        <input required type="number" step="0.01" value={form.new_price} onChange={e => setForm(p => ({ ...p, new_price: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t('category')}</label>
                      <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t('upload_images')} (Max 5MB per image)</label>
                      
                      {/* Image Preview Grid */}
                      {imagePreviewUrls.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={url} 
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded border border-border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <div className="mt-2">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                          {imagePreviewUrls.length > 0 ? 'Add More Images' : 'Select Images'}
                        </button>
                        {imagePreviewUrls.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllImages}
                            className="ml-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      <p className="mt-1 text-xs text-muted-foreground">
                        {imagePreviewUrls.length} image(s) selected
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_sold} onChange={e => setForm(p => ({ ...p, is_sold: e.target.checked }))}
                        className="rounded border-border" />
                      <span className="text-sm">{t('mark_sold')}</span>
                    </label>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={saving} className="flex-1 gold-gradient py-2 rounded-lg text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                        {saving ? '...' : t('save')}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-secondary py-2 rounded-lg text-secondary-foreground font-medium hover:bg-muted transition-colors">
                        {t('cancel')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            {productsLoading ? (
              <p className="text-muted-foreground">{t('no_products')}</p>
            ) : (
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <p className="text-sm text-primary font-bold">{product.new_price.toFixed(0)} {t('currency')}</p>
                      {product.is_sold && <span className="text-xs text-destructive">{t('sold_out')}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(product)} className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">{t('order_management')}</h2>
            {ordersLoading || orders.length === 0 ? (
              <p className="text-muted-foreground">{t('no_orders')}</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{order.customer_name}</h4>
                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                        <p className="text-sm text-muted-foreground">{order.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">{order.delivery_type === 'home' ? t('home_delivery') : t('office_delivery')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                          {t(order.status as any)}
                        </span>
                        <button onClick={() => deleteOrder(order.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">
                      {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                        <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{order.total_price.toFixed(0)} {t('currency')}</span>
                      <div className="flex gap-1">
                        {(['pending', 'confirmed', 'cancelled'] as const).map(status => (
                          <button key={status} onClick={() => updateOrderStatus(order.id, status)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${order.status === status ? 'gold-gradient text-background' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                            {t(status)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
