/**
 * ============================================================================
 * COMANCHERO RESTAURANTE - CONFIGURAÇÃO E INTEGRAÇÃO COM FIREBASE
 * ============================================================================
 * 
 * Este arquivo prepara a aplicação para sincronização em nuvem com:
 * 1. Firebase Authentication (Login de Administradores e Garçons)
 * 2. Firebase Firestore (Base de dados em tempo real)
 * 3. Firebase Storage (Upload de fotos de pratos, logo e capa)
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { DataStore } from './storage';
import { FirebaseConfigState, RestaurantSettings, Category, Product, Table } from '../types';

// Estrutura das coleções do Firestore para o Comanchero
export const FIREBASE_COLLECTIONS = {
  RESTAURANTS: 'restaurants',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  TABLES: 'tables',
  EMPLOYEES: 'employees',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  SETTINGS: 'settings',
  SOCIAL_LINKS: 'socialLinks',
};

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function getFirebaseApp(customConfig?: Partial<FirebaseConfigState>): FirebaseApp | null {
  const config = customConfig || DataStore.getFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const existing = getApps();
    if (existing.length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });
    }
  } catch (err) {
    console.warn('Falha ao inicializar Firebase:', err);
    return null;
  }

  return appInstance;
}

export function getFirestoreDB(customConfig?: Partial<FirebaseConfigState>): Firestore | null {
  const app = getFirebaseApp(customConfig);
  if (!app) return null;
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!authInstance) {
    authInstance = getAuth(app);
  }
  return authInstance;
}

/**
 * Utilitário para sincronizar dados locais para o Firestore
 */
export async function syncLocalDataToFirestore(): Promise<{ success: boolean; message: string }> {
  const db = getFirestoreDB();
  if (!db) {
    return {
      success: false,
      message: 'Firebase não está configurado. O sistema continuará a usar o modo local offline.',
    };
  }

  try {
    const settings = DataStore.getSettings();
    const categories = DataStore.getCategories();
    const products = DataStore.getProducts();
    const tables = DataStore.getTables();
    const orders = DataStore.getOrders();

    // Sincroniza configurações
    await setDoc(doc(db, FIREBASE_COLLECTIONS.SETTINGS, 'general'), settings);

    // Sincroniza categorias
    for (const cat of categories) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.CATEGORIES, cat.id), cat);
    }

    // Sincroniza produtos
    for (const prod of products) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.PRODUCTS, prod.id), prod);
    }

    // Sincroniza mesas
    for (const tab of tables) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.TABLES, tab.id), tab);
    }

    // Sincroniza pedidos
    for (const ord of orders) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.ORDERS, ord.id), ord);
    }

    return {
      success: true,
      message: 'Dados sincronizados com o Firebase Firestore com sucesso!',
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Erro ao enviar para Firebase: ${errMessage}`,
    };
  }
}

/**
 * Objeto unificado FirebaseService
 */
export const FirebaseService = {
  initialize(config: Partial<FirebaseConfigState>): boolean {
    if (!config.apiKey || !config.projectId) return false;
    try {
      const app = getFirebaseApp(config);
      return !!app;
    } catch {
      return false;
    }
  },

  isReady(): boolean {
    const config = DataStore.getFirebaseConfig();
    return !!(config.apiKey && config.projectId && getFirebaseApp());
  },

  async syncFromLocalToCloud(data: {
    products: Product[];
    categories: Category[];
    tables: Table[];
    settings: RestaurantSettings;
  }): Promise<void> {
    const db = getFirestoreDB();
    if (!db) {
      throw new Error('Firebase não inicializado ou sem credenciais válidas.');
    }

    // 1. Settings
    await setDoc(doc(db, FIREBASE_COLLECTIONS.SETTINGS, 'general'), data.settings);

    // 2. Categories
    for (const cat of data.categories) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.CATEGORIES, cat.id), cat);
    }

    // 3. Products
    for (const prod of data.products) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.PRODUCTS, prod.id), prod);
    }

    // 4. Tables
    for (const tbl of data.tables) {
      await setDoc(doc(db, FIREBASE_COLLECTIONS.TABLES, tbl.id), tbl);
    }
  },
};
