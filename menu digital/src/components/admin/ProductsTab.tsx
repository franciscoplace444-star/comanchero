import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Upload, 
  Star, 
  Tag, 
  Search, 
  Filter, 
  X, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { Product, Category, ProductExtra } from '../../types';
import { DataStore } from '../../services/storage';

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  currency: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  categories,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(500);
  const [promoPrice, setPromoPrice] = useState<number | string>('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(1);
  const [extras, setExtras] = useState<ProductExtra[]>([]);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState<number | string>('');

  const openCreate = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setCode(`#PRD-${String(products.length + 1).padStart(2, '0')}`);
    setName('');
    setDescription('');
    setPrice(450);
    setPromoPrice('');
    setCategoryId(categories[0]?.id || '');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setAvailable(true);
    setFeatured(false);
    setOrder(products.length + 1);
    setExtras([]);
  };

  const openEdit = (product: Product) => {
    setIsCreating(false);
    setEditingProduct(product);
    setCode(product.code);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setPromoPrice(product.promoPrice !== undefined ? product.promoPrice : '');
    setCategoryId(product.categoryId);
    setImage(product.image);
    setAvailable(product.available);
    setFeatured(product.featured);
    setOrder(product.order);
    setExtras(product.extras || []);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExtra = () => {
    if (!newExtraName.trim()) return;
    const p = parseFloat(String(newExtraPrice)) || 0;
    setExtras([...extras, { id: `ext-${Date.now()}`, name: newExtraName.trim(), price: p }]);
    setNewExtraName('');
    setNewExtraPrice('');
  };

  const handleRemoveExtra = (id: string) => {
    setExtras(extras.filter((e) => e.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numPrice = parseFloat(String(price)) || 0;
    const numPromo = promoPrice !== '' ? parseFloat(String(promoPrice)) : undefined;

    if (isCreating) {
      DataStore.addProduct({
        code: code.trim() || `#PRD-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        promoPrice: numPromo,
        categoryId: categoryId || categories[0]?.id || 'cat-entradas',
        image: image.trim(),
        available,
        featured,
        order,
        extras,
      });
    } else if (editingProduct) {
      DataStore.updateProduct(editingProduct.id, {
        code: code.trim(),
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        promoPrice: numPromo,
        categoryId,
        image: image.trim(),
        available,
        featured,
        order,
        extras,
      });
    }

    cancelForm();
  };

  const handleDuplicate = (id: string) => {
    DataStore.duplicateProduct(id);
  };

  const handleToggleHide = (product: Product) => {
    DataStore.updateProduct(product.id, { available: !product.available });
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Tem certeza que deseja apagar o produto "${prodName}"?`)) {
      DataStore.deleteProduct(id);
      if (editingProduct?.id === id) {
        cancelForm();
      }
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCatFilter === 'ALL' || p.categoryId === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Gestão de Produtos & Cardápio
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Adicione, edite, duplique, oculte e altere preços e fotos sem editar código.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4 text-[#140e08]" />
          <span>Adicionar Produto</span>
        </button>
      </div>

      {/* Product Form (Create / Edit) */}
      {(isCreating || editingProduct) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl border border-[#d4af37]/40 bg-[#17100a] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d1f14]">
            <h3 className="text-sm font-bold text-[#fae092] uppercase tracking-wider font-heading">
              {isCreating ? 'Cadastrar Novo Prato / Bebida' : `Editar Produto: ${editingProduct?.name}`}
            </h3>
            <button type="button" onClick={cancelForm} className="text-[#8e806e] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Código Interno: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: #CAR-01"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Nome do Prato / Produto: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: T-Bone Steak Especial Comanchero"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Categoria: <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Preço ({currency}): <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Preço Promocional ({currency}) (Opcional):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                placeholder="Deixar vazio se normal"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Descrição Detalhada do Prato:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva ingredientes, ponto de preparo e acompanhamentos..."
              className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          {/* Image URL or File Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-[#2d1e13] bg-[#120b06]">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                URL da Imagem:
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-[#342416] bg-[#18110b] p-2 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                Ou Carregar Foto do Computador:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-[#9d8d7b] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border file:border-[#382718] file:bg-[#20150d] file:text-[#f4e4b5] file:cursor-pointer"
              />
            </div>

            {image && (
              <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                <img
                  src={image}
                  alt="Pré-visualização"
                  className="w-16 h-16 rounded-lg object-cover border border-[#3a2717]"
                />
                <span className="text-[11px] text-[#9a8976]">
                  Pré-visualização da fotografia do produto
                </span>
              </div>
            )}
          </div>

          {/* Adicionais / Extras Management */}
          <div className="p-3 rounded-xl border border-[#2d1e13] bg-[#120b06] space-y-2">
            <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              Adicionais & Acompanhamentos deste Produto:
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Nome do Adicional (ex: Molho Especial)"
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
                className="flex-1 min-w-[160px] rounded-lg border border-[#342416] bg-[#18110b] p-2 text-xs text-[#ede4d8]"
              />
              <input
                type="number"
                placeholder={`Preço (${currency})`}
                value={newExtraPrice}
                onChange={(e) => setNewExtraPrice(e.target.value)}
                className="w-28 rounded-lg border border-[#342416] bg-[#18110b] p-2 text-xs text-[#ede4d8]"
              />
              <button
                type="button"
                onClick={handleAddExtra}
                className="px-3 py-2 rounded-lg bg-[#2b1f13] text-[#fae092] border border-[#44311f] text-xs font-semibold hover:border-[#d4af37]"
              >
                + Adicionar
              </button>
            </div>

            {extras.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {extras.map((ex) => (
                  <span
                    key={ex.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f140c] border border-[#3a2717] text-xs text-[#dcd1be]"
                  >
                    <span>{ex.name} (+{ex.price} {currency})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(ex.id)}
                      className="text-[#ef4444] hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes: Available, Featured, Order */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="rounded border-[#342416] text-[#d4af37]"
              />
              <span className="text-[#ede4d8]">Disponível para Pedido</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[#342416] text-[#d4af37]"
              />
              <span className="text-[#fae092] font-semibold">Produto em Destaque ⭐</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[#a0907e]">Ordem de exibição:</span>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-16 rounded-lg border border-[#342416] bg-[#100b07] p-1.5 text-xs text-[#ede4d8]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#26190f]">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 rounded-xl border border-[#362719] bg-[#18110a] text-xs font-semibold text-[#a59685] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] text-xs font-bold uppercase tracking-wider shadow hover:brightness-110"
            >
              SALVAR PRODUTO
            </button>
          </div>
        </form>
      )}

      {/* Filters Bar */}
      <div className="p-3 rounded-2xl border border-[#2d1e13] bg-[#140e09] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Pesquisar por nome, código ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#342416] bg-[#18100a] pl-9 pr-4 py-2 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8a7b6a]" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8a7b6a] hidden sm:block" />
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="rounded-xl border border-[#342416] bg-[#18100a] p-2 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
          >
            <option value="ALL">Todas as Categorias ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <p className="text-xs text-[#8d7f70] text-center py-6 italic">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          ) : (
            filteredProducts.map((prod) => {
              const catObj = categories.find((c) => c.id === prod.categoryId);
              return (
                <div
                  key={prod.id}
                  className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
                    prod.available
                      ? 'border-[#291c11] bg-[#18100a]'
                      : 'border-[#22160d] bg-[#120b06] opacity-60'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
                      alt={prod.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#342416] flex-shrink-0"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#d4af37]">
                          {prod.code}
                        </span>
                        <h4 className="text-sm font-bold text-[#f5ebd6] font-heading">
                          {prod.name}
                        </h4>
                        {prod.featured && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#d4af37] text-[#140e08] text-[9px] font-black uppercase">
                            Destaque
                          </span>
                        )}
                        {prod.promoPrice && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-900/60 border border-red-700 text-red-300 text-[9px] font-black uppercase">
                            Promoção
                          </span>
                        )}
                        {!prod.available && (
                          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 text-[9px] font-bold">
                            Oculto / Esgotado
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#8d7e6e] line-clamp-1 mt-0.5">
                        {prod.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9f907e]">
                        <span>Categoria: <strong className="text-[#dcd1be]">{catObj?.name || 'Geral'}</strong></span>
                        <span>•</span>
                        <span>Preço: <strong className="text-[#fae092] font-mono">{prod.price} {currency}</strong></span>
                        {prod.promoPrice && (
                          <span className="text-red-400 font-mono font-semibold">
                            (Promo: {prod.promoPrice} {currency})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto">
                    {/* Toggle Hide */}
                    <button
                      onClick={() => handleToggleHide(prod)}
                      className={`p-2 rounded-lg border ${
                        prod.available
                          ? 'border-[#2d1e13] text-[#8e806e] hover:text-amber-400'
                          : 'border-red-900 text-red-400'
                      }`}
                      title={prod.available ? 'Ocultar Produto' : 'Reativar Produto'}
                    >
                      {prod.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(prod.id)}
                      className="p-2 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37]"
                      title="Duplicar Produto"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(prod)}
                      className="p-2 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37]"
                      title="Editar Produto"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-2 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#ef4444]"
                      title="Apagar Produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
