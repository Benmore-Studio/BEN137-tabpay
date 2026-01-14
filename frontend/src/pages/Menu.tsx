import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { AppLayout, CategoryNav, MenuItemCard, ItemDetailModal, useToast } from '../components';
import { useCart, useProfile, useOrderHistory } from '../context';
import { categories, getMenuItemsByCategory } from '../data/mockMenu';
import type { MenuItem, SelectedModifier } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { itemCount, addItem, serviceBar } = useCart();
  const { isGuest } = useProfile();
  const { activeOrderIds } = useOrderHistory();
  const { showToast } = useToast();

  // Guest users with a service bar see an extra banner
  const hasGuestBanner = isGuest && !!serviceBar;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const section = sectionRefs.current[categoryId];
    if (section) {
      // Header (56px) + CategoryNav (~56px) + Guest banner (36px if applicable)
      const headerOffset = hasGuestBanner ? 148 : 112;
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
      // Header (56px) + CategoryNav (~56px) + Guest banner (36px if applicable) + buffer
      const headerOffset = hasGuestBanner ? 156 : 120;
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
  }, [activeCategory, hasGuestBanner]);

  return (
    <AppLayout cartCount={itemCount} showBarSelector>
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        hasGuestBanner={hasGuestBanner}
      />

      {/* Active Order Banner for Guests */}
      {isGuest && activeOrderIds.length > 0 && (
        <Link
          to={activeOrderIds.length === 1 ? `/confirmation/${activeOrderIds[0]}` : '/orders'}
          className="block mx-4 mt-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl ring-1 ring-primary-200 hover:ring-primary-300 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-900">
                {activeOrderIds.length === 1
                  ? 'Your order is being prepared'
                  : `${activeOrderIds.length} orders in progress`}
              </p>
              <p className="text-xs text-primary-600">Tap to view order status</p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      )}

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
                <motion.h2
                  className="text-xl font-bold text-slate-900 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4 }}
                >
                  {category.name}
                </motion.h2>
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  {items.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard
                        item={item}
                        onViewDetails={() => handleViewDetails(item)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
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
