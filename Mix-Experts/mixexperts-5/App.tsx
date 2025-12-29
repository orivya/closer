import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Workflow } from './components/Workflow';
import { Products } from './components/Products';
import { AudioDemo } from './components/AudioDemo';
import { Assistant } from './components/Assistant';
import { Portfolio } from './components/Portfolio';
import { Testimonials } from './components/Testimonials';
import { About } from './components/About';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ProductPage } from './components/ProductPage';
import { ServicePage } from './components/ServicePage';
import { THEMES, PRODUCTS as STATIC_PRODUCTS } from './constants'; // Keep static as fallback
import { ThemeName, Product } from './types';
import { getShopifyProducts } from './lib/shopify';

type ViewState = 'HOME' | 'PRODUCT' | 'SERVICE';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeName>('amber');
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for products
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);

  // Fetch real products on mount
  useEffect(() => {
    const loadProducts = async () => {
      const shopifyProducts = await getShopifyProducts();
      if (shopifyProducts.length > 0) {
        setProducts(shopifyProducts);
      }
    };
    loadProducts();
  }, []);

  // Apply theme variables to root
  useEffect(() => {
    const root = document.documentElement;
    const colors = THEMES[theme];
    
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-light', colors.accentLight);
    root.style.setProperty('--accent-subtle', colors.accentSubtle);
    root.style.setProperty('--accent-glow', colors.accentGlow);
  }, [theme]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('PRODUCT');
    window.scrollTo(0, 0);
  };

  const handleServiceSelect = () => {
    setCurrentView('SERVICE');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('HOME');
    window.scrollTo(0, 0);
  };

  return (
    <div className="antialiased selection:bg-[var(--accent)] selection:text-white">
      <Navigation />
      
      <main>
        {currentView === 'HOME' && (
          <>
            <Hero />
            <Services onServiceSelect={handleServiceSelect} />
            <Assistant />
            <AudioDemo />
            <Workflow />
            {/* Pass the dynamic products state here */}
            <Products products={products} onProductSelect={handleProductSelect} />
            <Portfolio />
            <Testimonials />
            <About />
            <FAQ />
            <FinalCTA />
          </>
        )}

        {currentView === 'PRODUCT' && selectedProduct && (
          <ProductPage product={selectedProduct} onBack={handleBackToHome} />
        )}

        {currentView === 'SERVICE' && (
          <ServicePage onBack={handleBackToHome} />
        )}
      </main>

      <Footer />
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
    </div>
  );
};

export default App;