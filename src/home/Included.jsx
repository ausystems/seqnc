/* =========================================================================
   Included with every build: three tiles, one idea each, every line from
   published copy, each with its scene: the tools connecting into the
   mark, the seal of two to four weeks, the ninety-day dial.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import Head from '../ui/Head.jsx';
import Tools from './scenes/Tools.jsx';
import Build from './scenes/Build.jsx';
import Guarantee from './scenes/Guarantee.jsx';

const TILES = [
  { key: 'tools', Scene: Tools, cls: 'btile--tools', theme: 'dark' },
  { key: 'build', Scene: Build, cls: 'btile--build' },
  { key: 'guarantee', Scene: Guarantee, cls: 'btile--ring' },
];

export default function Included() {
  const { t } = useT();
  const b = t.bento, tiles = b.tiles;
  return (
    <section className="section bento" id="included" aria-labelledby="bento-title">
      <div className="wrap">
        <Head id="bento-title" title={b.titleStart} accent={b.titleAccent} lead={b.body} />
        <div className="bgrid">
          {TILES.map(({ key, Scene, cls, theme }) => (
            <article className={`btile ${cls}`} key={key} data-theme={theme}>
              <Scene d={tiles[key]} className="btile__scene" />
              <h3 className="btile__t">{tiles[key].title}</h3>
              <p className="btile__d">{tiles[key].body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
