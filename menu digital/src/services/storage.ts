import {
  Category,
  Product,
  Table,
  Employee,
  Customer,
  Order,
  RestaurantSettings,
  FirebaseConfigState,
  UserRole,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'comanchero_settings',
  CATEGORIES: 'comanchero_categories',
  PRODUCTS: 'comanchero_products',
  TABLES: 'comanchero_tables',
  EMPLOYEES: 'comanchero_employees',
  CUSTOMERS: 'comanchero_customers',
  ORDERS: 'comanchero_orders',
  FIREBASE_CONFIG: 'comanchero_firebase_config',
  AUTH_USER: 'comanchero_auth_user',
};

// Initial Restaurant Settings (Maputo, Mozambique)
export const INITIAL_SETTINGS: RestaurantSettings = {
  name: 'COMANCHERO',
  website: 'https://www.comancherooo.com',
  address: 'Maputo Shopping Center, Piso 2, Maputo, Moçambique',
  phone: '+258 84 300 1234',
  whatsappCasa: '+258843001234',
  whatsappCasaActive: true,
  whatsappLoja: '+258873005678',
  whatsappLojaActive: true,
  instagram: 'https://instagram.com/comanchero_maputo',
  facebook: 'https://facebook.com/comanchero_maputo',
  tiktok: '',
  googleMapsUrl: 'https://maps.google.com/?q=Maputo+Shopping+Center+Mozambique',
  openingHours: 'Segunda a Domingo: 11:30 - 23:00',
  currency: 'MT',
  logo: '/icon.svg',
  coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
  tagline: 'O Sabor Nobre da Grelha e Tradição',
  aboutText: 'Inspirado na autêntica cozinha de grelhados e no ambiente western sofisticado. Carnes nobres preparadas na brasa, massas artesanais, mariscos selecionados e mocktails artesanais exclusivos no coração de Maputo.',
  deliveryFee: 150,
  minOrderValue: 300,
};

// Default Categories as requested
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-entradas',
    name: 'Entradas',
    description: 'Petiscos e delícias para abrir o apetite',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80',
    order: 1,
    active: true,
  },
  {
    id: 'cat-saladas',
    name: 'Saladas & Fattoush',
    description: 'Saladas frescas mediterrâneas e campestres',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    order: 2,
    active: true,
  },
  {
    id: 'cat-grelhados',
    name: 'Grelhados & Carnes',
    description: 'Cortes nobres e carnes maturadas na brasa',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    order: 3,
    active: true,
  },
  {
    id: 'cat-frango',
    name: 'Frango & Kebabs',
    description: 'Especialidades marinadas com ervas e especiarias',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    order: 4,
    active: true,
  },
  {
    id: 'cat-mariscos',
    name: 'Peixe & Camarão',
    description: 'Frutos do mar frescos da costa de Maputo',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    order: 5,
    active: true,
  },
  {
    id: 'cat-massas',
    name: 'Massas & Lasanhas',
    description: 'Receitas caseiras com molhos aveludados',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    order: 6,
    active: true,
  },
  {
    id: 'cat-hamburgueres',
    name: 'Hambúrgueres Artesanais',
    description: 'Hambúrgueres rústicos com pão brioche e batatas rústicas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    order: 7,
    active: true,
  },
  {
    id: 'cat-sobremesas',
    name: 'Sobremesas',
    description: 'Doces artesanais e finalizações inesquecíveis',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    order: 8,
    active: true,
  },
  {
    id: 'cat-bebidas',
    name: 'Mocktails & Sumos Naturais',
    description: 'Bebidas 100% sem álcool, sumos prensados e refrescos',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    order: 9,
    active: true,
  },
];

