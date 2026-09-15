import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff, MoveUp, MoveDown, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { DataStore } from '../../services/storage';

interface CategoriesTabProps {
  categories: Category[];
  productCountsByCategory: Record<string, number>;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  productCountsByCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(1);
  const [active, setActive] = useState(true);

  const openCreate = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
    setOrder(categories.length + 1);
    setActive(true);
  };

  const openEdit = (cat: Category) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setOrder(cat.order);
    setActive(cat.active);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      DataStore.addCategory({
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        order,
        active,
      });
    } else if (editingCategory) {
      DataStore.updateCategory(editingCategory.id, {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        order,
        active,
      });
    }

    cancelForm();
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Tem certeza que deseja apagar a categoria "${catName}"?`)) {
      DataStore.deleteCategory(id);
      if (editingCategory?.id === id) {
        cancelForm();
      }
    }
  };

  const handleToggleActive = (cat: Category) => {
    DataStore.updateCategory(cat.id, { active: !cat.active });
  };

  // Move category up / down
  const handleMove = (cat: Category, direction: 'UP' | 'DOWN') => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((c) => c.id === cat.id);
    if (index < 0) return;

    if (direction === 'UP' && index > 0) {
      const prev = sorted[index - 1];
      DataStore.updateCategory(cat.id, { order: prev.order });
      DataStore.updateCategory(prev.id, { order: cat.order });
    } else if (direction === 'DOWN' && index < sorted.length - 1) {
      const next = sorted[index + 1];
      DataStore.updateCategory(cat.id, { order: next.order });
      DataStore.updateCategory(next.id, { order: cat.order });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Gestão de Categorias do Menu
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Crie, edite, reordene e ative/desative categorias do cardápio sem mexer no código.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4 text-[#140e08]" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Form Drawer / Modal when Creating or Editing */}
      {(isCreating || editingCategory) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl border border-[#d4af37]/40 bg-[#17100a] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d1f14]">
            <h3 className="text-sm font-bold text-[#fae092] uppercase tracking-wider font-heading">
              {isCreating ? 'Adicionar Nova Categoria' : `Editar Categoria: ${editingCategory?.name}`}
            </h3>
            <button type="button" onClick={cancelForm} className="text-[#8e806e] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Nome da Categoria: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Grelhados Nobres"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Ordem de Exibição (Posição):
              </label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Descrição Curta (Opcional):
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Cortes especiais maturados e feitos na brasa"
              className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              URL da Imagem da Categoria:
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cat-active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-[#342416] text-[#d4af37] focus:ring-0"
            />
            <label htmlFor="cat-active" className="text-xs text-[#ede4d8] cursor-pointer">
              Ativar e exibir esta categoria no menu público
            </label>
          </div>

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
              Salvar Categoria
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
        <div className="space-y-2.5">
          {categories.length === 0 ? (
            <p className="text-xs text-[#8d7f70] text-center py-6 italic">
              Nenhuma categoria cadastrada. Clique em "Nova Categoria" para começar.
            </p>
          ) : (
            categories.map((cat, idx) => {
              const productCount = productCountsByCategory[cat.id] || 0;

              return (
                <div
                  key={cat.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    cat.active
                      ? 'border-[#291c11] bg-[#18100a]'
                      : 'border-[#22160d] bg-[#120b06] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono text-xs font-bold text-[#8d7e6e]">
                      #{cat.order}
                    </span>

                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
                      alt={cat.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#342416]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80';
                      }}
                    />

                    <div>
                      <h4 className="text-sm font-bold text-[#f5ebd6] font-heading flex items-center gap-2">
                        {cat.name}
                        {!cat.active && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/40 border border-red-800 text-red-400">
                            Inativa
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#8d7e6e] line-clamp-1">
                        {cat.description || 'Sem descrição'} • <strong className="text-[#fae092]">{productCount}</strong> pratos vinculados
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {/* Move up / down */}
                    <button
                      onClick={() => handleMove(cat, 'UP')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37] disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMove(cat, 'DOWN')}
                      disabled={idx === categories.length - 1}
                      className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37] disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`p-1.5 rounded-lg border ${
                        cat.active
                          ? 'border-[#2d1e13] text-[#8e806e] hover:text-amber-400'
                          : 'border-red-900 text-red-400'
                      }`}
                      title={cat.active ? 'Ocultar Categoria' : 'Ativar Categoria'}
                    >
                      {cat.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37]"
                      title="Editar Categoria"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#ef4444]"
                      title="Apagar Categoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
