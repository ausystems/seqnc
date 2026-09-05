/* Every word on the site.  Short on purpose. */

export const brand = { name: 'Seqnc', domain: 'Seqnc.ai', tag: 'Business automation for service businesses', status: 'Available for new projects' };

export const nav = [
  { href: '#what', label: 'Why' },
  { href: '#automations', label: 'What we build' },
  { href: '#process', label: 'How it works' },
  { href: '#work', label: 'Case study' },
];

export const hero = {
  label: 'Business automation for service businesses',
  headline: ['Run your business', 'on autopilot.'],
  lede: 'Seqnc automates leads, scheduling, workflows and follow-ups around the tools you already use.',
  primary: { label: 'Get your free review', href: '#book' },
  secondary: { label: 'See what we build', href: '#automations' },
  note: '60 minutes. No commitment.',
};

export const manifesto = {
  label: 'Our position',
  heading: ['Stop running', 'your business by hand.'],
  sub: 'Less manual work. More completed jobs. More time back.',
  cards: ['Leads', 'Quotes', 'Scheduling', 'Invoices', 'Follow-ups'],
  captions: ['Handled by hand', 'Handled by Seqnc'],
  stats: [
    { label: 'Free review', value: '60', unit: 'min' },
    { label: 'Build time', value: '2–4', unit: 'weeks' },
    { label: 'Built for', value: '2–20', unit: 'people' },
    { label: 'Your software', value: 'Kept', unit: '' },
  ],
};

export const problems = {
  label: 'The diagnosis',
  heading: ['Small leaks.', 'Every day.'],
  statement: ['Most service businesses don’t have a people problem.', 'They have a systems problem.'],
  items: [
    'Slow lead responses', 'Missed calls and enquiries', 'Manual quote follow-ups', 'Appointment scheduling',
    'Repetitive data entry', 'Manual customer onboarding', 'Missed internal tasks', 'Invoice follow-ups',
    'Review requests', 'Customer reactivation', 'Referral follow-ups', 'Seasonal campaigns',
  ],
};

export const automations = {
  label: 'What we build',
  heading: ['Three systems.', 'Zero busywork.'],
  cta: { label: 'Get your free review', href: '#book' },
  items: [
    {
      eyebrow: 'Lead automation',
      heading: ['Respond to new leads', 'automatically.'],
      body: 'Calls, forms, emails and messages are answered fast and consistently. Details are captured, your team is notified.',
      ticks: ['Qualify and collect details', 'Send estimates and next steps', 'Track every lead'],
      visual: 'leads',
    },
    {
      eyebrow: 'Workflow automation',
      heading: ['Keep every job moving', 'from yes to done.'],
      body: 'Once a customer says yes, every next step happens on its own. Information collected, tasks created, appointments scheduled.',
      ticks: ['No sticky notes', 'No forgotten tasks', 'No guessing what happens next'],
      visual: 'flow',
    },
    {
      eyebrow: 'Follow-up automation',
      heading: ['Stay in front of customers', 'at the right time.'],
      body: 'Reviews, reminders, seasonal offers and win-back campaigns go out on schedule, in your words.',
      ticks: ['Review and referral requests', 'Repeat service reminders', 'Win-back campaigns'],
      visual: 'follow',
    },
  ],
};

export const capabilities = {
  label: 'Capabilities',
  heading: ['If it repeats,', 'it can run itself.'],
  items: [
    { name: 'Lead management', body: 'Capture, qualify and follow up automatically.', glyph: 'inbox' },
    { name: 'Scheduling', body: 'Customers book while your calendar stays organised.', glyph: 'calendar' },
    { name: 'CRM automation', body: 'Records updated, leads moved through the pipeline.', glyph: 'crm' },
    { name: 'Onboarding', body: 'Information, documents and tasks, prepared for you.', glyph: 'onboard' },
    { name: 'Sales follow-ups', body: 'Leads who went quiet hear from you again.', glyph: 'reply' },
    { name: 'Review requests', body: 'Asked for automatically after completed work.', glyph: 'star' },
    { name: 'Invoice follow-ups', body: 'Less time chasing unpaid invoices.', glyph: 'invoice' },
    { name: 'Reactivation', body: 'Reconnect with customers who haven’t booked lately.', glyph: 'return' },
  ],
};