// Initial Demo Products (clearly flagged as DEMO as per instructions)
// Strictly NO ALCOHOL: steaks, chicken, shrimp, burger, salads, fresh mocktails
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    code: '#CAR-01',
    name: '[DEMO] T-Bone Steak Comanchero Prime',
    description: 'Corte nobre de 500g grelhado no carvão vegetal com manteiga de ervas, flor de sal e acompanhado de batatas rústicas com alecrim.',
    price: 950,
    promoPrice: 850,
    categoryId: 'cat-grelhados',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    order: 1,
    isDemo: true,
    extras: [
      { id: 'ext-1', name: 'Molho Barbecue Fumado da Casa', price: 60 },
      { id: 'ext-2', name: 'Manteiga de Alho & Chimichurri', price: 50 },
      { id: 'ext-3', name: 'Porção Extra Batata Rústica', price: 120 },
    ],
  },
  {
    id: 'prod-02',
    code: '#CAR-02',
    name: '[DEMO] Picanha na Chapa com Mandioca',
    description: 'Fatias suculentas de picanha maturada servidas na chapa de ferro quente com mandioca crocante e vinagrete fresco.',
    price: 890,
    categoryId: 'cat-grelhados',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    order: 2,
    isDemo: true,
    extras: [
      { id: 'ext-4', name: 'Farofa com Bacon e Ovos', price: 90 },
      { id: 'ext-5', name: 'Arroz de Alho Poró', price: 80 },
    ],
  },
  {
    id: 'prod-03',
    code: '#FRG-01',
    name: '[DEMO] Kebab de Frango Grelhado com Especiarias',
    description: 'Espetos artesanais de peito de frango marinados em iogurte e especiarias suaves, servidos com pão pita e molho tahine.',
    price: 520,
    categoryId: 'cat-frango',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    order: 3,
    isDemo: true,
    extras: [
      { id: 'ext-6', name: 'Pão Pita Extra (2 un)', price: 50 },
      { id: 'ext-7', name: 'Molho de Alho Libanês Toum', price: 45 },
    ],
  },
  {
    id: 'prod-04',
    code: '#MAR-01',
    name: '[DEMO] Camarão Grelhado à Moda de Maputo',
    description: 'Camarões tigre grelhados na casca com manteiga de alho, toque suave de piripíri moçambicano e limão fresco.',
    price: 1100,
    promoPrice: 980,
    categoryId: 'cat-mariscos',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    order: 4,
    isDemo: true,
    extras: [
      { id: 'ext-8', name: 'Arroz de Marisco Aromático', price: 150 },
      { id: 'ext-9', name: 'Molho de Limão & Ervas', price: 40 },
    ],
  },
  {
    id: 'prod-05',
    code: '#HMB-01',
    name: '[DEMO] Hambúrguer Western Ranger',
    description: 'Blend de carne 200g grelhado no fogo, queijo cheddar fundido, cebola caramelizada, tiras crocantes e maionese defumada no pão brioche artesanal.',
    price: 480,
    categoryId: 'cat-hamburgueres',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    order: 5,
    isDemo: true,
    extras: [
      { id: 'ext-10', name: 'Ovo Estalado com Gema Mole', price: 40 },
      { id: 'ext-11', name: 'Queijo Cheddar Duplo', price: 60 },
    ],
  },
  {
    id: 'prod-06',
    code: '#SLD-01',
    name: '[DEMO] Salada Fattoush Crocante & Tabule',
    description: 'Mix de folhas frescas, pepino, tomate cereja, hortelã, rabanete e pedaços dourados de pão pita tostado com molho de sumac e azeite extra virgem.',
    price: 360,
    categoryId: 'cat-saladas',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    order: 6,
    isDemo: true,
  },
  {
    id: 'prod-07',
    code: '#BEB-01',
    name: '[DEMO] Mocktail Tropical Sunset (Sem Álcool)',
    description: 'Refrescante fusão artesanal de maracujá moçambicano, sumo fresco de manga, xarope de romã e água com gás mineral.',
    price: 240,
    categoryId: 'cat-bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    order: 7,
    isDemo: true,
  },
  {
    id: 'prod-08',
    code: '#BEB-02',
    name: '[DEMO] Limonada Rústica Suíça com Hortelã',
    description: 'Limões tahiti frescos batidos com hortelã fresca do campo, leite condensado e gelo triturado.',
    price: 180,
    categoryId: 'cat-bebidas',
    image: 'https://images.unsplash.com/photo-1523371067-1cfc6fe3ae68?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    order: 8,
    isDemo: true,
  },
  {
    id: 'prod-09',
    code: '#SOB-01',
    name: '[DEMO] Petit Gâteau de Chocolate & Sorvete de Baunilha',
    description: 'Bolo quente de chocolate meio amargo com recheio cremoso e bola de sorvete de baunilha artesanal com calda de frutas vermelhas.',
    price: 320,
    categoryId: 'cat-sobremesas',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    order: 9,
    isDemo: true,
  },
];

