import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ORIGIN = 'https://seqnc.ca';

/* Document title, description and canonical per page, in the active language. */
export default function Seo({ title, description }) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (title) document.title = title;
    const meta = (sel, make) => { let m = document.querySelector(sel); if (!m) { m = make(); document.head.appendChild(m); } return m; };
    if (description) {
      meta('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' })).content = description;
      meta('meta[property="og:description"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); return m; }).content = description;
    }
    if (title) meta('meta[property="og:title"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); return m; }).content = title;
    const url = ORIGIN + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
    meta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).href = url;
    meta('meta[property="og:url"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); return m; }).content = url;
  }, [title, description, pathname]);
  return null;
}
