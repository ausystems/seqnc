/* =========================================================================
   Scene registry — which level the player is in.

   Every scene registers itself with a name; a ScrollTrigger per scene
   reports when it takes focus.  The HUD, the depth field and the document
   root all read the same store.
   ========================================================================= */
import { useSyncExternalStore } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { input } from './input.js';

gsap.registerPlugin(ScrollTrigger);

const scenes = [];                       // { id, name, el }
let active = { index: 0, id: 'hero', name: 'Opening' };
const listeners = new Set();

function emit() { listeners.forEach((l) => l()); }

export function registerScene(el, id, name) {
  const entry = { id, name, el };
  scenes.push(entry);
  scenes.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  const st = ScrollTrigger.create({
    trigger: el,
    start: 'top 55%',
    end: 'bottom 45%',
    onToggle: (self) => {
      if (!self.isActive) return;
      const index = scenes.indexOf(entry);
      if (active.id === id) return;
      active = { index, id, name };
      input.scene = index;
      document.documentElement.dataset.scene = id;
      emit();
    },
  });

  return () => {
    st.kill();
    const i = scenes.indexOf(entry);
    if (i >= 0) scenes.splice(i, 1);
  };
}

export const sceneCount = () => scenes.length;

export function useActiveScene() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => active,
    () => active,
  );
}
