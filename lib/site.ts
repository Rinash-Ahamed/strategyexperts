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
  tagline: "Your Growth Partner",
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
    headline: ["Better listings.","Stronger sales."],
    intro:
      "Hands-on marketplace support for Amazon, Flipkart and Meesho, from account health and product listings to promotions and sales strategy.",
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
    deliverablesTitle: "Marketplace support, without the complexity.",
    deliverablesIntro:
      "Four areas of support to keep your store running and your products performing.",
    deliverables: [
      {
        "title": "Account setup & management",
        "body": "Set up accounts, monitor account health and resolve day-to-day marketplace issues."
      },
      {
        "title": "Product listing optimisation",
        "body": "Improve titles, descriptions, images and keywords to help customers find and choose your products."
      },
      {
        "title": "Pricing & promotions",
        "body": "Plan pricing, deals and campaigns around your category, competitors and business goals."
      },
      {
        "title": "Performance & growth strategy",
        "body": "Track rankings, traffic and conversions, then use those insights to refine your sales strategy."
      }
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
    approachTitle: "A clear path to better performance.",
    approachLayout: "columns",
    approach: [
      {
        "title": "Review",
        "body": "Understand your products, category, audience and current marketplace performance."
      },
      {
        "title": "Optimise",
        "body": "Improve listings, pricing and promotions while managing daily account operations."
      },
      {
        "title": "Refine",
        "body": "Review results and adjust the strategy as your business and market change."
      }
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
        "q": "Which marketplaces do you support?",
        "a": "Amazon, Flipkart and Meesho, with account management, listing optimisation, promotions and performance support."
      },
      {
        "q": "What does listing optimisation cover?",
        "a": "Product titles, descriptions, images and keywords, with attention to discoverability and conversion."
      },
      {
        "q": "Who is this for, and how do we start?",
        "a": "D2C brands, established businesses, small and medium sellers, and new market entrants. Tell us about your products and goals to discuss the right scope."
      }
    ],
    closing: {
      headline: "Your next stage of marketplace growth.",
      body: "Tell us about your products and goals. We will help you plan the next steps.",
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
    headline: ["Better visibility.","More orders."],
    intro:
      "Practical support for restaurants and cloud kitchens, combining platform management, menu optimisation, promotions and revenue strategy.",
    platforms: ["Zomato", "Swiggy", "Toing", "Flipkart Minutes"],
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
    deliverablesTitle: "Built around your restaurant.",
    deliverablesIntro:
      "Focused support for the platforms, menus and customer experiences that shape your business.",
    deliverables: [
      {
        "title": "Platform operations",
        "body": "Manage listings, store operations and account issues on Zomato and Swiggy."
      },
      {
        "title": "Menu & pricing strategy",
        "body": "Refine descriptions, images, add-ons and best-seller placement, with pricing and costs in mind."
      },
      {
        "title": "Promotions & campaigns",
        "body": "Plan relevant offers and seasonal campaigns to support orders, visibility and footfall."
      },
      {
        "title": "Reviews & performance",
        "body": "Respond to reviews, monitor platform results and use the insights to guide revenue decisions."
      }
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
    approachTitle: "From insight to everyday execution.",
    approachLayout: "stack",
    approach: [
      {
        "title": "Understand",
        "body": "Review your restaurant, current performance, market and growth priorities."
      },
      {
        "title": "Implement",
        "body": "Put the agreed menu, platform and campaign improvements into action."
      },
      {
        "title": "Improve",
        "body": "Track results and refine pricing, promotions and operations over time."
      }
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
        "q": "Which platforms do you manage?",
        "a": "Zomato and Swiggy, alongside relevant digital channels that support your restaurant's visibility."
      },
      {
        "q": "Do you support menus and customer reviews?",
        "a": "Yes. We refine menu content, pricing, add-ons and best-seller placement, and support review responses and reputation management."
      },
      {
        "q": "Which food businesses can get started?",
        "a": "Fine dining restaurants, casual dining and cafes, cloud kitchens, QSRs, food brands and franchises. Share your current situation and goals to discuss a suitable plan."
      }
    ],
    closing: {
      headline: "Make your next growth move.",
      body: "Tell us about your restaurant. We will help you identify where to focus next.",
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
    headline: ["Smarter rates.","Stronger revenue."],
    intro:
      "Revenue support for hotels through OTA management, responsive pricing and a balanced distribution strategy, guided by your market and performance.",
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
    deliverablesTitle: "Your revenue essentials, managed.",
    deliverablesIntro:
      "Coordinated support for distribution, pricing, visibility and commercial performance.",
    deliverables: [
      {
        "title": "OTA & distribution management",
        "body": "Manage listings and channel presence across the travel platforms your guests use."
      },
      {
        "title": "Pricing & inventory",
        "body": "Align rates and availability with demand, competitor positioning and your property's goals."
      },
      {
        "title": "Promotions & visibility",
        "body": "Plan targeted offers and platform improvements to strengthen your property's visibility."
      },
      {
        "title": "Revenue strategy & reporting",
        "body": "Forecast demand and track occupancy, average daily rate and revenue per available room to guide decisions."
      }
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
    approachTitle: "A focused approach to hotel revenue.",
    approachLayout: "stack",
    approach: [
      {
        "title": "Analyse",
        "body": "Review your property's performance, market demand and competitor positioning."
      },
      {
        "title": "Implement",
        "body": "Apply the agreed pricing, inventory, distribution and promotion strategy."
      },
      {
        "title": "Optimise",
        "body": "Monitor commercial results and refine the plan as market conditions change."
      }
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
        "q": "Which OTAs do you manage?",
        "a": "MakeMyTrip, Booking.com, Agoda, Goibibo, Expedia, Cleartrip, EaseMyTrip and Yatra."
      },
      {
        "q": "How do you assess revenue performance?",
        "a": "We track occupancy, average daily rate (ADR) and revenue per available room (RevPAR), alongside demand and channel performance."
      },
      {
        "q": "Which properties do you work with?",
        "a": "Business hotels, resorts, boutique hotels, and heritage and independent properties. Share your market and goals to discuss a tailored revenue strategy."
      }
    ],
    closing: {
      headline: "A stronger revenue strategy starts here.",
      body: "Tell us about your property and goals. Let us explore the opportunities together.",
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
    headline: ["Be found.", "Build connections."],
    intro:
      "Grow your local visibility, build trust and reach the right customers through search, Google and Meta campaigns, and permission-based WhatsApp marketing.",
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
    deliverablesTitle: "Your digital presence, connected.",
    deliverablesIntro:
      "Focused support across the channels your customers use.",
    deliverables: [
      { title: "Search & local visibility", body: "An accurate, active Google Business Profile and a consistent presence across search, maps and directories." },
      { title: "Reputation & reviews", body: "Thoughtful review responses and customer engagement that build trust in your business." },
      { title: "Google & Meta campaigns", body: "Targeted campaigns to reach relevant customers, generate enquiries and track what works." },
      { title: "WhatsApp marketing", body: "Opt-in offers, updates and follow-ups that keep your customers connected." },
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
    approachTitle: "Clear direction. Consistent progress.",
    approachLayout: "columns",
    approach: [
      { title: "Understand", body: "Review your audience, local presence and business goals." },
      { title: "Connect", body: "Optimise profiles, manage reviews and launch focused campaigns." },
      { title: "Improve", body: "Track enquiries and engagement, then refine the strategy." },
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
      { q: "What does the service cover?", a: "Google Business Profile management, reviews, local visibility, Google and Meta campaigns, and permission-based WhatsApp support." },
      { q: "Is WhatsApp marketing permission-based?", a: "Yes. We work with opted-in customers, identify your business clearly and include an easy opt-out." },
      { q: "How do we get started?", a: "Tell us about your business, location and goals. We will recommend the channels and support that fit." },
    ],
    closing: {
      headline: "Let’s turn online searches into real customers.",
      body: "Tell us about your business. Let’s find the right channels for your next stage of growth.",
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
  body: "Digital presence alone isn't enough. Poor visibility, pricing, listings, promotions, and platform management can cost you revenue.",
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
