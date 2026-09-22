/* The chapter head every chapter shares: the title with its lit phrase on
   the left, the lead (and, when there is one, the action) on the right,
   both sitting on the same baseline. */
import { Lines, Fade } from './Reveal.jsx';

export default function Head({ id, title, accent, lead, action, className = '' }) {
  return (
    <div className={`chead ${className}`}>
      <Lines as="h2" id={id} className="dsp dsp--1 chead__t" stagger={.1}>{title}{accent && <><br /><span className="hi">{accent}</span></>}</Lines>
      {(lead || action) && (
        <div className="chead__side">
          {lead && <Fade><p className="lead chead__lead">{lead}</p></Fade>}
          {action && <Fade className="chead__act" delay={.1}>{action}</Fade>}
        </div>
      )}
    </div>
  );
}
