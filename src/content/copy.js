/* =========================================================================
   Every word on the site.  Scenes read from here and nowhere else.
   ========================================================================= */

export const brand = {
  name: 'Seqnc',
  domain: 'Seqnc.ai',
  tag: 'Business Automation for Service Businesses',
  status: 'Available for new projects',
  reviewLength: '60 minutes',
};

export const nav = [
  { href: '#what', label: 'What We Do' },
  { href: '#automations', label: 'Automations' },
  { href: '#process', label: 'Process' },
  { href: '#demos', label: 'Demos' },
];

export const hero = {
  label: 'Business automation for service businesses',
  headline: ['We Automate', 'Your Service', 'Business'],
  tags: ['Leads', 'Scheduling', 'Workflows', 'CRM', 'Follow-ups'],
  lede: 'Save time, capture more leads, and cut repetitive work with automation built around the tools you already use.',
  primary: { label: 'Get Your Free Review', href: '#book' },
  secondary: { label: 'See Live Demos', href: '#demos' },
  note: '60 minutes. We identify your biggest time and revenue leaks and show you what can be automated.',
};

export const manifesto = {
  label: 'Our position',
  heading: ['Stop Running', 'Your Business', 'Manually'],
  sub: 'Less manual work. More completed jobs. More time back.',
  stats: [
    { label: 'Free review', value: '60', unit: 'min', note: 'No commitment, clear answers.' },
    { label: 'Build time', value: '2–4', unit: 'wks', note: 'Designed, built and live.' },
    { label: 'Built for', value: '2–20', unit: 'people', note: 'Employee service businesses.' },
    { label: 'Your software', value: 'Kept', unit: '', note: 'We build around your tools.' },
  ],
  body: [
    'Your business should not depend on someone remembering to reply to a lead, follow up on a quote, schedule a job, send an invoice, or contact an old customer.',
    'Seqnc.ai helps service businesses automate repetitive tasks, improve customer response times, and build better business systems. We find where your business is losing time and money, then build the automation systems to fix it.',
  ],
};

export const industries = {
  label: 'Who it is for',
  heading: ['Business Automation', 'Built for', 'Service Businesses'],
  sub: 'We build practical automation for businesses that rely on leads, customers, appointments, projects and repeat business.',
  items: [
    { name: 'Home Services', body: 'Automate lead responses, appointment booking, customer follow-ups, reminders, reviews, and more.' },
    { name: 'Trades & Contracting', body: 'Keep leads, estimates, projects, documents, scheduling, and customer communication organised automatically.' },
    { name: 'Agencies', body: 'Automate client onboarding, project workflows, follow-ups, reporting, and repetitive administrative tasks.' },
    { name: 'Professional Services', body: 'Reduce manual work across lead management, scheduling, client communication, onboarding, and follow-ups.' },
  ],
  note: 'Your business is different. Your automation should be too.',
};

export const problems = {
  label: 'The diagnosis',
  heading: ['Find Where Your', 'Business', 'Is Losing Time'],
  statement: ['Most service businesses do not have a people problem.', 'They have a systems problem.'],
  body: 'Leads go unanswered. Quotes sit in inboxes. Appointments are scheduled manually. Employees forget the next step. Customers are not followed up with. Invoices are chased one by one. These small problems add up quickly.',
  items: [
    'Slow lead responses', 'Missed calls and enquiries', 'Manual quote follow-ups', 'Appointment scheduling',
    'Repetitive data entry', 'Manual customer onboarding', 'Missed internal tasks', 'Invoice follow-ups',
    'Review requests', 'Customer reactivation', 'Referral follow-ups', 'Seasonal customer campaigns',
  ],
  note: 'If someone on your team does the same task repeatedly, there may be a better way.',
};

export const automations = {
  label: 'What we build',
  cta: { label: 'Get Your Free Automation Review', href: '#book' },
  items: [
    {
      eyebrow: 'Lead Automation',
      heading: ['Respond to New Leads', 'Automatically'],
      body: 'Never leave a potential customer waiting for a response. We connect your calls, forms, emails, messages, and other lead sources so new enquiries are handled quickly and consistently.',
      ticks: ['Qualify customers and collect key details', 'Send estimates, next steps and appointments', 'Notify your team and track every lead'],
      mock: 'chart',
    },
    {
      eyebrow: 'Workflow Automation',
      heading: ['Keep Every Job Moving', 'From Yes to Done'],
      body: 'Once a customer says yes, your team should know exactly what happens next. We automate the repetitive steps between winning a customer and completing the work.',
      ticks: ['No sticky notes', 'No forgotten tasks', 'No guessing what happens next'],
      mock: 'flow',
    },
    {
      eyebrow: 'Follow-Up Automation',
      heading: ['Stay Connected', 'With Customers', 'Automatically'],
      body: 'Your previous customers are one of your biggest opportunities for repeat business. We create automated follow-up systems that keep your business in front of customers at the right time.',
      ticks: ['Review and referral requests', 'Repeat service reminders and seasonal offers', 'Win-back and past customer campaigns'],
      mock: 'dash',
    },
  ],
};

