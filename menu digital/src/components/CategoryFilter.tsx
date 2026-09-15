import React from 'react';
import { Category } from '../types';
import { Sparkles, Utensils } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  productCountsByCategory: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  productCountsByCategory,
}) => {
  const activeCategories = categories
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order);

  const totalProducts = (Object.values(productCountsByCategory) as number[]).reduce(
    (acc: number, val: number) => acc + (val || 0),
    0
  );

  return (
    <div className="w-full py-4 bg-[#110d09]/95 border-b border-[#261c13] sticky top-16 sm:top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {/* "Todos os Pratos" button */}
          <button
            id="cat-btn-all"
            onClick={() => onSelectCategory('all')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b88c1c] text-[#140e08] shadow-md shadow-[#d4af37]/20 scale-[1.02]'
                : 'border border-[#2f2216] bg-[#1a130c] text-[#c7baa8] hover:border-[#d4af37]/50 hover:text-white'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${selectedCategoryId === 'all' ? 'text-[#140e08]' : 'text-[#d4af37]'}`} />
            <span>Todos os Pratos</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategoryId === 'all'
                  ? 'bg-[#140e08]/20 text-[#140e08]'
                  : 'bg-[#291e14] text-[#a39480]'
              }`}
            >
              {totalProducts}
            </span>
          </button>

          {/* Dynamic Categories */}
          {activeCategories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const count = productCountsByCategory[category.id] || 0;

            return (
              <button
                key={category.id}
                id={`cat-btn-${category.id}`}
                onClick={() => onSelectCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b88c1c] text-[#140e08] shadow-md shadow-[#d4af37]/20 scale-[1.02]'
                    : 'border border-[#2f2216] bg-[#1a130c] text-[#c7baa8] hover:border-[#d4af37]/50 hover:text-white'
                }`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#443322]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Utensils className={`w-3.5 h-3.5 ${isSelected ? 'text-[#140e08]' : 'text-[#d4af37]'}`} />
                )}
                <span className="whitespace-nowrap">{category.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-[#140e08]/20 text-[#140e08]'
                      : 'bg-[#261b11] text-[#938471]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
