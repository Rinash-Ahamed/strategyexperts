/**
 * Single source of truth for site content.
 * Everything here is taken from the supplied Strategy Experts documents.
 * Nothing is invented: no client names, testimonials, awards or contact details.
 */

import { normalizeSiteUrl } from "./site-url";

const contactEmails = (
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Info.strategyexperts@gmail.com,Info@strategyexperts.in"
).split(",").map((email) => email.trim()).filter(Boolean);

export const SITE = {
  name: "Strategy Experts",
  tagline: "Digital Growth Partners",
  description:
    "Strategy Experts helps restaurants, hotels, e-commerce brands and local businesses perform better through platform expertise, revenue strategy and hands-on execution.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  phone: "+919037870007",
  phoneDisplay: "+91 9037870007",
  instagram: "https://www.instagram.com/strategy.experts?exln=MWZpbmR0NTNzY3J5Mw%3D%3D&utm_source=qr",
  emails: contactEmails,
  email: contactEmails.join(","),
  showMetrics: process.env.NEXT_PUBLIC_SHOW_METRICS === "true",
};

export type Metric = { value: string; label: string };

export type Faq = { q: string; a: string };

export type Step = { title: string; body: string };

export type ServiceTheme = "ecom" | "restaurant" | "hotel" | "digital";

export type Service = {
  slug: string;
  theme: ServiceTheme;
  name: string;
  navName: string;
  metaTitle: string;
  metaDescription: string;
  headline: string[];
  intro: string;
  /** Platforms named in the supplied documents */
  platforms: string[];
  /** Short line for homepage showcase */
  summary: string;
  /** Concise capability list (homepage + page) */
  capabilities: string[];
  problemsTitle: string;
  problems: { title: string; body: string }[];
  deliverablesTitle: string;
  deliverablesIntro: string;
  deliverables: { title: string; body: string }[];
  focusTitle: string;
  focus: { title: string; body: string }[];
  approachTitle: string;
  approach: Step[];
  approachLayout: "columns" | "stack";
  audienceTitle: string;
  audience: string[];
  /** Figures transcribed from screenshots. Only shown when NEXT_PUBLIC_SHOW_METRICS=true. */
  metricsTitle: string;
  metricsIntro: string;
  metrics: Metric[];
  faqTitle: string;
  faqIntro: string;
  faqCta: string;
  faqs: Faq[];
  closing: { headline: string; body: string };
};

