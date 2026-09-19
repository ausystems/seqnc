import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import App from './App.jsx';
import { bindInput } from './engine/input.js';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/nav.css';
import './styles/home.css';
import './styles/bento.css';
import './styles/pages.css';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });
bindInput();
if (import.meta.env.DEV) { window.__ST = ScrollTrigger; window.__gsap = gsap; }

createRoot(document.getElementById('root')).render(<App />);
