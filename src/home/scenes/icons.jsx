/* The scene icon set: one stroke weight, round joins, drawn on a 24 grid. */
const I = ({ d, children }) => (
  <i className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d ? <path d={d} /> : children}</svg></i>
);
export const Phone = () => <I d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />;
export const Mail = () => <I><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 8 9 6 9-6" /></I>;
export const Chat = () => <I d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H10l-5 4v-4a3 3 0 0 1-1-2.2V6Z" />;
export const Inbox = () => <I><path d="M3 13h5l1.5 2h5L16 13h5" /><path d="M5 4h14l2 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6l2-9Z" /></I>;
export const Send = () => <I d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />;
export const Check = () => <I d="M5 12.5 9.5 17 19 7" />;
export const Doc = () => <I><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></I>;
export const Pen = () => <I d="M4 20h4l10-10-4-4L4 16v4ZM13 7l4 4" />;
export const Team = () => <I><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0M15 4.5a3.2 3.2 0 0 1 0 6.4M17 14a6 6 0 0 1 4 6" /></I>;
export const Flag = () => <I d="M5 21V4m0 0h11l-2 4 2 4H5" />;
export const Star = () => <I d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />;
export const Gift = () => <I><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M12 9v12M3 14h18M12 9c-2-4-6-4-6-1s4 1 6 1Zm0 0c2-4 6-4 6-1s-4 1-6 1Z" /></I>;
export const Calendar = () => <I><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></I>;
export const Sun = () => <I><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></I>;
export const Bell = () => <I d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Zm4 4a2 2 0 0 0 4 0" />;
export const Receipt = () => <I><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6" /></I>;
export const Card = () => <I><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18M7 15h4" /></I>;
export const Grid = () => <I><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></I>;
export const Form = () => <I><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" /></I>;
export const Wrench = () => <I d="M14.5 6.5a4 4 0 0 0 5 5l-9 9-2.5-2.5 9-9a4 4 0 0 0-5-5l2.5 2.5Z" />;
export const Lock = () => <I><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></I>;