export const capabilities = {
  label: 'Capabilities',
  heading: ['What Can You', 'Automate?'],
  sub: 'Almost any repetitive process can be improved.',
  items: [
    { name: 'Lead Management', body: 'Capture, organise, qualify, and follow up with new leads automatically.' },
    { name: 'Appointment Scheduling', body: 'Let customers book while your calendar and team stay organised.' },
    { name: 'CRM Automation', body: 'Keep customer records updated and move leads through your pipeline.' },
    { name: 'Customer Onboarding', body: 'Collect information, send documents, create tasks, prepare your team.' },
    { name: 'Sales Follow-Ups', body: 'Automatically follow up with leads who have not responded or booked.' },
    { name: 'Review Requests', body: 'Ask customers for reviews automatically after completed work.' },
    { name: 'Invoicing Follow-Ups', body: 'Reduce the time your team spends chasing unpaid invoices.' },
    { name: 'Customer Reactivation', body: 'Reconnect with customers who have not booked recently.' },
  ],
  note: 'If it is repetitive, time-consuming, and follows a predictable process, we can probably automate it.',
};

export const tools = {
  label: 'Your stack',
  heading: ['We Build Around', 'Your Existing Tools'],
  sub: 'Nothing gets replaced. Scroll to see what we connect, one tool at a time.',
  items: [
    { short: 'CRM', title: 'Your CRM', body: 'Contacts, deals and notes update themselves. Nobody retypes the same customer twice.' },
    { short: 'Calendar', title: 'Your Calendar', body: 'New jobs drop straight into the calendar your team already checks each morning.' },
    { short: 'Email', title: 'Your Email', body: 'Replies, estimates and reminders go out on time, written in your own words.' },
    { short: 'Forms', title: 'Your Forms', body: 'Every enquiry is captured, sorted and routed to the right person the moment it lands.' },
    { short: 'Website', title: 'Your Website', body: 'Booking happens on your own site instead of a third party page you do not control.' },
    { short: 'Chat', title: 'Your Communication Tools', body: 'Your team gets a nudge in the app they already use the second a job needs attention.' },
    { short: 'Internal', title: 'Your Internal Systems', body: 'The tools you built in house stay exactly where they are. We connect them to the rest.' },
  ],
  note: 'Better systems without rebuilding your entire business.',
};

export const process = {
  label: 'How it works',
  heading: ['How Our Business', 'Automation', 'Process Works'],
  sub: 'Four steps from first conversation to systems that keep running.',
  steps: [
    { title: 'Find the Biggest Problems', body: 'We spend 60 minutes learning how your business actually operates and identify the processes costing you the most.' },
    { title: 'Build Your Automation Plan', body: 'You receive a clear plan showing what we recommend automating, how it works, how long it takes, and what it costs.' },
    { title: 'We Build Your Systems', body: 'We build and connect your automation using the software your business already relies on.' },
    { title: 'We Keep It Running', body: 'We monitor your systems, fix issues, and make improvements through an ongoing monthly retainer.' },
  ],
  note: 'You focus on the business. We keep the systems running.',
};

export const work = {
  label: 'Case study',
  heading: ['Real Business', 'Automation', 'Built to Work'],
  client: 'Divos Detailing',
  where: 'Auto Detailing, Houston',
  body: 'Divos Detailing needed a better way to manage bookings, customers, and scheduling. Their booking experience now lives on their own website, with Google Calendar and CRM systems connected so they work together.',
  before: 'Bookings handled through a third-party website. Customer information and scheduling tracked manually.',
  after: 'Booking lives on their own website, with Google Calendar and CRM connected to work together.',
  ticks: ['Website booking', 'Google Calendar integration', 'CRM automation'],
  cta: { label: 'Get Your Free Automation Review', href: '#book' },
};

