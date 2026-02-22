import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/cursor/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Services } from './sections/Services';
import { Works } from './sections/Works';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { ServicePage } from './pages/ServicePage';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WhatsAppFloat } from './components/WhatsAppFloat';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === '';

  // Initialize smooth scroll (only on home for now to avoid conflicts with static pages)
  useSmoothScroll();

  useEffect(() => {
    const preloadAssets = async () => {
      await document.fonts.ready;
      setTimeout(() => {
        setIsReady(true);
      }, 500);
    };

    preloadAssets();

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <>
      <ScrollToTop />
      {/* Loading Screen */}
      {isLoading && isReady && isHome && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) || (isLoading && setIsLoading(false))}

      {/* Custom Cursor */}
      <CustomCursor isEnabled={!isLoading} />

      {/* Navigation */}
      {!isLoading && <Navigation />}

      {/* Main Content */}
      <main className={`relative ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <About />
              <Services />
              <Works />
              <Testimonials />
              <Contact />
            </>
          } />
          <Route path="/services/:serviceId" element={<ServicePage />} />
        </Routes>
        <Footer />
        <WhatsAppFloat />
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
