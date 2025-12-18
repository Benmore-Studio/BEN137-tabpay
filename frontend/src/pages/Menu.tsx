import { useState, useRef, useEffect } from 'react';
import { AppLayout, CategoryNav, MenuItemCard, ItemDetailModal, useToast } from '../components';
import { MenuItemSkeleton } from '../components/ui/Skeleton';
import { useCart } from '../context';
import { categories, getMenuItemsByCategory } from '../data/mockMenu';
import type { MenuItem, SelectedModifier } from '../types';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { itemCount, addItem } = useCart();
  const { showToast } = useToast();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item, 1, []);
    showToast(`${item.name} added to cart`, 'success');
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

      <div className="pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            // Loading skeletons
            <div className="px-4 pt-6 space-y-8">
              {categories.slice(0, 2).map((category) => (
                <section key={category.id}>
                  <div className="h-7 w-32 bg-slate-200 rounded animate-pulse mb-4" />
                  <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                    {[...Array(4)].map((_, i) => (
                      <MenuItemSkeleton key={i} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            // Actual menu items
            categories.map((category) => {
              const items = getMenuItemsByCategory(category.id);
              if (items.length === 0) return null;

              return (
                <section
                  key={category.id}
                  ref={(el) => {
                    sectionRefs.current[category.id] = el;
                  }}
                  className="px-4 pt-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 mb-4">{category.name}</h2>
                  <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onQuickAdd={() => handleQuickAdd(item)}
                        onViewDetails={() => handleViewDetails(item)}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
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