// Initial Restaurant Tables (Mesas 01 a 08)
export const INITIAL_TABLES: Table[] = [
  { id: 'tab-01', number: 'Mesa 01', status: 'LIVRE', capacity: 2, active: true },
  { id: 'tab-02', number: 'Mesa 02', status: 'OCUPADA', capacity: 4, active: true, currentCustomerName: 'Carlos M.' },
  { id: 'tab-03', number: 'Mesa 03', status: 'EM_PREPARACAO', capacity: 4, active: true, currentCustomerName: 'Dra. Luísa' },
  { id: 'tab-04', number: 'Mesa 04', status: 'PRONTO', capacity: 6, active: true, currentCustomerName: 'Família Santos' },
  { id: 'tab-05', number: 'Mesa 05', status: 'LIVRE', capacity: 4, active: true },
  { id: 'tab-06', number: 'Mesa 06', status: 'LIVRE', capacity: 8, active: true },
  { id: 'tab-07', number: 'Mesa 07', status: 'LIVRE', capacity: 2, active: true },
  { id: 'tab-08', number: 'Mesa 08 (VIP)', status: 'FINALIZADA', capacity: 6, active: true },
];

// Initial Staff Accounts (Roles: ADMIN, MANAGER, WAITER)
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-admin',
    name: 'Administrador Chefe',
    phone: '+258 84 000 0001',
    code: 'ADM-01',
    username: 'admin',
    passwordHash: 'admin123',
    role: 'ADMIN',
    active: true,
  },
  {
    id: 'emp-manager',
    name: 'Gerente de Turno',
    phone: '+258 84 000 0002',
    code: 'GER-01',
    username: 'gerente',
    passwordHash: 'gerente123',
    role: 'MANAGER',
    active: true,
  },
  {
    id: 'emp-waiter-1',
    name: 'Manuel Nhantumbo (Servente)',
    phone: '+258 84 000 0003',
    code: 'SRV-01',
    username: 'garcom1',
    passwordHash: '1234',
    role: 'WAITER',
    active: true,
  },
  {
    id: 'emp-waiter-2',
    name: 'Amina Cassamo (Servente)',
    phone: '+258 84 000 0004',
    code: 'SRV-02',
    username: 'garcom2',
    passwordHash: '1234',
    role: 'WAITER',
    active: true,
  },
];

// Initial Demo Customers for CRM
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Artur Macuácua',
    phone: '+258841122334',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastOrderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    orderCount: 5,
    totalSpent: 4750,
    notes: 'Prefere bife bem passado, cliente habitual aos fins de semana.',
  },
  {
    id: 'cust-2',
    name: 'Zélia Mondlane',
    phone: '+258829988776',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastOrderDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    orderCount: 2,
    totalSpent: 2180,
    notes: 'Adora os mocktails e a salada fattoush.',
  },
];

// Initial Demo Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: '#COM-000101',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customerName: 'Carlos M.',
    customerPhone: '+258849991122',
    type: 'MESA',
    tableNumber: 'Mesa 02',
    peopleCount: 4,
    status: 'RECEBIDO',
    subtotal: 1840,
    total: 1840,
    targetWhatsApp: 'casa',
    waiterName: 'Manuel Nhantumbo',
    items: [
      {
        productId: 'prod-01',
        productName: '[DEMO] T-Bone Steak Comanchero Prime',
        productCode: '#CAR-01',
        quantity: 1,
        unitPrice: 850,
        totalPrice: 910,
        extras: [{ name: 'Molho Barbecue Fumado da Casa', price: 60 }],
        notes: 'Ao ponto para mal passado',
      },
      {
        productId: 'prod-02',
        productName: '[DEMO] Picanha na Chapa com Mandioca',
        productCode: '#CAR-02',
        quantity: 1,
        unitPrice: 890,
        totalPrice: 890,
        extras: [],
        notes: '',
      },
    ],
  },
  {
    id: '#COM-000102',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    customerName: 'Dra. Luísa',
    customerPhone: '+258872223344',
    type: 'MESA',
    tableNumber: 'Mesa 03',
    peopleCount: 2,
    status: 'EM PREPARAÇÃO',
    subtotal: 1340,
    total: 1340,
    targetWhatsApp: 'casa',
    waiterName: 'Amina Cassamo',
    items: [
      {
        productId: 'prod-04',
        productName: '[DEMO] Camarão Grelhado à Moda de Maputo',
        productCode: '#MAR-01',
        quantity: 1,
        unitPrice: 980,
        totalPrice: 980,
        extras: [],
        notes: 'Piripíri suave',
      },
      {
        productId: 'prod-06',
        productName: '[DEMO] Salada Fattoush Crocante & Tabule',
        productCode: '#SLD-01',
        quantity: 1,
        unitPrice: 360,
        totalPrice: 360,
        extras: [],
        notes: '',
      },
    ],
  },
];

