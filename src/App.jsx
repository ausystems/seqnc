import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollProvider } from './engine/scroll.jsx';
import Nav from './ui/Nav.jsx';
import Hero from './scenes/Hero.jsx';
import Manifesto from './scenes/Manifesto.jsx';
import Problems from './scenes/Problems.jsx';
import Automations from './scenes/Automations.jsx';
import Capabilities from './scenes/Capabilities.jsx';
import Tools from './scenes/Tools.jsx';
import Process from './scenes/Process.jsx';
import CaseStudy from './scenes/CaseStudy.jsx';
import Why from './scenes/Why.jsx';
import Faq from './scenes/Faq.jsx';
import Book from './scenes/Book.jsx';
import Footer from './scenes/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 1200);
    return () => { window.removeEventListener('load', refresh); clearTimeout(t); };
  }, []);
  return (
    <ScrollProvider>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Problems />
        <Automations />
        <Capabilities />
        <Tools />
        <Process />
        <CaseStudy />
        <Why />
        <Faq />
        <Book />
      </main>
      <Footer />
    </ScrollProvider>
  );
}
