import { A } from '../engine/transition.jsx';
import { useT } from '../i18n.jsx';
import { Arrow, ArrowExt } from './Icons.jsx';

/* The pill.  Violet by default, ink on night, ghost for the quiet one.
   `href` opens a new tab and says so to screen readers, `to` is a route. */
export default function Button({ href, to, name, children, ghost = false, small = false, className = '', calendly = false, onClick, ...rest }) {
  const { t } = useT();
  const cls = `btn${ghost ? ' btn--ghost' : ''}${small ? ' btn--s' : ''}${className ? ' ' + className : ''}`;
  const inner = (<><span className="btn__label">{children}</span>{href ? <ArrowExt /> : <Arrow />}</>);
  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>
        {inner}<span className="vh">{calendly ? t.ui.opensCalendly : t.ui.opensNewTab}</span>
      </a>
    );
  }
  if (to) return <A className={cls} to={to} name={name} onClick={onClick} {...rest}>{inner}</A>;
  return <button type="button" className={cls} onClick={onClick} {...rest}>{inner}</button>;
}

/* A text link with an arrow; internal, hash or external. */
export function MonoLink({ href, to, name, children, dim = false, className = '', ...rest }) {
  const { t } = useT();
  const cls = `mlnk${dim ? ' mlnk--dim' : ''}${className ? ' ' + className : ''}`;
  if (to) return <A className={cls} to={to} name={name} {...rest}><span>{children}</span><Arrow className="" /></A>;
  const external = /^https?:/.test(href || '');
  return (
    <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      <span>{children}</span>{external ? <ArrowExt className="ext" /> : <Arrow className="" />}
      {external && <span className="vh">{t.ui.opensNewTab}</span>}
    </a>
  );
}
