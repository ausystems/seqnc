/* The three small interfaces that live inside the automation monitor. */

export function Chart() {
  const hs = [22, 31, 26, 44, 38, 57, 100, 63, 49, 71, 55, 80, 41, 34];
  return (
    <div className="mock mock--chart" aria-hidden="true">
      <div className="mock__head">
        <div><span className="mock__label">Average lead response</span><strong className="mock__value">00:47<em>s</em></strong></div>
        <span className="mock__tag"><i />Live</span>
      </div>
      <div className="mock__rule" />
      <div className="bars">
        {hs.map((h, i) => <span key={i} className={h === 100 ? 'is-peak' : ''} style={{ '--h': `${h}%`, '--i': i }} />)}
      </div>
      <div className="mock__foot"><span>New enquiry</span><span>Qualified</span><span>Booked</span></div>
    </div>
  );
}

export function Flow() {
  const steps = ['Customer signs up', 'Information collected', 'Documents requested', 'Team notified', 'Tasks created', 'Appointments scheduled'];
  return (
    <div className="mock mock--flow" aria-hidden="true">
      <div className="flow__line flow__line--top" />
      <div className="flow__card">
        <span className="flow__badge"><svg viewBox="0 0 24 24"><path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z" /></svg></span>
        <span className="flow__bar" /><span className="flow__bar flow__bar--s" />
      </div>
      <div className="flow__line flow__line--bot" />
      <div className="flow__dots">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} />)}</div>
      <ol className="flow__steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
    </div>
  );
}

export function Dash() {
  return (
    <div className="mock mock--dash" aria-hidden="true">
      <aside className="dash__side">
        <div className="dash__brand"><span className="dash__logo" />Seqnc</div>
        <div className="dash__avatar" />
        <span className="dash__name">Divos Detailing</span>
        <span className="dash__role">Connected</span>
        <nav className="dash__nav">
          <span className="is-on">Campaigns</span><span>Customers</span><span>Scheduling</span><span>Reviews</span>
          <span>Win-back <i className="dash__pip">6</i></span>
        </nav>
      </aside>
      <div className="dash__main">
        <div className="dash__bar"><span className="dash__grid" /><span className="dash__search">Search customers</span></div>
        <div className="dash__cards">
          <div className="dash__card"><b>1,077</b><span>Active customers</span></div>
          <div className="dash__card"><b>318</b><span>Follow-ups sent</span></div>
          <div className="dash__card"><b>64</b><span>Reviews collected</span></div>
        </div>
        <div className="dash__chart">
          <span className="dash__chartlabel">Repeat bookings</span>
          <svg viewBox="0 0 320 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lgf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
            </defs>
            <path className="dash__area" d="M0 74 L26 70 L52 72 L78 58 L104 62 L130 40 L156 44 L182 26 L208 32 L234 18 L260 24 L286 12 L320 16 L320 90 L0 90 Z" fill="url(#lgf)" />
            <path className="dash__line" d="M0 74 L26 70 L52 72 L78 58 L104 62 L130 40 L156 44 L182 26 L208 32 L234 18 L260 24 L286 12 L320 16" fill="none" strokeWidth="1.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export const MOCKS = { chart: Chart, flow: Flow, dash: Dash };