export const tools = {
  label: 'Your stack',
  heading: ['Your tools.', 'Connected, not replaced.'],
  sub: 'Scroll to see what we connect.',
  items: [
    { short: 'CRM', title: 'Your CRM', body: 'Contacts, deals and notes update themselves.' },
    { short: 'Calendar', title: 'Your calendar', body: 'New jobs land in the calendar your team already checks.' },
    { short: 'Email', title: 'Your email', body: 'Replies, estimates and reminders go out on time.' },
    { short: 'Forms', title: 'Your forms', body: 'Every enquiry is captured and routed the moment it lands.' },
    { short: 'Website', title: 'Your website', body: 'Booking happens on your own site.' },
    { short: 'Chat', title: 'Your chat tools', body: 'Your team gets a nudge in the app they already use.' },
    { short: 'Internal', title: 'Your internal systems', body: 'What you built in house stays. We connect it.' },
  ],
};

export const process = {
  label: 'How it works',
  heading: ['From first call', 'to autopilot.'],
  steps: [
    { title: 'Find the biggest problems', body: '60 minutes on how your business actually runs and where it costs you most.' },
    { title: 'Get a clear plan', body: 'What we recommend automating, how it works, how long it takes, what it costs.' },
    { title: 'We build it', body: 'Connected to the software your business already relies on.' },
    { title: 'We keep it running', body: 'Monitoring, fixes and improvements on a monthly retainer.' },
  ],
};

export const work = {
  label: 'Case study',
  heading: ['Proof,', 'not promises.'],
  client: 'Divos Detailing',
  where: 'Auto detailing, Houston',
  problem: 'Bookings ran through a third-party website. Customer details and scheduling were tracked by hand.',
  automated: ['Booking on their own website', 'Google Calendar integration', 'CRM automation'],
  result: 'Booking now lives on their own site. Calendar and CRM stay in sync without anyone touching them.',
  outcomes: [
    { k: 'Booking', v: 'On their own website' },
    { k: 'Calendar', v: 'Always in sync' },
    { k: 'CRM', v: 'Updated automatically' },
  ],
};

export const why = {
  label: 'Why Seqnc',
  heading: ['Built around', 'how you actually work.'],
  items: [
    { name: 'Practical', body: 'Real processes, real time saved.' },
    { name: 'Yours', body: 'Workflows shaped to your business, not a generic system.' },
    { name: 'Compatible', body: 'The tools your team already uses, wherever possible.' },
    { name: 'Fast', body: 'Most projects are live in two to four weeks.' },
    { name: 'Supported', body: 'Monitored and improved as you grow.' },
    { name: 'Start small', body: 'Begin with the one thing costing you most.' },
  ],
};

export const faq = {
  label: 'Questions',
  heading: ['Questions,', 'answered.'],
  items: [
    { q: 'What is business automation?', a: 'Software and connected systems completing repetitive tasks automatically, instead of someone on your team doing them by hand.' },
    { q: 'Who do you work with?', a: 'Service businesses: home services, trades, contractors, agencies and professional services.' },
    { q: 'Do I need to replace my current software?', a: 'Usually not. We build around what you already use.' },
    { q: 'Do I need to be technical?', a: 'No. We handle the technical work and explain it in plain terms.' },
    { q: 'How long does a project take?', a: 'Most are built within two to four weeks.' },
    { q: 'Can I start with one automation?', a: 'Yes. We recommend starting with the process costing you most.' },
    { q: 'What if something breaks?', a: 'Monitoring and fixes are included in the monthly retainer.' },
    { q: 'Is there a long-term contract?', a: 'The retainer can be cancelled without penalty, subject to your agreement.' },
  ],
};

export const book = {
  label: 'Final step',
  heading: ['See what you', 'could automate.'],
  sub: 'A free 60-minute review of how your business runs, where it leaks time, and what to automate first.',
  cta: { label: 'Book your free review', href: 'mailto:hello@seqnc.ai' },
  note: 'No commitment. Clear answers.',
};

export const footer = {
  line: 'Business automation for service businesses.',
  services: [
    { label: 'Lead automation', href: '#automations' },
    { label: 'Workflow automation', href: '#automations' },
    { label: 'Follow-up automation', href: '#automations' },
    { label: 'CRM automation', href: '#capabilities' },
    { label: 'Scheduling', href: '#capabilities' },
  ],
  company: [
    { label: 'How it works', href: '#process' },
    { label: 'Case study', href: '#work' },
    { label: 'Questions', href: '#faq' },
    { label: 'Book a review', href: '#book' },
  ],
  legal: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }],
};