export const SERVICES: Service[] = [
  {
    slug: "e-commerce-support",
    theme: "ecom",
    name: "E-Commerce Support",
    navName: "E-Commerce Support",
    metaTitle: "E-Commerce Support for Amazon, Flipkart & Meesho",
    metaDescription:
      "Account management, listing optimisation and sales growth strategy for brands and sellers on Amazon, Flipkart and Meesho.",
    headline: ["More visibility.", "Better listings.", "Higher sales."],
    intro:
      "End-to-end e-commerce consulting, account management, product optimisation and performance-driven strategy for brands and sellers on Amazon, Flipkart and Meesho.",
    platforms: ["Amazon", "Flipkart", "Meesho"],
    summary:
      "From account setup to sales growth, we manage the marketplace details so you can focus on scaling the business.",
    capabilities: [
      "Marketplace account management",
      "Product listing optimisation",
      "Sales & revenue growth strategy",
      "Promotions & visibility",
      "Performance monitoring",
    ],
    problemsTitle: "Selling online is easy to start. Hard to do well.",
    problems: [
      {
        title: "Listings that don’t get found",
        body: "Weak titles, descriptions, images and keywords hold back discoverability on crowded marketplaces.",
      },
      {
        title: "Traffic that doesn’t convert",
        body: "Product pages that don’t persuade turn visits into lost orders instead of sales.",
      },
      {
        title: "Missed promotional opportunities",
        body: "Campaigns, deals and marketplace tools go unused when no one is steering them.",
      },
      {
        title: "Inconsistent account management",
        body: "Account health, issue resolution and day-to-day operations need steady, hands-on attention.",
      },
    ],
    deliverablesTitle: "What we take on",
    deliverablesIntro:
      "From account setup to sales growth, we manage the details so you can focus on scaling your business.",
    deliverables: [
      {
        title: "E-commerce account management",
        body: "Complete account setup, health monitoring and issue resolution.",
      },
      {
        title: "Product listing & optimisation",
        body: "Compelling titles, descriptions, images and keyword optimisation for better visibility.",
      },
      {
        title: "Sales & revenue growth strategies",
        body: "Data-driven strategies to improve rankings, traffic and conversions.",
      },
      {
        title: "Marketplace performance monitoring",
        body: "Track performance, analyse trends and take proactive actions.",
      },
      {
        title: "Promotional & visibility strategies",
        body: "Campaigns, deals and marketplace tools to boost your sales.",
      },
    ],
    focusTitle: "Your growth. Our expertise.",
    focus: [
      {
        title: "Better search rankings",
        body: "Improve product discoverability through listing and keyword optimisation.",
      },
      {
        title: "Higher conversion rates",
        body: "Strengthen product pages to turn more visits into orders.",
      },
      {
        title: "Increased sales & revenue",
        body: "Use marketplace insights and campaigns to support sales growth.",
      },
      {
        title: "Long-term brand growth",
        body: "Build sustainable marketplace performance and brand presence.",
      },
    ],
    approachTitle: "A structured process for sustainable e-commerce growth",
    approachLayout: "columns",
    approach: [
      {
        title: "Understand",
        body: "We analyse your products, target audience, category and market position.",
      },
      {
        title: "Optimise",
        body: "We improve listings, keywords, images and product content.",
      },
      {
        title: "Strategise",
        body: "We create growth plans based on data, market trends and competitor analysis.",
      },
      {
        title: "Execute",
        body: "We implement campaigns, optimise pricing and manage platform operations.",
      },
      {
        title: "Monitor & improve",
        body: "We track performance, measure results and continuously refine strategies.",
      },
    ],
    audienceTitle: "For every e-commerce business",
    audience: [
      "D2C brands",
      "Established brands",
      "Small & medium sellers",
      "New market entrants",
    ],
    metricsTitle: "Real growth. Measurable results.",
    metricsIntro:
      "Figures reported for our e-commerce support work across marketplaces.",
    metrics: [
      { value: "100+", label: "Brands & sellers supported" },
      { value: "12+", label: "Marketplaces managed" },
      { value: "₹1.75 Cr+", label: "Client revenue facilitated" },
      { value: "5X", label: "Average sales growth" },
    ],
    faqTitle: "Before your next marketplace move.",
    faqIntro: "Practical answers about marketplace support, listing optimisation and working together.",
    faqCta: "Discuss your marketplace strategy",
    faqs: [
      {
        q: "Which marketplaces do you support?",
        a: "We support brands and sellers on Amazon, Flipkart and Meesho.",
      },
      {
        q: "What does listing optimisation involve?",
        a: "It covers titles, descriptions, images and keyword optimisation, with the aim of improving how easily your products are found and how well product pages convert visits into orders.",
      },
      {
        q: "Is this only account management?",
        a: "No. Alongside account setup, health monitoring and issue resolution, we build growth strategies around rankings, traffic, conversions, promotions and performance monitoring.",
      },
      {
        q: "Who do you work with?",
        a: "D2C brands, established brands, small and medium sellers, and new market entrants.",
      },
      {
        q: "How do we get started?",
        a: "Start a conversation and tell us about your products, category and goals. Scope and next steps are discussed from there.",
      },
    ],
    closing: {
      headline: "More visibility. More sales. More growth.",
      body: "Let’s build a strategy that works for your brand on Amazon, Flipkart and Meesho.",
    },
  },
  {
    slug: "restaurant-consulting",
    theme: "restaurant",
    name: "Restaurant Consulting",
    navName: "Restaurant Consulting",
    metaTitle: "Restaurant Consulting for Zomato & Swiggy",
    metaDescription:
      "Growth strategy, account management, promotions and menu optimisation for restaurants and cloud kitchens on Zomato and Swiggy.",
    headline: ["More visibility.", "Higher orders.", "Greater revenue."],
    intro:
      "We help restaurants grow on Zomato and Swiggy with data-driven strategy, platform expertise and end-to-end execution, turning digital channels into consistent revenue drivers.",
    platforms: ["Zomato", "Swiggy"],
    summary:
      "From your online presence to menus and promotions, we turn Zomato and Swiggy into steady revenue channels.",
    capabilities: [
      "Zomato & Swiggy account management",
      "Promotions & campaign planning",
      "Menu optimisation",
      "Online visibility & reviews",
      "Revenue-growth strategy",
    ],
    problemsTitle: "A listing is not a strategy.",
    problems: [
      {
        title: "Low visibility on the platforms",
        body: "Search ranking and presence decide whether hungry customers ever see your restaurant.",
      },
      {
        title: "Menus that don’t convert",
        body: "Descriptions, images, pricing, add-ons and best-seller positioning all influence what gets ordered.",
      },
      {
        title: "Promotions without a plan",
        body: "Offers and seasonal campaigns work best when they’re targeted and planned, not reactive.",
      },
      {
        title: "Margins lost to guesswork",
        body: "Pricing, promotions and costs need data-led decisions to protect profitability.",
      },
    ],
    deliverablesTitle: "The menu of what we do",
    deliverablesIntro:
      "End-to-end support to help your restaurant perform better on Zomato and Swiggy and across digital channels.",
    deliverables: [
      {
        title: "Restaurant growth & revenue strategies",
        body: "Build the right strategy to increase visibility, attract more customers and improve profitability.",
      },
      {
        title: "Zomato & Swiggy account management",
        body: "Optimise your listings, manage store operations, resolve issues and ensure smooth platform performance.",
      },
      {
        title: "Promotions & campaign planning",
        body: "Run targeted campaigns, special offers and seasonal promotions to drive orders and footfall.",
      },
      {
        title: "Menu optimisation",
        body: "Improve menu descriptions, images, pricing, add-ons and best-seller positioning to boost conversion.",
      },
      {
        title: "Online visibility & performance improvement",
        body: "Enhance search rankings, manage reviews and improve overall platform performance.",
      },
    ],
    focusTitle: "More than platform management.",
    focus: [
      {
        title: "Higher order volume",
        body: "Improve order generation through focused platform strategies.",
      },
      {
        title: "Improved ratings & reviews",
        body: "Strengthen customer experience and reputation.",
      },
      {
        title: "Better profit margins",
        body: "Make data-led decisions around pricing, promotions and costs.",
      },
      {
        title: "Stronger brand presence",
        body: "Improve visibility and consistency across digital channels.",
      },
    ],
    approachTitle: "A structured process for sustainable growth",
    approachLayout: "stack",
    approach: [
      {
        title: "Understand",
        body: "We analyse your current performance, goals and market opportunities.",
      },
      {
        title: "Strategise",
        body: "We create a customised growth plan based on data, trends and business needs.",
      },
      {
        title: "Execute",
        body: "Our team implements the necessary changes across platforms and channels.",
      },
      {
        title: "Monitor",
        body: "We track performance in real time and measure impact.",
      },
      {
        title: "Optimise",
        body: "We refine strategies continuously for better results and higher revenue.",
      },
    ],
    audienceTitle: "For every kind of food business",
    audience: [
      "Fine dining restaurants",
      "Casual dining & cafés",
      "Cloud kitchens & QSR",
      "Food brands & franchises",
    ],
    metricsTitle: "Real results for restaurants like yours.",
    metricsIntro:
      "Figures reported for our work with restaurants, cloud kitchens and food brands.",
    metrics: [
      { value: "150+", label: "Restaurants & cloud kitchens" },
      { value: "12+", label: "Cities across India" },
      { value: "5X", label: "Average profit increase" },
      { value: "₹1.75 Cr+", label: "Client growth facilitated" },
    ],
    faqTitle: "Behind a stronger restaurant business.",
    faqIntro: "What to expect from menu optimisation, platform support and review management.",
    faqCta: "Discuss your restaurant",
    faqs: [
      {
        q: "Which platforms do you work on?",
        a: "Zomato and Swiggy, along with wider digital channels that support your restaurant’s visibility.",
      },
      {
        q: "What does menu optimisation cover?",
        a: "Menu descriptions, images, pricing, add-ons and best-seller positioning, aimed at improving conversion.",
      },
      {
        q: "Do you help with reviews and ratings?",
        a: "Yes. Online visibility work includes managing reviews and improving overall platform performance, alongside search ranking.",
      },
      {
        q: "Which kinds of food businesses do you work with?",
        a: "Fine dining restaurants, casual dining and cafés, cloud kitchens and QSR, and food brands and franchises.",
      },
      {
        q: "How do we get started?",
        a: "Get in touch with your current situation and goals. We’ll talk through a personalised growth plan for your restaurant.",
      },
    ],
    closing: {
      headline: "Ready to increase your orders and revenue?",
      body: "Start a conversation about a personalised growth plan for your restaurant on Zomato and Swiggy.",
    },
  },
  {
    slug: "hotel-revenue-management",
    theme: "hotel",
    name: "Hotel Revenue Management",
    navName: "Hotel Revenue Management",
    metaTitle: "Hotel Revenue Management & OTA Optimisation",
    metaDescription:
      "OTA management, pricing and inventory, revenue strategy and forecasting for hotels: aimed at better occupancy, ADR and RevPAR.",
    headline: ["Higher occupancy.", "Better rates.", "Greater revenue."],
    intro:
      "We help hotels maximise online revenue through data-driven strategy, expert OTA management and performance-focused execution, from pricing and inventory to visibility and distribution.",
    platforms: [
      "MakeMyTrip",
      "Booking.com",
      "Agoda",
      "Goibibo",
      "Expedia",
      "Cleartrip",
      "EaseMyTrip",
      "Yatra",
    ],
    summary:
      "A specialist service for hotel commercial performance: pricing, distribution and the numbers that matter.",
    capabilities: [
      "OTA platform management",
      "Pricing & inventory management",
      "Revenue strategy & forecasting",
      "Promotion & visibility strategy",
      "Performance monitoring & reporting",
    ],
    problemsTitle: "Rooms don’t sell themselves at the right rate.",
    problems: [
      {
        title: "Occupancy without the right rate",
        body: "Filling rooms matters, but so does the average daily rate you fill them at.",
      },
      {
        title: "Pricing and inventory out of step with demand",
        body: "Rates and availability need to respond to demand rather than sit still.",
      },
      {
        title: "An unbalanced channel mix",
        body: "Distribution across channels needs deliberate strategy to stay balanced and effective.",
      },
      {
        title: "Limited visibility on OTAs",
        body: "Ranking and visibility across OTAs shape how many guests ever reach your property.",
      },
    ],
    deliverablesTitle: "Revenue management, end to end",
    deliverablesIntro:
      "End-to-end support to optimise your distribution, pricing and performance across leading OTA platforms and digital channels.",
    deliverables: [
      {
        title: "OTA platform management",
        body: "Manage and optimise your presence on top OTAs and travel platforms.",
      },
      {
        title: "Pricing & inventory management",
        body: "Dynamic pricing, demand forecasting and inventory optimisation.",
      },
      {
        title: "Promotion & visibility strategy",
        body: "Plan targeted campaigns and improve your ranking and visibility.",
      },
      {
        title: "Revenue strategy & forecasting",
        body: "Data-driven strategies to increase occupancy, ADR and RevPAR.",
      },
      {
        title: "Performance monitoring & reporting",
        body: "Track performance with clear insights and actionable recommendations.",
      },
    ],
    focusTitle: "More than OTA management. A revenue growth partner.",
    focus: [
      {
        title: "Higher occupancy",
        body: "Improve room occupancy through pricing, distribution and visibility strategies.",
      },
      {
        title: "Better ADR & RevPAR",
        body: "Improve average daily rate and revenue per available room.",
      },
      {
        title: "Stronger channel mix",
        body: "Build a balanced and effective distribution strategy across channels.",
      },
      {
        title: "Long-term revenue growth",
        body: "Use ongoing performance analysis to support sustainable growth.",
      },
    ],
    approachTitle: "A structured process for sustainable results",
    approachLayout: "stack",
    approach: [
      {
        title: "Analyse",
        body: "We study your current performance, market trends and competitor positioning.",
      },
      {
        title: "Strategise",
        body: "We build a customised revenue and distribution strategy for your property.",
      },
      {
        title: "Implement",
        body: "We execute changes across OTAs, pricing, inventory and promotions.",
      },
      {
        title: "Monitor",
        body: "We track performance and identify opportunities in real time.",
      },
      {
        title: "Optimise",
        body: "We refine strategies based on data, feedback and market conditions.",
      },
    ],
    audienceTitle: "Hotels of every size, across segments",
    audience: [
      "Business hotels",
      "Resorts & leisure",
      "Boutique hotels",
      "Heritage & independent hotels",
    ],
    metricsTitle: "Measurable results. Real business growth.",
    metricsIntro:
      "Figures reported for our work with hotels, through smarter pricing, better distribution and consistent optimisation.",
    metrics: [
      { value: "150+", label: "Hotels & resorts served" },
      { value: "12+", label: "Cities across India" },
      { value: "₹1.75 Cr+", label: "Client savings facilitated" },
      { value: "5X", label: "Average revenue growth" },
    ],
    faqTitle: "Clarity before your next booking.",
    faqIntro: "A closer look at OTA distribution, pricing, inventory and revenue performance.",
    faqCta: "Discuss your hotel strategy",
    faqs: [
      {
        q: "Which OTAs do you manage?",
        a: "MakeMyTrip, Booking.com, Agoda, Goibibo, Expedia, Cleartrip, EaseMyTrip and Yatra.",
      },
      {
        q: "What do pricing and inventory management include?",
        a: "Dynamic pricing, demand forecasting and inventory optimisation.",
      },
      {
        q: "Which metrics does the service focus on?",
        a: "Occupancy, average daily rate (ADR) and revenue per available room (RevPAR), tracked through performance monitoring and reporting with actionable recommendations.",
      },
      {
        q: "What kinds of hotels do you work with?",
        a: "Business hotels, resorts and leisure properties, boutique hotels, and heritage and independent hotels.",
      },
      {
        q: "How do we get started?",
        a: "Start a conversation about your property and goals. Strategy is built around your performance, market trends and competitor positioning.",
      },
    ],
    closing: {
      headline: "Let’s build a stronger revenue strategy for your hotel.",
      body: "Start a conversation and discover new opportunities to grow your hotel’s revenue.",
    },
  },
  {
    slug: "digital-marketing",
    theme: "digital",
    name: "Digital Marketing & WhatsApp Marketing",
    navName: "Digital Marketing",
    metaTitle: "Digital Marketing, Google Business Profile & WhatsApp",
    metaDescription:
      "Google Business Profile management, reputation and review management, local visibility, lead generation and consent-based WhatsApp marketing support.",
    headline: ["Stronger local presence.", "More customers.", "Greater growth."],
    intro:
      "We help businesses increase their online visibility, build a stronger reputation and attract more customers through expert Google Business Profile management and result-driven digital marketing.",
    platforms: ["Google", "Meta", "WhatsApp"],
    summary:
      "Be found locally, build trust through reviews, and reach customers directly, with permission-based WhatsApp support.",
    capabilities: [
      "Google Business Profile management",
      "Reputation & review management",
      "Local visibility improvement",
      "Customer engagement & lead generation",
      "Consent-based WhatsApp campaigns",
    ],
    problemsTitle: "Customers search first. Are you what they find?",
    problems: [
      {
        title: "An under-used Google presence",
        body: "Incomplete or outdated profile information weakens local search visibility.",
      },
      {
        title: "Reviews left unmanaged",
        body: "Unanswered reviews cost trust that a stronger reputation could build.",
      },
      {
        title: "Searches that don’t become customers",
        body: "Visibility only matters if it turns into engagement, bookings and leads.",
      },
      {
        title: "No direct line to customers",
        body: "Without planned, permission-based messaging, follow-ups and updates rely on chance.",
      },
    ],
    deliverablesTitle: "What we take on",
    deliverablesIntro:
      "Everything you need to improve your online presence, build trust and drive more customers.",
    deliverables: [
      {
        title: "Google Business Profile management",
        body: "Optimise your profile, keep your information updated and improve local search visibility.",
      },
      {
        title: "Online reputation & review management",
        body: "Monitor reviews, respond to customers and build a stronger brand reputation.",
      },
      {
        title: "Local visibility improvement",
        body: "Rank higher in local search and maps to help nearby customers find you.",
      },
      {
        title: "Digital presence optimisation",
        body: "Improve your overall online presence across search, maps and directories.",
      },
      {
        title: "Customer engagement & lead generation",
        body: "Attract, engage and convert potential customers through targeted digital strategies.",
      },
      {
        title: "WhatsApp marketing support",
        body: "Reach customers directly with campaign broadcasts, promotional messages, customer updates and engagement strategies.",
      },
    ],
    focusTitle: "More than visibility. We build real connections.",
    focus: [
      {
        title: "Higher local rankings",
        body: "A well-managed profile helps nearby customers find you.",
      },
      {
        title: "Increased customer engagement",
        body: "Active profiles and responsive review management keep customers engaged.",
      },
      {
        title: "More bookings & leads",
        body: "Strategies that turn online searches into real customers.",
      },
      {
        title: "Stronger brand trust",
        body: "Consistent reputation management builds confidence in your brand.",
      },
      {
        title: "Direct customer reach",
        body: "Planned, permission-based messaging that reaches customers directly.",
      },
    ],
    approachTitle: "A structured process for measurable results",
    approachLayout: "columns",
    approach: [
      {
        title: "Understand",
        body: "We analyse your business, target audience, location and goals.",
      },
      {
        title: "Optimise",
        body: "We enhance your Google Business Profile with accurate information, photos and services.",
      },
      {
        title: "Engage",
        body: "We manage reviews, respond to customers and keep your profile active.",
      },
      {
        title: "Promote",
        body: "We run targeted campaigns, add location-based ads and increase reach and visibility.",
      },
      {
        title: "Improve",
        body: "We track performance, measure results and continuously refine strategies.",
      },
    ],
    audienceTitle: "For businesses that rely on local customers",
    audience: [
      "Restaurants & cafés",
      "Retail stores",
      "Service businesses",
      "Healthcare & clinics",
      "Salons & spas",
      "Other local brands",
    ],
    metricsTitle: "Real growth. Measurable results.",
    metricsIntro:
      "Figures reported for our digital marketing work with local businesses and brands.",
    metrics: [
      { value: "100+", label: "Businesses supported" },
      { value: "12+", label: "Cities across India" },
      { value: "₹1.75 Cr+", label: "Client revenue facilitated" },
      { value: "5X", label: "Average profit increase" },
    ],
    faqTitle: "Before your next campaign.",
    faqIntro: "How local visibility, reviews and permission-based WhatsApp support fit together.",
    faqCta: "Discuss your digital presence",
    faqs: [
      {
        q: "What does Google Business Profile management cover?",
        a: "Optimising your profile, keeping information updated, adding accurate details, photos and services, and improving local search visibility. It sits alongside review management and targeted campaigns.",
      },
      {
        q: "Is WhatsApp marketing permission-based?",
        a: "Yes. The approach is to message customers who have opted in, identify the business clearly, provide an easy opt-out option and follow WhatsApp’s current business messaging policies.",
      },
      {
        q: "What kinds of WhatsApp messages can you support?",
        a: "Promotional campaigns and approved broadcast messages, announcements of new products, services, offers and events, appointment, booking and customer service updates, follow-ups and feedback requests, and lead enquiry workflows.",
      },
      {
        q: "Which businesses do you work with?",
        a: "Restaurants and cafés, retail stores, service businesses, healthcare and clinics, salons and spas, and other local brands.",
      },
      {
        q: "How do we get started?",
        a: "Start a conversation about your business, audience, location and goals, and we’ll take it from there.",
      },
    ],
    closing: {
      headline: "Let’s turn online searches into real customers.",
      body: "Start a conversation and discover how we can help your business get noticed, gain more engagement and drive consistent growth.",
    },
  },
];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);

