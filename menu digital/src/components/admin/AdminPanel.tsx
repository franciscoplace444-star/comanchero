import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  UtensilsCrossed, 
  Table as TableIcon, 
  ShoppingBag, 
  Users, 
  UserCheck, 
  MessageSquare, 
  Share2, 
  Settings, 
  BarChart3, 
  QrCode, 
  Cloud, 
  ArrowLeft, 
  LogOut,
  ShieldCheck,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { Category, Product, Table, Order, Employee, Customer, RestaurantSettings } from '../../types';
import { DashboardTab } from './DashboardTab';
import { CategoriesTab } from './CategoriesTab';
import { ProductsTab } from './ProductsTab';
import { TablesTab } from './TablesTab';
import { OrdersTab } from './OrdersTab';
import { EmployeesTab } from './EmployeesTab';
import { CustomersTab } from './CustomersTab';
import { WhatsAppTab } from './WhatsAppTab';
import { SocialMediaTab } from './SocialMediaTab';
import { RestaurantSettingsTab } from './RestaurantSettingsTab';
import { ReportsTab } from './ReportsTab';
import { QRCodeTab } from './QRCodeTab';
import { FirebaseTab } from './FirebaseTab';

interface AdminPanelProps {
  currentUser: Employee;
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  tables: Table[];
  orders: Order[];
  employees: Employee[];
  customers: Customer[];
  onBackToMenu: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  settings,
  categories,
  products,
  tables,
  orders,
  employees,
  customers,
  onBackToMenu,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Calculate product counts by category
  const productCountsByCategory = products.reduce((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categorias', label: 'Categorias', icon: Layers, count: categories.length },
    { id: 'produtos', label: 'Produtos & Menu', icon: UtensilsCrossed, count: products.length },
    { id: 'mesas', label: 'Mesas do Salão', icon: TableIcon, count: tables.length },
    { id: 'pedidos', label: 'Gestão de Pedidos', icon: ShoppingBag, count: orders.filter((o) => o.status === 'NOVO').length, badgeColor: 'bg-red-500' },
    { id: 'funcionarios', label: 'Funcionários', icon: Users, count: employees.length },
    { id: 'clientes', label: 'Clientes (CRM)', icon: UserCheck, count: customers.length },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'redes', label: 'Redes Sociais & Mapa', icon: Share2 },
    { id: 'restaurante', label: 'Configurações', icon: Settings },
    { id: 'relatorios', label: 'Relatórios & Vendas', icon: BarChart3 },
    { id: 'qrcode', label: 'QR Code Mesas', icon: QrCode },
    { id: 'firebase', label: 'Nuvem & Firebase', icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-[#0c0907] text-[#ede4d8] flex flex-col">
      {/* Admin Top Header */}
      <header className="border-b border-[#2b1f13] bg-[#140e09] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#342416] text-[#c7baa8]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <button
            onClick={onBackToMenu}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#382819] bg-[#1a120b] text-xs font-semibold text-[#c5b7a5] hover:border-[#d4af37] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
            <span>Menu do Cliente</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black font-heading text-[#faeee0] leading-none">
                COMANCHERO Admin
              </h1>
              <p className="text-[10px] text-[#9a8976] mt-0.5">
                {currentUser.name} ({currentUser.role})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            className="sm:hidden p-2 rounded-lg border border-[#382819] text-[#c5b7a5]"
            title="Voltar ao Menu"
          >
            <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/40 bg-red-950/30 text-red-300 text-xs font-semibold hover:bg-red-900/50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Terminar Sessão</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#120c08] border-r border-[#261a10] pt-16 md:pt-0 transform transition-transform duration-200 md:static md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-[#8a7a69] uppercase tracking-wider">
              Painel de Controlo
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#291b10] border border-[#d4af37]/60 text-[#fae092] shadow-sm'
                      : 'border border-transparent text-[#b8a997] hover:bg-[#19110a] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-[#8a7b6a]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : isActive
                          ? 'bg-[#140e08] text-[#fae092]'
                          : 'bg-[#22160d] text-[#8e806e]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0c0907]">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardTab
                orders={orders}
                tables={tables}
                customers={customers}
                products={products}
                settings={settings}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'categorias' && (
              <CategoriesTab
                categories={categories}
                productCountsByCategory={productCountsByCategory}
              />
            )}

            {activeTab === 'produtos' && (
              <ProductsTab
                products={products}
                categories={categories}
                currency={settings.currency}
              />
            )}

            {activeTab === 'mesas' && <TablesTab tables={tables} />}

            {activeTab === 'pedidos' && (
              <OrdersTab orders={orders} settings={settings} />
            )}

            {activeTab === 'funcionarios' && (
              <EmployeesTab employees={employees} />
            )}

            {activeTab === 'clientes' && (
              <CustomersTab customers={customers} settings={settings} />
            )}

            {activeTab === 'whatsapp' && <WhatsAppTab settings={settings} />}

            {activeTab === 'redes' && <SocialMediaTab settings={settings} />}

            {activeTab === 'restaurante' && (
              <RestaurantSettingsTab settings={settings} />
            )}

            {activeTab === 'relatorios' && (
              <ReportsTab
                orders={orders}
                products={products}
                categories={categories}
                tables={tables}
                employees={employees}
                settings={settings}
              />
            )}

            {activeTab === 'qrcode' && (
              <QRCodeTab settings={settings} tables={tables} />
            )}

            {activeTab === 'firebase' && <FirebaseTab />}
          </div>
        </main>
      </div>
    </div>
  );
};
