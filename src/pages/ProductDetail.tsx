import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { wilayas, getDeliveryPrice } from '@/lib/deliveryPricing';
import Navbar from '@/components/Navbar';
import CustomSelect from '@/components/CustomSelect';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const formRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFixedBtn, setShowFixedBtn] = useState(true);
  
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    adresse: '',
    type_livraison: '',
    wilaya_id: ''
  });

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!loading && !product) {
      navigate('/');
    }
  }, [loading, product, navigate]);

  // Get all images
  const getAllImages = (): string[] => {
    if (product?.image_urls && product.image_urls.length > 0) {
      return product.image_urls;
    }
    if (product?.image_url) {
      return [product.image_url];
    }
    return [];
  };

  const images = getAllImages();

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!formRef.current) return;
      const formTop = formRef.current.getBoundingClientRect().top;
      setShowFixedBtn(formTop > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p style={{ color: '#9B99B8' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const deliveryOptions = [
    { value: 'domicile', label: 'توصيل للمنزل (Domicile)' },
    { value: 'stopdesk', label: 'توصيل للمكتب (Stopdesk)' }
  ];

  const wilayaOptions = wilayas.map(wil => ({
    value: wil.id.toString(),
    label: wil.name
  }));

  const deliveryPrice = formData.wilaya_id && formData.type_livraison 
    ? getDeliveryPrice(parseInt(formData.wilaya_id), formData.type_livraison as 'domicile' | 'stopdesk')
    : null;

  const total = deliveryPrice !== null ? product.new_price + deliveryPrice : null;

  const stopDeskUnavailable = formData.type_livraison === 'stopdesk' && formData.wilaya_id && (() => {
    const wilaya = wilayas.find(w => w.id === parseInt(formData.wilaya_id));
    return wilaya?.stopDesk === null;
  })();

  const formatPrice = (price: number) => price.toFixed(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.telephone || !formData.adresse || !formData.type_livraison || !formData.wilaya_id) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    console.log('Order submitted:', {
      product,
      customer: formData,
      deliveryPrice,
      total
    });
    alert(t('order_success_msg'));
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '70px' }}>
        {/* Mobile Layout */}
        <div className="md:hidden" style={{ paddingBottom: '90px' }}>
          {/* Large product image with navigation arrows */}
          <div style={{ position: 'relative', width: '100%', height: '350px' }}>
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'rgba(26, 26, 38, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#9B99B8' }}>لا توجد صورة</span>
              </div>
            )}
            
            {images.length > 1 && (
              <>
                {/* Left arrow */}
                <button onClick={prevImage} style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.4)',
                  border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px',
                  color: 'white', fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>‹</button>
                {/* Right arrow */}
                <button onClick={nextImage} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.4)',
                  border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px',
                  color: 'white', fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>›</button>
                {/* Counter */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white', fontSize: '13px',
                  padding: '3px 12px', borderRadius: '20px',
                  fontFamily: 'Cairo'
                }}>
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </div>

          {/* Product name and price */}
          <div style={{ padding: '16px 16px 8px' }}>
            <p style={{
              color: '#9B99B8', fontSize: '13px',
              fontFamily: 'Cairo', marginBottom: '4px'
            }}>PRIME SPORT</p>
            <h1 style={{
              color: '#F1F0FF', fontSize: '22px',
              fontWeight: 700, fontFamily: 'Cairo',
              margin: '0 0 10px'
            }}>{product.name}</h1>
            <p style={{
              color: '#A78BFA', fontSize: '18px',
              fontWeight: 700, fontFamily: 'Cairo'
            }}>
              <span dir="ltr">{t('currency')}</span> {product.new_price.toFixed(0)}
            </p>
          </div>

          {/* Fixed bottom button - mobile only */}
          {showFixedBtn && (
            <div className="md:hidden" style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              padding: '12px 16px 20px',
              background: 'rgba(10, 10, 15, 0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(139, 92, 246, 0.25)'
            }}>
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '17px',
                  fontWeight: 700,
                  fontFamily: 'Cairo',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(139,92,246,0.6)'
                }}
              >
                🛒 اطلب الآن
              </button>
            </div>
          )}

          {/* Form section below */}
          <div ref={formRef} style={{ padding: '24px 16px 100px' }}>
            <h2 style={{
              color: '#F1F0FF', fontSize: '20px',
              fontWeight: 700, fontFamily: 'Cairo',
              marginBottom: '20px'
            }}>بيانات التوصيل</h2>

            <form onSubmit={handleSubmit} style={{
              background: 'rgba(15, 10, 30, 0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              padding: '24px 20px'
            }}>
                <h3 style={{ color: '#F1F0FF', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                  {t('delivery_details')}
                </h3>

                {/* Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    style={{
                      background: 'rgba(26, 26, 38, 0.6)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '12px',
                      color: '#F1F0FF',
                      padding: '14px 16px',
                      width: '100%',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '15px'
                    }}
                    placeholder={t('full_name')}
                    required
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('phone')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      style={{
                        background: 'rgba(26, 26, 38, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        borderRadius: '12px',
                        color: '#F1F0FF',
                        padding: '14px 16px 14px 48px',
                        width: '100%',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '15px'
                      }}
                      placeholder="0XX XXX XX XX XX"
                      required
                    />
                    <Phone size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9B99B8' }} />
                  </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('address')}
                  </label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    style={{
                      background: 'rgba(26, 26, 38, 0.6)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '12px',
                      color: '#F1F0FF',
                      padding: '14px 16px',
                      width: '100%',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '15px',
                      minHeight: '100px',
                      resize: 'none'
                    }}
                    rows={3}
                    placeholder="أدخل عنوانك الكامل"
                    required
                  />
                </div>

                {/* Delivery Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('delivery_type')}
                  </label>
                  <CustomSelect
                    options={deliveryOptions}
                    value={formData.type_livraison}
                    onChange={(value) => setFormData({...formData, type_livraison: value})}
                    placeholder={t('select_wilaya')}
                  />
                </div>

                {/* Wilaya */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    الولاية
                  </label>
                  <CustomSelect
                    options={wilayaOptions.filter(w => {
                      if (formData.type_livraison === 'stopdesk') {
                        const wilaya = wilayas.find(wil => wil.id === parseInt(w.value));
                        return wilaya?.stopDesk !== null;
                      }
                      return true;
                    })}
                    value={formData.wilaya_id}
                    onChange={(value) => setFormData({...formData, wilaya_id: value})}
                    placeholder={t('select_wilaya')}
                    searchable
                  />
                </div>

                {/* Price Summary */}
                {stopDeskUnavailable ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <p style={{ color: '#F87171', fontWeight: '500', textAlign: 'center' }}>
                      التوصيل للمكتب غير متاح لهذه الولاية
                    </p>
                  </motion.div>
                ) : !formData.wilaya_id || !formData.type_livraison ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: 'rgba(139, 92, 246, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <p style={{ color: '#9B99B8', fontSize: '14px' }}>
                      اختر الولاية ونوع التوصيل لرؤية السعر الإجمالي
                    </p>
                  </motion.div>
                ) : deliveryPrice !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(88, 28, 135, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '14px',
                      padding: '20px 24px',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9B99B8', fontSize: '14px', marginBottom: '12px' }}>
                      <span>سعر المنتج:</span>
                      <span>{formatPrice(product.new_price)} د.ج</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9B99B8', fontSize: '14px', marginBottom: '12px' }}>
                      <span>تكلفة التوصيل:</span>
                      <span>{formatPrice(deliveryPrice)} د.ج</span>
                    </div>
                    <div style={{
                      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#F1F0FF',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      <span>الإجمالي:</span>
                      <span>{formatPrice(total!)} د.ج</span>
                    </div>
                  </motion.div>
                ) : null}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'Cairo',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  تأكيد الطلب
                </motion.button>
              </form>
            </div>
          </div>

        {/* Desktop Layout */}
        <div className="hidden md:block container mx-auto px-6" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
          {/* Back button */}
          <Link 
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#9B99B8', marginBottom: '32px' }}
          >
            <ArrowRight size={20} />
            <span>{t('back_to_products')}</span>
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px', background: 'transparent' }}>
            {/* Product Image */}
            <div style={{
              background: 'transparent',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              {product.image_urls && product.image_urls.length > 0 ? (
                <img 
                  src={product.image_urls[0]} 
                  alt={product.name}
                  className="w-full rounded-2xl"
                />
              ) : product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full rounded-2xl"
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: 'rgba(26, 26, 38, 0.3)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#9B99B8' }}>لا توجد صورة</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h1 style={{ color: '#F1F0FF', fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {product.name}
                </h1>
                <p style={{ color: '#A78BFA', fontSize: '24px', fontWeight: 'bold' }}>
                  <span dir="ltr">{t('currency')}</span> {product.new_price.toFixed(0)}
                </p>
              </div>

              {product.description && (
                <p style={{ color: '#D1D5DB', lineHeight: '1.6' }}>
                  {product.description}
                </p>
              )}

              <form onSubmit={handleSubmit} style={{
                background: 'rgba(15, 10, 30, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '20px',
                padding: '32px'
              }}>
                <h3 style={{ color: '#F1F0FF', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                  {t('delivery_details')}
                </h3>

                {/* Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    style={{
                      background: 'rgba(26, 26, 38, 0.6)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '12px',
                      color: '#F1F0FF',
                      padding: '14px 16px',
                      width: '100%',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '15px'
                    }}
                    placeholder={t('full_name')}
                    required
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('phone')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      style={{
                        background: 'rgba(26, 26, 38, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        borderRadius: '12px',
                        color: '#F1F0FF',
                        padding: '14px 16px 14px 48px',
                        width: '100%',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '15px'
                      }}
                      placeholder="0XX XXX XX XX XX"
                      required
                    />
                    <Phone size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9B99B8' }} />
                  </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('address')}
                  </label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    style={{
                      background: 'rgba(26, 26, 38, 0.6)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '12px',
                      color: '#F1F0FF',
                      padding: '14px 16px',
                      width: '100%',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '15px',
                      minHeight: '100px',
                      resize: 'none'
                    }}
                    rows={3}
                    placeholder="أدخل عنوانك الكامل"
                    required
                  />
                </div>

                {/* Delivery Type */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    {t('delivery_type')}
                  </label>
                  <CustomSelect
                    options={deliveryOptions}
                    value={formData.type_livraison}
                    onChange={(value) => setFormData({...formData, type_livraison: value})}
                    placeholder={t('select_wilaya')}
                  />
                </div>

                {/* Wilaya */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#9B99B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    الولاية
                  </label>
                  <CustomSelect
                    options={wilayaOptions.filter(w => {
                      if (formData.type_livraison === 'stopdesk') {
                        const wilaya = wilayas.find(wil => wil.id === parseInt(w.value));
                        return wilaya?.stopDesk !== null;
                      }
                      return true;
                    })}
                    value={formData.wilaya_id}
                    onChange={(value) => setFormData({...formData, wilaya_id: value})}
                    placeholder={t('select_wilaya')}
                    searchable
                  />
                </div>

                {/* Price Summary */}
                {stopDeskUnavailable ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px'
                    }}
                  >
                    <p style={{ color: '#F87171', fontWeight: '500', textAlign: 'center' }}>
                      التوصيل للمكتب غير متاح لهذه الولاية
                    </p>
                  </motion.div>
                ) : !formData.wilaya_id || !formData.type_livraison ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: 'rgba(139, 92, 246, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      marginBottom: '20px'
                    }}
                  >
                    <p style={{ color: '#9B99B8', fontSize: '14px' }}>
                      اختر الولاية ونوع التوصيل لرؤية السعر الإجمالي
                    </p>
                  </motion.div>
                ) : deliveryPrice !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(88, 28, 135, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '14px',
                      padding: '20px 24px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9B99B8', fontSize: '14px', marginBottom: '12px' }}>
                      <span>سعر المنتج:</span>
                      <span>{formatPrice(product.new_price)} د.ج</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9B99B8', fontSize: '14px', marginBottom: '12px' }}>
                      <span>تكلفة التوصيل:</span>
                      <span>{formatPrice(deliveryPrice)} د.ج</span>
                    </div>
                    <div style={{
                      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#F1F0FF',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      <span>الإجمالي:</span>
                      <span>{formatPrice(total!)} د.ج</span>
                    </div>
                  </motion.div>
                ) : null}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'Cairo',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  تأكيد الطلب
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