/** Suggested working framework shown on the homepage (not a formally documented process). */
export const HOME_FRAMEWORK: Step[] = [
  {
    title: "Understand the business",
    body: "Where you are today: your platforms, performance, market and goals.",
  },
  {
    title: "Identify opportunities",
    body: "Where visibility, pricing, listings or promotions are leaving revenue on the table.",
  },
  {
    title: "Build the strategy",
    body: "A plan shaped around data, trends and the realities of your business.",
  },
  {
    title: "Execute and optimise",
    body: "Hands-on implementation, performance tracking and steady refinement.",
  },
];

export const IMPACT_PRINCIPLES: Step[] = [
  {
    title: "Informed decisions",
    body: "Market insight and platform data guide pricing, promotions and priorities, not guesswork.",
  },
  {
    title: "Consistent optimisation",
    body: "Growth on digital platforms is rarely a one-off fix. It comes from steady, data-driven refinement.",
  },
  {
    title: "Measurable performance",
    body: "Tracking and reporting show what is working, so the next decision is better than the last.",
  },
];

export const CHALLENGE = {
  headline: "Your business is online. But is it performing at its potential?",
  body: "Being present on digital platforms is no longer enough. Poor visibility, inefficient pricing, weak listings, missed promotional opportunities and inconsistent platform management can directly affect revenue.",
  pillars: [
    { title: "Visibility", body: "Be found by the right customers." },
    { title: "Performance", body: "Turn traffic into measurable results." },
    { title: "Revenue", body: "Build sustainable business growth." },
  ],
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  ...SERVICES.map((s) => ({
    href: `/services/${s.slug}`,
    label: s.navName,
  })),
];
