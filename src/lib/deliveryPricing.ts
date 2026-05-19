export interface WilayaPricing {
  id: number;
  name: string;
  aDomicile: number;
  stopDesk: number | null;
}

export const wilayas: WilayaPricing[] = [
  { id: 1, name: "Adrar", aDomicile: 1400, stopDesk: 900 },
  { id: 2, name: "Chlef", aDomicile: 850, stopDesk: 450 },
  { id: 3, name: "Laghouat", aDomicile: 950, stopDesk: 550 },
  { id: 4, name: "Oum El Bouaghi", aDomicile: 850, stopDesk: 450 },
  { id: 5, name: "Batna", aDomicile: 900, stopDesk: 450 },
  { id: 6, name: "Bejaia", aDomicile: 800, stopDesk: 450 },
  { id: 7, name: "Biskra", aDomicile: 950, stopDesk: 550 },
  { id: 8, name: "Bechar", aDomicile: 1100, stopDesk: 650 },
  { id: 9, name: "Blida", aDomicile: 600, stopDesk: 400 },
  { id: 10, name: "Bouira", aDomicile: 700, stopDesk: 450 },
  { id: 11, name: "Tamanrasset", aDomicile: 1600, stopDesk: 1050 },
  { id: 12, name: "Tebessa", aDomicile: 900, stopDesk: 500 },
  { id: 13, name: "Tlemcen", aDomicile: 900, stopDesk: 500 },
  { id: 14, name: "Tiaret", aDomicile: 850, stopDesk: 450 },
  { id: 15, name: "Tizi Ouzou", aDomicile: 750, stopDesk: 450 },
  { id: 17, name: "Djelfa", aDomicile: 950, stopDesk: 500 },
  { id: 18, name: "Jijel", aDomicile: 900, stopDesk: 450 },
  { id: 19, name: "Setif", aDomicile: 800, stopDesk: 450 },
  { id: 20, name: "Saida", aDomicile: 900, stopDesk: 500 },
  { id: 21, name: "Skikda", aDomicile: 900, stopDesk: 450 },
  { id: 22, name: "Sidi Bel Abbes", aDomicile: 900, stopDesk: 450 },
  { id: 23, name: "Annaba", aDomicile: 850, stopDesk: 450 },
  { id: 24, name: "Guelma", aDomicile: 900, stopDesk: 450 },
  { id: 25, name: "Constantine", aDomicile: 800, stopDesk: 450 },
  { id: 26, name: "Medea", aDomicile: 800, stopDesk: 450 },
  { id: 27, name: "Mostaganem", aDomicile: 900, stopDesk: 450 },
  { id: 28, name: "MSila", aDomicile: 850, stopDesk: 500 },
  { id: 29, name: "Mascara", aDomicile: 900, stopDesk: 450 },
  { id: 30, name: "Ouargla", aDomicile: 950, stopDesk: 600 },
  { id: 31, name: "Oran", aDomicile: 800, stopDesk: 450 },
  { id: 32, name: "El Bayadh", aDomicile: 1100, stopDesk: 600 },
  { id: 34, name: "Bordj Bou Arreridj", aDomicile: 800, stopDesk: 450 },
  { id: 35, name: "Boumerdes", aDomicile: 700, stopDesk: 450 },
  { id: 36, name: "El Tarf", aDomicile: 850, stopDesk: 450 },
  { id: 38, name: "Tissemsilt", aDomicile: 900, stopDesk: 520 },
  { id: 39, name: "El Oued", aDomicile: 950, stopDesk: 600 },
  { id: 40, name: "Khenchela", aDomicile: 900, stopDesk: 450 },
  { id: 41, name: "Souk Ahras", aDomicile: 900, stopDesk: 450 },
  { id: 42, name: "Tipaza", aDomicile: 700, stopDesk: 450 },
  { id: 43, name: "Mila", aDomicile: 900, stopDesk: 450 },
  { id: 44, name: "Ain Defla", aDomicile: 900, stopDesk: 450 },
  { id: 45, name: "Naama", aDomicile: 1100, stopDesk: 600 },
  { id: 46, name: "Ain Temouchent", aDomicile: 900, stopDesk: 450 },
  { id: 47, name: "Ghardaia", aDomicile: 950, stopDesk: 550 },
  { id: 48, name: "Relizane", aDomicile: 900, stopDesk: 450 },
  { id: 49, name: "Timimoun", aDomicile: 1400, stopDesk: 900 },
  { id: 51, name: "Ouled Djellal", aDomicile: 950, stopDesk: 550 },
  { id: 52, name: "Beni Abbes", aDomicile: 1100, stopDesk: 900 },
  { id: 53, name: "In Salah", aDomicile: 1600, stopDesk: 1120 },
  { id: 54, name: "In Guezzam", aDomicile: 1600, stopDesk: null },
  { id: 55, name: "Touggourt", aDomicile: 950, stopDesk: 600 },
  { id: 57, name: "El Meghaier", aDomicile: 950, stopDesk: null },
  { id: 58, name: "El Menia", aDomicile: 1000, stopDesk: 670 },
];

export const getDeliveryPrice = (wilayaId: number, deliveryType: 'domicile' | 'stopdesk'): number | null => {
  const wilaya = wilayas.find(w => w.id === wilayaId);
  if (!wilaya) return null;
  
  if (deliveryType === 'domicile') {
    return wilaya.aDomicile;
  } else {
    return wilaya.stopDesk;
  }
};
