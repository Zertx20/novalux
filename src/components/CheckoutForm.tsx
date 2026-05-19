import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, Phone } from 'lucide-react';

const CheckoutForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    adresse: '',
    type_livraison: '',
    wilaya: ''
  });

  const algerianWilayas = [
    'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة',
    'بشار', 'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت',
    'تيزي وزو', 'الجزائر', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس',
    'عنابة', 'قالمة', 'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة',
    'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارق', 'تندوف',
    'تيسمسيلت', 'الوادي', 'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة',
    'عين تموشنت', 'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال',
    'بني عباس', 'عين صالح', 'عن قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('بيانات النموذج:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple/5 to-background p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl border-0 border-purple/10 p-8 md:p-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
              {t('place_order')}
            </h2>
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple/500 focus:border-purple/500 transition-all duration-200 bg-white"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone')}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple/500 focus:border-purple/500 transition-all duration-200 bg-white"
                    placeholder="0XX XXX XX XX XX"
                  />
                  <Phone size={20} className="absolute right-4 top-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address')}
                </label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple/500 focus:border-purple/500 transition-all duration-200 bg-white resize-none"
                  rows={3}
                  placeholder="أدخل عنوانك الكامل"
                />
              </div>
            </div>

            {/* Right Column - Delivery Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('delivery_type')}
                </label>
                <div className="relative">
                  <select
                    value={formData.type_livraison}
                    onChange={(e) => setFormData({...formData, type_livraison: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple/500 focus:border-purple/500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">اختر...</option>
                    <option value="bureau">🏢 {t('office_delivery')}</option>
                    <option value="domicile">🏠 {t('home_delivery')}</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الولاية
                </label>
                <div className="relative">
                  <select
                    value={formData.wilaya}
                    onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple/500 focus:border-purple/500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">اختر...</option>
                    {algerianWilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-purple-800"
            >
              {t('place_order')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutForm;