export const demos = {
  label: 'Live demos',
  heading: ['See Automation', 'in Action', 'Try Our Live Demos'],
  sub: 'You do not have to imagine what automation could look like.',
  items: [
    { name: 'Lead Automation Demo', body: 'See how a customer can answer a few questions, receive an estimate, and choose an available appointment, without anyone on your team touching it.', link: 'Try the Lead System', href: '#book' },
    { name: 'Operations Automation Demo', body: 'See how a new customer moves through onboarding while tasks and next steps are automatically created for your team.', link: 'Try the Operations System', href: '#book' },
    { name: 'Customer Reactivation Demo', body: 'See how a business can identify past customers who have not returned and automatically send the right follow-up at the right time.', link: 'Try the Follow-Up System', href: '#book' },
  ],
  meta: 'Realistic sample data',
};

export const why = {
  label: 'Why Seqnc',
  heading: ['Why Choose', 'Seqnc.ai?'],
  sub: 'Built for growing service businesses with roughly 2 to 20 employees.',
  items: [
    { name: 'Practical Automation', body: 'We automate real business processes that save your team time and help you capture more opportunities.' },
    { name: 'Built Around Your Business', body: 'We do not force your company into a generic system. Your workflows are built around how you actually work.' },
    { name: 'Use Your Existing Software', body: 'We work with the tools your team already uses whenever possible.' },
    { name: 'Fast Implementation', body: 'Most automation projects can be designed and built within two to four weeks, depending on scope.' },
    { name: 'Ongoing Support', body: 'We monitor your systems and help keep them working as your business grows.' },
    { name: 'Start Small', body: 'You do not need to automate everything. We start with the area creating the biggest problem.' },
  ],
  note: 'You do not need to be technical. You simply need to know where your team is spending too much time.',
};

export const pricing = {
  label: 'Pricing',
  heading: ['How Much Does', 'Business', 'Automation Cost?'],
  sub: 'Every business has different needs, so every project is scoped individually.',
  items: [
    { kind: 'One-time', name: 'Setup Fee', body: 'Covers the initial build of your automation systems.' },
    { kind: 'Monthly', name: 'Retainer', body: 'Monitoring, fixes and improvements as your business changes.' },
  ],
  note: 'After your free review you receive a clear scope, timeline, and price. No vague pricing. No unnecessary packages. No requirement to purchase every system.',
};

export const faq = {
  label: 'Questions',
  heading: ['Frequently Asked', 'Questions'],
  sub: 'Have another question? Please contact our team.',
  items: [
    { q: 'What is business automation?', a: 'Business automation uses software and connected systems to complete repetitive business tasks automatically instead of requiring someone on your team to do them manually.' },
    { q: 'What types of businesses do you work with?', a: 'We primarily work with service businesses such as home service companies, trades, contractors, agencies, and professional service businesses.' },
    { q: 'What can Seqnc.ai automate?', a: 'We can automate lead management, customer follow-ups, scheduling, CRM updates, onboarding, internal workflows, review requests, customer reactivation, and many other repetitive processes.' },
    { q: 'Do I need to replace my current software?', a: 'Usually not. We build around the software your business already uses whenever possible.' },
    { q: 'Do I need to be technical?', a: 'No. We handle the technical work and explain the system in simple terms.' },
    { q: 'How long does an automation project take?', a: 'Most projects are built within two to four weeks, depending on the number and complexity of the systems involved.' },
    { q: 'Can I start with only one automation?', a: 'Yes. We recommend starting with the process that is costing your business the most time or money.' },
    { q: 'What happens if something breaks?', a: 'Ongoing monitoring and fixes are included with the monthly retainer. If an issue comes up, we work to resolve it.' },
    { q: 'Is there a long-term contract?', a: 'You can cancel the monthly retainer without a penalty, subject to the terms of your agreement.' },
  ],
};

export const book = {
  label: 'Final step',
  heading: ['Find Out', 'What You Could', 'Automate'],
  sub: 'Book a free 60-minute business automation review. We will look at how your business operates, identify your biggest time and revenue leaks, and show you which processes could be automated.',
  cta: { label: 'Book Your Free Automation Review', href: '#book' },
  note: '60 minutes. No commitment. Clear answers. You do not need to hire us afterward.',
};

export const footer = {
  body: 'We help service businesses automate leads, scheduling, workflows, customer follow-ups, and repetitive tasks so their teams can save time and focus on the work that matters.',
  services: [
    { label: 'Business Automation', href: '#automations' },
    { label: 'Workflow Automation', href: '#automations' },
    { label: 'Lead Automation', href: '#automations' },
    { label: 'CRM Automation', href: '#capabilities' },
    { label: 'Scheduling Automation', href: '#capabilities' },
    { label: 'Customer Follow-Up Automation', href: '#automations' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
  ],
};
