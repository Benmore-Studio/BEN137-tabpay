import { useState, useRef, useEffect } from 'react';
import { AppLayout, CategoryNav, MenuItemCard, ItemDetailModal, useToast } from '../components';
import { useCart } from '../context';
import { categories, getMenuItemsByCategory } from '../data/mockMenu';
import type { MenuItem, SelectedModifier } from '../types';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { itemCount, addItem } = useCart();
  const { showToast } = useToast();

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const section = sectionRefs.current[categoryId];
    if (section) {
      const headerOffset = 112; // Header (56px) + CategoryNav (~56px)
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleViewDetails = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (
    quantity: number,
    selectedModifiers: SelectedModifier[],
    specialInstructions?: string
  ) => {
    if (selectedItem) {
      addItem(selectedItem, quantity, selectedModifiers, specialInstructions);
      showToast(`${selectedItem.name} added to cart`, 'success');
    }
  };

  // Update active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 120;
      const scrollPosition = window.scrollY + headerOffset;

      for (const category of categories) {
        const section = sectionRefs.current[category.id];
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeCategory !== category.id) {
              setActiveCategory(category.id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  return (
    <AppLayout cartCount={itemCount}>
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {categories.map((category) => {
            const items = getMenuItemsByCategory(category.id);
            if (items.length === 0) return null;

            return (
              <section
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                className="pt-6"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6">{category.name}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onViewDetails={() => handleViewDetails(item)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </AppLayout>
  );
}
