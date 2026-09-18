/* The section label.  Either an accent rule and a mono word, or an index
   followed by a rule and the word. */
export default function Eyebrow({ children, n, className = '', as: Tag = 'p' }) {
  if (n) {
    return (
      <Tag className={`eyebrow eyebrow--n mono ${className}`}><span className="eyebrow__i">{n}</span><span className="eyebrow__r" aria-hidden="true" /><span>{children}</span></Tag>
    );
  }
  return <Tag className={`eyebrow mono ${className}`}><span>{children}</span></Tag>;
}
