export type ServiceDetails = {
  headline: string;
  accent: string;
  intro: string;
  platformsTitle: string;
  servicesTitle: string;
  servicesIntro: string;
  services: { title: string; body: string }[];
  benefitsTitle: string;
  benefitsIntro: string;
  benefitsContext?: string;
  benefits: { title: string; body: string }[];
  processTitle: string;
  process: { title: string; body: string }[];
  audienceTitle: string;
  audience: { title: string; body: string }[];
  closingTitle: string;
  closingBody?: string;
  impact?: { value: string; label: string }[];
};

// Supplied service documents, excluding their unverified metrics/testimonial
// and reference-site navigation/footer instructions.
export const SERVICE_DETAILS: Partial<Record<string, ServiceDetails>> = {
  "restaurant-consulting": {
    headline: "More Visibility. Higher Orders.", accent: "Greater Revenue.",
    intro: "We help restaurants grow on Zomato and Swiggy through data-driven strategies, platform expertise and hands-on support. From menus and promotions to daily operations, we help turn digital channels into stronger revenue opportunities.",
    platformsTitle: "Platform Expertise. Connected to Your Restaurant.",
    servicesTitle: "Restaurant Management & Growth Services",
    servicesIntro: "From online growth to daily operations, one coordinated team keeps your restaurant moving forward.",
    services: [
      { title: "Online Growth & Management Support", body: "Bring strategy, platform management and performance optimisation together to grow your restaurant online." },
      { title: "Dedicated Point of Contact", body: "A single point of contact (SPOC) keeps communication clear and coordinates your support." },
      { title: "Loss Prevention & Revenue Protection", body: "A dedicated team helps identify revenue leakage, review deductions and follow up on issues." },
      { title: "End-to-End Online Operations", body: "Keep listings, menus, promotions and platform operations running smoothly." },
      { title: "Reputation & Review Management", body: "Monitor feedback, respond to customers and strengthen your online reputation." },
      { title: "24×7 Late-Night Order Support", body: "Get order-related support around the clock, including late-night operations." },
      { title: "Regular Performance Reviews", body: "Review progress, priorities and opportunities through in-person and virtual meetings." },
    ],
    benefitsTitle: "Built Around Your Business. Designed for Your Team.",
    benefitsIntro: "A flexible, data-driven platform that supports every level of restaurant management. Customise alerts, performance triggers and settings to fit your operations.",
    benefitsContext: "Bring owners, store and area managers, operations, marketing and aggregator teams together with shared insights. Streamline workflows, strengthen coordination and make better-informed decisions.",
    benefits: [],
    processTitle: "A Structured Process for Sustainable Growth",
    process: [
      { title: "Understand", body: "We analyse your current performance, goals and market opportunities." },
      { title: "Strategise", body: "We create a customised growth plan based on data, trends and business needs." },
      { title: "Execute", body: "Our team implements the necessary changes across platforms and channels." },
      { title: "Monitor", body: "We track performance in real time and measure impact." },
      { title: "Optimise", body: "We refine strategies continuously for better results and higher revenue." },
    ],
    impact: [{ value: "500+", label: "Businesses Served" }, { value: "45+", label: "Cities" }, { value: "5X", label: "Profit Increase" }],
    audienceTitle: "For Every Kind of Food Business",
    audience: [
      { title: "Fine Dining Restaurants", body: "Strengthen your digital presence while keeping your guest experience at the centre." },
      { title: "Casual Dining & Cafés", body: "Connect local visibility, customer engagement and everyday operations." },
      { title: "Cloud Kitchens & QSR", body: "Keep delivery operations, menus and performance working together." },
      { title: "Food Brands & Franchises", body: "Coordinate teams and benchmark performance across outlets." },
    ],
    closingTitle: "Ready to Increase Your Orders & Revenue?",
    closingBody: "Get a free consultation and a personalised growth plan for your restaurant.",
  },
  "digital-marketing": {
    headline: "Stronger Local Presence. More Customers.", accent: "Greater Growth.",
    intro: "We help businesses increase their online visibility, build a stronger reputation and attract more customers through expert Google Business Profile management and result-driven digital marketing strategies.",
    platformsTitle: "Google. Meta. WhatsApp.",
    servicesTitle: "Our Digital Marketing Services",
    servicesIntro: "Everything you need to improve your online presence, build trust and drive more customers.",
    services: [
      { title: "Google Business Profile Management", body: "Optimise your profile, keep your information updated and improve local search visibility." },
      { title: "Online Reputation & Review Management", body: "Monitor reviews, respond to customers and build a stronger brand reputation." },
      { title: "Local Visibility Improvement", body: "Improve visibility in local search and maps to help nearby customers find you." },
      { title: "Digital Presence Optimisation", body: "Improve your overall online presence across search, maps and directories." },
      { title: "Customer Engagement & Lead Generation", body: "Attract, engage and convert potential customers through targeted digital strategies." },
      { title: "WhatsApp Marketing Support", body: "Reach opted-in customers with planned broadcasts, promotional messages, updates and engagement strategies." },
    ],
    benefitsTitle: "More Than Visibility. We Build Real Connections.",
    benefitsIntro: "We go beyond just setting up your Google Business Profile. Our team optimises your profile, manages your reputation and implements strategies that turn online searches into real customers.",
    benefits: [
      { title: "Higher Local Rankings", body: "Strengthen your presence in local search and maps." },
      { title: "Increased Customer Engagement", body: "Keep your profile active and respond to your customers." },
      { title: "More Bookings & Leads", body: "Help interested customers find and contact your business." },
      { title: "Stronger Brand Trust", body: "Build your reputation through consistent review management." },
      { title: "Direct Customer Reach", body: "Stay connected through relevant, permission-based messages." },
    ],
    processTitle: "A Structured Process for Measurable Results",
    process: [
      { title: "Understand", body: "We analyse your business, target audience, location and goals." },
      { title: "Optimise", body: "We enhance your Google Business Profile with accurate information, photos and services." },
      { title: "Engage", body: "We manage reviews, respond to customers and keep your profile active." },
      { title: "Promote", body: "We run targeted campaigns, add location-based ads and increase reach and visibility." },
      { title: "Improve", body: "We track performance, measure results and continuously refine strategies." },
    ],
    audienceTitle: "For Businesses Built Around Local Customers",
    audience: [
      { title: "Restaurants & Cafés", body: "Help nearby diners discover and connect with your business." },
      { title: "Retail Stores", body: "Make your products, location and business details easier to find." },
      { title: "Service Businesses", body: "Connect local searches with relevant enquiries." },
      { title: "Healthcare & Clinics", body: "Keep your location, hours and service information accurate." },
      { title: "Salons & Spas", body: "Build visibility and engagement around your services." },
      { title: "Other Local Brands", body: "Strengthen your presence in the communities you serve." },
    ],
    closingTitle: "Let’s Turn Online Searches Into Real Customers.",
    closingBody: "Get a free consultation and discover new ways to reach more customers.",
  },
  "e-commerce-support": {
    headline: "More Visibility. Better Listings.", accent: "Higher Sales.",
    intro: "We help brands and sellers grow on Amazon, Flipkart and Meesho with end-to-end e-commerce consulting, account management, product optimisation and performance-driven strategies.",
    platformsTitle: "Three Platforms. Endless Opportunities.",
    servicesTitle: "Our E-Commerce Support Services",
    servicesIntro: "From account setup to sales growth, we manage the details so you can focus on scaling your business.",
    services: [
      { title: "E-Commerce Account Management", body: "Complete account setup, health monitoring and issue resolution." },
      { title: "Product Listing & Optimisation", body: "Compelling titles, descriptions, images and keyword optimisation for better visibility." },
      { title: "Sales & Revenue Growth Strategies", body: "Data-driven strategies to improve rankings, traffic and conversions." },
      { title: "Marketplace Performance Monitoring", body: "Track performance, analyse trends and take proactive actions." },
      { title: "Promotional & Visibility Strategies", body: "Campaigns, deals and marketplace tools to boost your sales." },
    ],
    benefitsTitle: "Your Growth. Our Expertise.",
    benefitsIntro: "We go beyond account management. Our team understands marketplace algorithms, customer behaviour and competition - and builds strategies that help you improve visibility, increase conversions and scale your revenue.",
    benefits: [
      { title: "Better Search Rankings", body: "Improve product discoverability through listing and keyword optimisation." },
      { title: "Higher Conversion Rates", body: "Strengthen product pages to turn more visits into orders." },
      { title: "Increased Sales & Revenue", body: "Use marketplace insights and campaigns to support sales growth." },
      { title: "Long-Term Brand Growth", body: "Build sustainable marketplace performance and brand presence." },
    ],
    processTitle: "A Structured Process for Sustainable E-Commerce Growth",
    process: [
      { title: "Understand", body: "We analyse your products, target audience, category and market position." },
      { title: "Optimise", body: "We improve listings, keywords, images and product content." },
      { title: "Strategise", body: "We create growth plans based on data, market trends and competitor analysis." },
      { title: "Execute", body: "We implement campaigns, optimise pricing and manage platform operations." },
      { title: "Monitor & Improve", body: "We track performance, measure results and continuously refine strategies." },
    ],
    audienceTitle: "For Every E-Commerce Business",
    audience: [
      { title: "D2C Brands", body: "Bring your brand to more marketplace customers." },
      { title: "Established Brands", body: "Strengthen visibility and scale with a clearer plan." },
      { title: "Small & Medium Sellers", body: "Make everyday marketplace operations work harder." },
      { title: "New Market Entrants", body: "Build a stronger foundation for your first listings." },
    ],
    closingTitle: "More Visibility. More Sales. More Growth.",
    closingBody: "Get a free consultation and discover new opportunities to grow your brand.",
  },
  "hotel-revenue-management": {
    headline: "Higher Occupancy. Better Rates.", accent: "Greater Revenue.",
    intro: "We help hotels maximise their online revenue through data-driven strategies, expert OTA management and performance-focused execution. From pricing and inventory to visibility and distribution, we turn your digital channels into consistent revenue drivers.",
    platformsTitle: "Manage & Optimise Across Leading OTAs",
    servicesTitle: "Hotel Revenue Management Services",
    servicesIntro: "End-to-end support to optimise your distribution, pricing and performance across leading OTA platforms and digital channels.",
    services: [
      { title: "OTA Platform Management", body: "Manage and optimise your presence on top OTAs and travel platforms." },
      { title: "Pricing & Inventory Management", body: "Dynamic pricing, demand forecasting and inventory optimisation." },
      { title: "Promotion & Visibility Strategy", body: "Plan targeted campaigns and improve your ranking and visibility." },
      { title: "Revenue Strategy & Forecasting", body: "Data-driven strategies to increase occupancy, average daily rate (ADR) and revenue per available room (RevPAR)." },
      { title: "Performance Monitoring & Reporting", body: "Track performance with clear insights and actionable recommendations." },
    ],
    benefitsTitle: "More Than OTA Management. A Revenue Growth Partner.",
    benefitsIntro: "We go beyond account management. Our team combines industry expertise, market insights and data-driven strategies to help you increase visibility, improve performance and maximise revenue.",
    benefits: [
      { title: "Higher Occupancy", body: "Improve room occupancy through pricing, distribution and visibility strategies." },
      { title: "Better ADR & RevPAR", body: "Improve average daily rate and revenue per available room." },
      { title: "Stronger Channel Mix", body: "Build a balanced and effective distribution strategy across channels." },
      { title: "Long-Term Revenue Growth", body: "Use ongoing performance analysis to support sustainable growth." },
    ],
    processTitle: "A Structured Process for Sustainable Results",
    process: [
      { title: "Analyse", body: "We study your current performance, market trends and competitor positioning." },
      { title: "Strategise", body: "We build a customised revenue and distribution strategy for your property." },
      { title: "Implement", body: "We execute changes across OTAs, pricing, inventory and promotions." },
      { title: "Monitor", body: "We track performance and identify opportunities in real time." },
      { title: "Optimise", body: "We refine strategies based on data, feedback and market conditions." },
    ],
    audienceTitle: "Hotels of Every Size, Across Segments",
    audience: [
      { title: "Business Hotels", body: "Align pricing and availability with business travel demand." },
      { title: "Resorts & Leisure", body: "Respond to seasonal demand and leisure travel opportunities." },
      { title: "Boutique Hotels", body: "Strengthen the visibility of your distinctive guest experience." },
      { title: "Heritage & Independent Hotels", body: "Build a balanced distribution strategy for your property." },
    ],
    closingTitle: "Let’s Build a Stronger Revenue Strategy for Your Hotel.",
    closingBody: "Get a free consultation and discover new opportunities to grow your hotel’s revenue.",
  },
};
