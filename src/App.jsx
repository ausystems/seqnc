import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { I18nProvider, useT } from './i18n.jsx';
import { ScrollProvider } from './engine/scroll.jsx';
import { TransitionProvider } from './engine/transition.jsx';
import Nav from './ui/Nav.jsx';
import Footer from './ui/Footer.jsx';
import Home from './home/Home.jsx';
import FreeReview from './pages/FreeReview.jsx';
import Legal from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';

gsap.registerPlugin(ScrollTrigger);

function Refresh() {
  const location = useLocation();
  const { lang } = useT();
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts && document.fonts.ready.then(refresh);
    const t1 = setTimeout(refresh, 600);
    const t2 = setTimeout(refresh, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location.key, lang]);
  return null;
}

function Shell() {
  const location = useLocation();
  return (
    <TransitionProvider>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/free-review" element={<FreeReview />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Refresh />
    </TransitionProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <ScrollProvider>
          <Shell />
        </ScrollProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
