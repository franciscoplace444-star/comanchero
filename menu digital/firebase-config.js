/**
 * COMANCHERO RESTAURANTE - FIREBASE CONFIG TEMPLATE
 * Arquivo de configuração de referência para Firebase.
 * 
 * Cole as suas chaves aqui ou configure na aba 'Firebase' do Painel de Administração.
 */

export const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "comanchero-restaurant.firebaseapp.com",
  projectId: "comanchero-restaurant",
  storageBucket: "comanchero-restaurant.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};

export const FIRESTORE_COLLECTIONS = {
  RESTAURANTS: 'restaurants',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  TABLES: 'tables',
  EMPLOYEES: 'employees',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  SETTINGS: 'settings',
  SOCIAL_LINKS: 'socialLinks'
};
