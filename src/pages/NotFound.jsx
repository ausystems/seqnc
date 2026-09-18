import { useT } from '../i18n.jsx';
import Seo from '../ui/Seo.jsx';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';

export default function NotFound() {
  const { t } = useT();
  return (
    <>
      <Seo title={t.seo.notFound.title} description={t.seo.notFound.description} />
      <section className="page nf" aria-labelledby="nf-title">
        <div className="wrap">
          <Fade now><p className="num nf__n" aria-hidden="true">404</p></Fade>
          <Lines as="h1" id="nf-title" className="dsp dsp--1" now delay={.15}>{t.notFound.title}</Lines>
          <Fade now delay={.5}><p className="lead nf__body">{t.notFound.body}</p></Fade>
          <Fade now delay={.6}><Button to="/" name="Seqnc">{t.notFound.cta}</Button></Fade>
        </div>
      </section>
    </>
  );
}
