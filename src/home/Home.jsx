import { useT } from '../i18n.jsx';
import Seo from '../ui/Seo.jsx';
import Hero from './Hero.jsx';
import Leaks from './Leaks.jsx';
import Problem from './Problem.jsx';
import Systems from './Systems.jsx';
import Work from './Work.jsx';
import Demos from './Demos.jsx';
import Process from './Process.jsx';
import Pricing from './Pricing.jsx';
import Faq from './Faq.jsx';
import Closing from './Closing.jsx';

export default function Home() {
  const { t } = useT();
  return (
    <>
      <Seo title={t.seo.home.title} description={t.seo.home.description} />
      <Hero />
      <Leaks />
      <Problem />
      <Systems />
      <Work />
      <Demos />
      <Process />
      <Pricing />
      <Faq />
      <Closing />
    </>
  );
}
