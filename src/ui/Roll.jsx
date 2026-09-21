/* A digit that rolls up to its value through every digit below it.  The
   column is 0..n stacked in one line-height box; moving it up by n rows
   lands on n, which `rollTo` gives as a yPercent. */

export function Digit({ n }) {
  const col = [];
  for (let k = 0; k <= n; k++) col.push(<span key={k}>{k}</span>);
  return <span className="roll" data-n={n}><span className="roll__col">{col}</span></span>;
}

export const rollTo = (r) => -100 * Number(r.dataset.n) / (Number(r.dataset.n) + 1);
