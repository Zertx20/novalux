import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CartSlideOver: React.FC = () => {
  const { t } = useTranslation();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', delivery_type: 'home', wilaya: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    const orderItems = items.map(i => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.new_price,
      quantity: i.quantity,
    }));

    const { error } = await supabase.from('orders').insert({
      ...form,
      items: orderItems as any,
      total_price: total,
      status: 'pending',
    });

    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('order_success'));
      clearCart();
      setShowCheckout(false);
      setIsOpen(false);
      setForm({ customer_name: '', phone: '', address: '', delivery_type: 'home' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 end-0 z-50 h-full w-full max-w-lg bg-black backdrop-blur-lg border-2 border-purple-500/50 luxury-shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-2xl font-heading font-bold purple-text">{t('your_cart')}</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-4 rounded-full hover:bg-card/50 transition-all duration-300 text-muted-foreground hover:text-foreground hover-luxury luxury-glow"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full purple-gradient/20 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-muted-foreground" />
                  </div>
                  <p className="text-lg text-muted-foreground font-light">{t('empty_cart')}</p>
                </div>
              ) : !showCheckout ? (
                <div className="space-y-6">
                  {items.map(item => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover-luxury"
                    >
                      {item.product.image_url && (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name} 
                          className="w-20 h-20 rounded-xl object-cover luxury-shadow" 
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-white mb-1">{item.product.name}</h4>
                        <p className="purple-text font-bold text-lg mb-3">
                          {item.product.new_price.toFixed(0)} {t('currency')}
                        </p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                            className="p-2 bg-black rounded-xl hover:bg-gray-800 transition-all duration-300 hover-luxury border border-purple-500/30"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-base font-medium w-8 text-center text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                            className="p-2 bg-black rounded-xl hover:bg-gray-800 transition-all duration-300 hover-luxury border border-purple-500/30"
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            onClick={() => removeItem(item.product.id)} 
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 hover-luxury ms-auto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('name')}</label>
                    <input 
                      required 
                      value={form.customer_name} 
                      onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('phone')}</label>
                    <input 
                      required 
                      value={form.phone} 
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('address')}</label>
                    <textarea 
                      required 
                      value={form.address} 
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                      rows={3} 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Wilaya</label>
                    <div className="relative">
                      <select 
                        value={form.wilaya || ''} 
                        onChange={e => setForm(p => ({ ...p, wilaya: e.target.value }))}
                        className="w-full px-4 py-3 bg-black border-2 border-purple/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple/50 transition-all duration-300 appearance-none cursor-pointer hover:border-purple/50 hover:shadow-lg"
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="Adrar">Adrar</option>
                        <option value="Chlef">Chlef</option>
                        <option value="Laghouat">Laghouat</option>
                        <option value="Oum El Bouaghi">Oum El Bouaghi</option>
                        <option value="Batna">Batna</option>
                        <option value="Béjaïa">Béjaïa</option>
                        <option value="Biskra">Biskra</option>
                        <option value="Béchar">Béchar</option>
                        <option value="Blida">Blida</option>
                        <option value="Bouira">Bouira</option>
                        <option value="Tamanrasset">Tamanrasset</option>
                        <option value="Tébessa">Tébessa</option>
                        <option value="Tlemcen">Tlemcen</option>
                        <option value="Tiaret">Tiaret</option>
                        <option value="Tizi Ouzou">Tizi Ouzou</option>
                        <option value="Alger">Alger</option>
                        <option value="Djelfa">Djelfa</option>
                        <option value="Jijel">Jijel</option>
                        <option value="Sétif">Sétif</option>
                        <option value="Saïda">Saïda</option>
                        <option value="Skikda">Skikda</option>
                        <option value="Sidi Bel Abbès">Sidi Bel Abbès</option>
                        <option value="Annaba">Annaba</option>
                        <option value="Guelma">Guelma</option>
                        <option value="Constantine">Constantine</option>
                        <option value="Médéa">Médéa</option>
                        <option value="Mostaganem">Mostaganem</option>
                        <option value="M'Sila">M'Sila</option>
                        <option value="Mascara">Mascara</option>
                        <option value="Ouargla">Ouargla</option>
                        <option value="Oran">Oran</option>
                        <option value="El Bayadh">El Bayadh</option>
                        <option value="Illizi">Illizi</option>
                        <option value="Bordj Bou Arréridj">Bordj Bou Arréridj</option>
                        <option value="Boumerdès">Boumerdès</option>
                        <option value="El Tarf">El Tarf</option>
                        <option value="Tindouf">Tindouf</option>
                        <option value="Tissemsilt">Tissemsilt</option>
                        <option value="El Oued">El Oued</option>
                        <option value="Khenchela">Khenchela</option>
                        <option value="Souk Ahras">Souk Ahras</option>
                        <option value="Tipaza">Tipaza</option>
                        <option value="Mila">Mila</option>
                        <option value="Aïn Defla">Aïn Defla</option>
                        <option value="Naâma">Naâma</option>
                        <option value="Aïn Témouchent">Aïn Témouchent</option>
                        <option value="Ghardaïa">Ghardaïa</option>
                        <option value="Relizane">Relizane</option>
                        <option value="Timimoun">Timimoun</option>
                        <option value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</option>
                        <option value="Ouled Djellal">Ouled Djellal</option>
                        <option value="Béni Abbès">Béni Abbès</option>
                        <option value="In Salah">In Salah</option>
                        <option value="In Guezzam">In Guezzam</option>
                        <option value="Touggourt">Touggourt</option>
                        <option value="Djanet">Djanet</option>
                        <option value="El M'Ghair">El M'Ghair</option>
                        <option value="El Meniaa">El Meniaa</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <span className="text-purple-500">▼</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('delivery_type')}</label>
                    <div className="relative">
                      <select 
                        value={form.delivery_type} 
                        onChange={e => setForm(p => ({ ...p, delivery_type: e.target.value }))}
                        className="w-full px-4 py-3 bg-black border-2 border-purple/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple/50 transition-all duration-300 appearance-none cursor-pointer hover:border-purple/50 hover:shadow-lg"
                      >
                        <option value="home" className="text-purple-700">🏠 {t('home_delivery')}</option>
                        <option value="office" className="text-purple-700">🏢 {t('office_delivery')}</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <span className="text-purple-500">▼</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full purple-gradient py-4 rounded-xl text-background font-semibold hover-luxury luxury-shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {submitting ? '...' : t('place_order')}
                  </button>
                </form>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-purple-500/30 bg-black/50 backdrop-blur-sm">
                <div className="flex justify-between mb-6">
                  <span className="font-heading font-bold text-xl text-white" style={{ fontFamily: 'Arial, sans-serif' }}>{t('total')}</span>
                  <span className="font-bold text-2xl purple-text">{total.toFixed(0)} {t('currency')}</span>
                </div>
                {!showCheckout ? (
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full purple-gradient py-4 rounded-xl text-background font-semibold hover-luxury luxury-shadow-lg hover:scale-[1.02] transition-all duration-300 text-lg"
                  >
                    {t('checkout')}
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-black py-4 rounded-xl text-white font-medium hover:bg-gray-800 transition-all duration-300 border border-purple-500/30 text-lg"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSlideOver;