// Helper to safely load from local storage with fallback
function loadData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage for key ${key}:`, err);
    return fallback;
  }
}

// Helper to save to local storage and trigger global storage event
function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('comanchero_store_update', { detail: { key } }));
  } catch (err) {
    console.error(`Error writing to localStorage for key ${key}:`, err);
  }
}

// Data Store Service API
export const DataStore = {
  // Settings
  getSettings(): RestaurantSettings {
    return loadData<RestaurantSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(partialOrFull: Partial<RestaurantSettings>): void {
    const current = this.getSettings();
    const merged = { ...current, ...partialOrFull };
    saveData(STORAGE_KEYS.SETTINGS, merged);
  },

  // Event Subscription for reactivity
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener('comanchero_store_update', handler);
    window.addEventListener('comanchero_auth_update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('comanchero_store_update', handler);
      window.removeEventListener('comanchero_auth_update', handler);
      window.removeEventListener('storage', handler);
    };
  },

  // Categories
  getCategories(): Category[] {
    const list = loadData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return list.sort((a, b) => a.order - b.order);
  },
  saveCategories(categories: Category[]): void {
    saveData(STORAGE_KEYS.CATEGORIES, categories);
  },
  addCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  },
  updateCategory(id: string, updates: Partial<Category>): void {
    const categories = this.getCategories().map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.saveCategories(categories);
  },
  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    this.saveCategories(categories);
  },

  // Products
  getProducts(): Product[] {
    const list = loadData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return list.sort((a, b) => a.order - b.order);
  },
  saveProducts(products: Product[]): void {
    saveData(STORAGE_KEYS.PRODUCTS, products);
  },
  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  },
  updateProduct(id: string, updates: Partial<Product>): void {
    const products = this.getProducts().map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.saveProducts(products);
  },
  duplicateProduct(id: string): Product | null {
    const products = this.getProducts();
    const existing = products.find((p) => p.id === id);
    if (!existing) return null;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Cópia)`,
      code: `${existing.code}-C`,
      order: existing.order + 1,
    };
    products.push(duplicated);
    this.saveProducts(products);
    return duplicated;
  },
  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  // Tables
  getTables(): Table[] {
    const list = loadData<Table[]>(STORAGE_KEYS.TABLES, INITIAL_TABLES);
    return list.sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
  },
  saveTables(tables: Table[]): void {
    saveData(STORAGE_KEYS.TABLES, tables);
  },
  addTable(table: Omit<Table, 'id'>): Table {
    const tables = this.getTables();
    const newTable: Table = {
      ...table,
      id: `tab-${Date.now()}`,
    };
    tables.push(newTable);
    this.saveTables(tables);
    return newTable;
  },
  updateTable(id: string, updates: Partial<Table>): void {
    const tables = this.getTables().map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.saveTables(tables);
  },
  deleteTable(id: string): void {
    const tables = this.getTables().filter((t) => t.id !== id);
    this.saveTables(tables);
  },

  // Employees
  getEmployees(): Employee[] {
    return loadData<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },
  saveEmployees(employees: Employee[]): void {
    saveData(STORAGE_KEYS.EMPLOYEES, employees);
  },
  addEmployee(emp: Omit<Employee, 'id'>): Employee {
    const employees = this.getEmployees();
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
    };
    employees.push(newEmp);
    this.saveEmployees(employees);
    return newEmp;
  },
  updateEmployee(id: string, updates: Partial<Employee>): void {
    const employees = this.getEmployees().map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.saveEmployees(employees);
  },
  deleteEmployee(id: string): void {
    const employees = this.getEmployees().filter((e) => e.id !== id);
    this.saveEmployees(employees);
  },

  // Customers
  getCustomers(): Customer[] {
    return loadData<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  saveCustomers(customers: Customer[]): void {
    saveData(STORAGE_KEYS.CUSTOMERS, customers);
  },
  registerOrUpdateCustomer(name: string, phone: string, spent: number): Customer {
    const customers = this.getCustomers();
    const cleanPhone = phone.replace(/\s+/g, '');
    const existingIndex = customers.findIndex(
      (c) => c.phone.replace(/\s+/g, '') === cleanPhone
    );

    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const existing = customers[existingIndex];
      const updated: Customer = {
        ...existing,
        name: name || existing.name,
        lastOrderDate: now,
        orderCount: existing.orderCount + 1,
        totalSpent: existing.totalSpent + spent,
      };
      customers[existingIndex] = updated;
      this.saveCustomers(customers);
      return updated;
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: name || 'Cliente Comanchero',
        phone,
        createdAt: now,
        lastOrderDate: now,
        orderCount: 1,
        totalSpent: spent,
      };
      customers.unshift(newCust);
      this.saveCustomers(customers);
      return newCust;
    }
  },

  // Orders
  getOrders(): Order[] {
    const list = loadData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  saveOrders(orders: Order[]): void {
    saveData(STORAGE_KEYS.ORDERS, orders);
  },
  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const count = orders.length + 101;
    const formattedId = `#COM-${String(count).padStart(6, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: formattedId,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Register / update customer automatically
    if (newOrder.customerName && newOrder.customerPhone) {
      this.registerOrUpdateCustomer(
        newOrder.customerName,
        newOrder.customerPhone,
        newOrder.total
      );
    }

    // If dining in, update table state to EM_PREPARACAO
    if (newOrder.type === 'MESA' && newOrder.tableNumber) {
      const tables = this.getTables();
      const targetTable = tables.find(
        (t) => t.number.toLowerCase() === newOrder.tableNumber?.toLowerCase()
      );
      if (targetTable) {
        this.updateTable(targetTable.id, {
          status: 'EM_PREPARACAO',
          currentOrderId: newOrder.id,
          currentCustomerName: newOrder.customerName,
        });
      }
    }

    return newOrder;
  },
  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders().map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    this.saveOrders(orders);

    // If order is completed or cancelled, handle linked table
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.tableNumber) {
      const tables = this.getTables();
      const linkedTable = tables.find(
        (t) => t.number.toLowerCase() === targetOrder.tableNumber?.toLowerCase()
      );
      if (linkedTable) {
        if (status === 'PRONTO') {
          this.updateTable(linkedTable.id, { status: 'PRONTO' });
        } else if (status === 'FINALIZADO') {
          this.updateTable(linkedTable.id, {
            status: 'FINALIZADA',
            currentOrderId: undefined,
            currentCustomerName: undefined,
          });
        } else if (status === 'CANCELADO') {
          this.updateTable(linkedTable.id, {
            status: 'LIVRE',
            currentOrderId: undefined,
            currentCustomerName: undefined,
          });
        }
      }
    }
  },

  // Reset to Demo Data
  resetToDemo(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(INITIAL_TABLES));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    window.dispatchEvent(new CustomEvent('comanchero_store_update', { detail: { reset: true } }));
  },

  // Current Logged In Staff / Admin session
  getCurrentUser(): Employee | null {
    try {
      const item = sessionStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser(user: Employee | null): void {
    if (user) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    window.dispatchEvent(new CustomEvent('comanchero_auth_update', { detail: { user } }));
  },

  // Firebase configuration store
  getFirebaseConfig(): FirebaseConfigState {
    return loadData<FirebaseConfigState>(STORAGE_KEYS.FIREBASE_CONFIG, {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      enabled: false,
    });
  },
  saveFirebaseConfig(config: Partial<FirebaseConfigState> | null): void {
    if (!config) {
      saveData(STORAGE_KEYS.FIREBASE_CONFIG, {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        enabled: false,
      });
      return;
    }
    const current = this.getFirebaseConfig();
    const updated: FirebaseConfigState = {
      apiKey: config.apiKey ?? current.apiKey,
      authDomain: config.authDomain ?? current.authDomain,
      projectId: config.projectId ?? current.projectId,
      storageBucket: config.storageBucket ?? current.storageBucket,
      messagingSenderId: config.messagingSenderId ?? current.messagingSenderId,
      appId: config.appId ?? current.appId,
      enabled: !!(config.apiKey && config.projectId),
    };
    saveData(STORAGE_KEYS.FIREBASE_CONFIG, updated);
  },
};
