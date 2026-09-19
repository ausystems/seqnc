import { useT } from '../i18n.jsx';
import Seo from '../ui/Seo.jsx';
import Hero from './Hero.jsx';
import Statement from './Statement.jsx';
import Systems from './Systems.jsx';
import Method from './Method.jsx';
import Proof from './Proof.jsx';
import Faq from './Faq.jsx';
import Closing from './Closing.jsx';

export default function Home() {
  const { t } = useT();
  return (
    <>
      <Seo title={t.seo.home.title} description={t.seo.home.description} />
      <Hero />
      <Statement />
      <Systems />
      <Method />
      <Proof />
      <Faq />
      <Closing />
    </>
  );
}
