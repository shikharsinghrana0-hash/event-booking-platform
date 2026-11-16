/**
 * EventPulse - Dynamic Events Database
 * Realistic, high-resolution curated events across diverse categories.
 */

const INITIAL_EVENTS = [
  {
    id: "evt-001",
    title: "Neon Horizon Electronic Music Festival 2026",
    slug: "neon-horizon-electronic-music-festival",
    category: "music",
    categoryLabel: "Concerts & Music",
    date: "2026-12-18",
    time: "18:00 - 02:00",
    venue: "Solaria Open Air Arena",
    address: "88 Harbor Boulevard, Waterfront District",
    city: "San Francisco, CA",
    type: "in-person",
    featured: true,
    trending: true,
    rating: 4.9,
    reviewsCount: 342,
    minPrice: 65,
    maxPrice: 280,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80",
    badge: "SELLING FAST",
    capacity: 5000,
    bookedSeats: 4420,
    shortDescription: "Experience an electrifying night of synthwave, melodic techno, and breathtaking laser visuals with world-renowned electronic DJs.",
    fullDescription: "Neon Horizon is the premiere futuristic electronic music gathering on the West Coast. Featuring three immersive stages—The Cyberdome, The Pulse Valley, and The Horizon Deck—this year's festival integrates volumetric 3D stage mapping, spatial sound design, and an unparalleled lineup of international trailblazers. Dance under the starlit coastal sky with custom light sculptures, gourmet artisan food villages, and craft cocktail lounges.",
    organizer: {
      name: "PulseWave Productions",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Crafting sensory festival experiences across North America and Europe since 2018.",
      eventsHosted: 48,
      rating: 4.95
    },
    ticketTiers: [
      { id: "tier-ga", name: "General Admission", price: 65, perks: ["Access to all 3 stages", "Complimentary festival wristband", "Access to food & beverage zones"], available: 210 },
      { id: "tier-vip", name: "VIP Experience Pass", price: 150, perks: ["Expedited VIP entry lane", "Elevated viewing deck with premium sound", "Private climate-controlled restrooms", "2 Free artisan drink coupons"], available: 45 },
      { id: "tier-backstage", name: "All-Access Backstage", price: 280, perks: ["Backstage lounge access", "Artist meet & greet photo op", "Exclusive merchandise gift pack", "Open craft bar & gourmet dining"], available: 12 }
    ],
    schedule: [
      { time: "18:00 - 19:30", title: "Doors Open & Ambient Sunset Chillout", artist: "DJ Solar Drift", stage: "Horizon Deck" },
      { time: "19:30 - 21:00", title: "Cyber-Funk & Future Bass Live Set", artist: "KINETIX", stage: "The Pulse Valley" },
      { time: "21:00 - 23:00", title: "Atmospheric Melodic Techno", artist: "Astral Mind", stage: "The Cyberdome" },
      { time: "23:00 - 01:30", title: "Headliner: Neon Symphony Grand Finale", artist: "CYBERPULSE feat. Live Strings", stage: "Main Cyberdome" },
      { time: "01:30 - 02:00", title: "Laser Afterglow Countdown", artist: "Collective Encores", stage: "Main Cyberdome" }
    ],
    speakers: [
      { name: "CYBERPULSE", role: "Headlining Electronic Producer", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80" },
      { name: "Astral Mind", role: "Melodic Techno Pioneer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
      { name: "DJ Solar Drift", role: "Ambient & Synth Artist", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "Is there an age restriction?", a: "Yes, this event is 18+ for General Admission and 21+ for VIP pass holders with ID check at the gates." },
      { q: "What is the refund policy?", a: "Full refunds are available up to 7 days before the event date. Tickets can also be transferred to another person via the portal." },
      { q: "Are outside food or drinks permitted?", a: "Outside food and beverages are not allowed, but empty reusable water containers are welcomed at free refill stations." }
    ]
  },
  {
    id: "evt-002",
    title: "Global AI & Neural Systems Summit 2026",
    slug: "global-ai-neural-systems-summit",
    category: "tech",
    categoryLabel: "Tech & AI",
    date: "2026-11-28",
    time: "09:00 - 18:30",
    venue: "Metropolitan Tech Pavilion & Auditorium",
    address: "500 Innovation Way, Silicon Park",
    city: "San Jose, CA",
    type: "hybrid",
    featured: true,
    trending: true,
    rating: 4.96,
    reviewsCount: 512,
    minPrice: 120,
    maxPrice: 450,
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    badge: "TOP RATED",
    capacity: 2500,
    bookedSeats: 2210,
    shortDescription: "Join 2,500+ top researchers, founders, and engineers deciphering Autonomous Agents, Multimodal Intelligence, and Silicon Hardware.",
    fullDescription: "The Global AI & Neural Systems Summit brings together the minds engineering the next frontier of artificial intelligence. Explore 4 dedicated research tracks: Autonomous Agent Frameworks, Multimodal Cognitive Architectures, Next-Gen Semiconductor Acceleration, and AI Safety & Governance. Network with tier-1 venture capitalists, Fortune 500 CTOs, and pioneering academic fellows.",
    organizer: {
      name: "Neural Frontiers Institute",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Leading non-profit think-tank and technology summit organizer for machine learning innovations.",
      eventsHosted: 24,
      rating: 4.98
    },
    ticketTiers: [
      { id: "tier-virtual", name: "Virtual Livestream Pass", price: 120, perks: ["Full 4K interactive live stream access", "On-demand recordings for 12 months", "Digital networking lounge access", "Speaker slide decks & code repos"], available: 450 },
      { id: "tier-summit", name: "In-Person Summit Pass", price: 290, perks: ["Full access to all 4 conference tracks", "Buffet lunch & networking breakfast", "Expo floor & hands-on demo pods", "Exclusive attendee reception ticket"], available: 95 },
      { id: "tier-executive", name: "Executive VIP & Dinner", price: 450, perks: ["All Summit Pass perks included", "Reserved front-row keynote seating", "Private VIP Founder & Speaker Dinner", "1-on-1 VC & CTO matchmaking sessions"], available: 18 }
    ],
    schedule: [
      { time: "09:00 - 09:30", title: "Registration, Coffee & AI Hardware Showcase", artist: "Welcome Team", stage: "Grand Foyer" },
      { time: "09:30 - 10:45", title: "Keynote: Beyond Transformers to Autonomous Cognitive Systems", artist: "Dr. Elena Rostova", stage: "Main Hall" },
      { time: "11:00 - 12:30", title: "Panel: Scaling Laws, Compute Efficiency & Future Architectures", artist: "Industry Leaders", stage: "Main Hall" },
      { time: "12:30 - 14:00", title: "Networking Lunch & Interactive Robotics Demos", artist: "All Attendees", stage: "Exhibition Pavillion" },
      { time: "14:00 - 16:00", title: "Technical Deep-Dives: Multimodal Reasoning & Agentic Workflows", artist: "Marcus Vance & Team", stage: "Track A & B" },
      { time: "16:30 - 18:30", title: "VIP Networking Cocktail & Startup Pitch Showcase", artist: "Featured Founders", stage: "Skyline Terrace" }
    ],
    speakers: [
      { name: "Dr. Elena Rostova", role: "Chief AI Scientist, CogniScale", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" },
      { name: "Marcus Vance", role: "VP of Autonomous Agents, NexusAI", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
      { name: "Aria Chen", role: "Partner, DeepTech Ventures", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "Is virtual participation interactive?", a: "Yes, virtual attendees have access to real-time Q&A, digital breakout rooms, and virtual booth chats." },
      { q: "Can I receive an invoice for corporate reimbursement?", a: "Instantly upon booking, an official VAT-compliant receipt and PDF invoice is generated for your expense report." }
    ]
  },
  {
    id: "evt-003",
    title: "Artisan Wine & Michelin Gastronomy Gala",
    slug: "artisan-wine-gastronomy-gala",
    category: "food",
    categoryLabel: "Food & Wine",
    date: "2026-12-05",
    time: "17:00 - 22:30",
    venue: "The Glasshouse Conservatory",
    address: "120 Napa Valley Crest",
    city: "Napa, CA",
    type: "in-person",
    featured: true,
    trending: false,
    rating: 4.88,
    reviewsCount: 189,
    minPrice: 95,
    maxPrice: 220,
    coverImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80",
    badge: "EXCLUSIVE",
    capacity: 600,
    bookedSeats: 512,
    shortDescription: "An exquisite 7-course culinary journey orchestrated by 5 Michelin-starred master chefs paired with heritage vintage wines.",
    fullDescription: "Indulge in a sensory evening of culinary brilliance. Set inside the breathtaking illuminated Glasshouse Conservatory surrounded by heritage vineyards, five acclaimed master chefs present an extraordinary multi-course tasting menu. Each course is accompanied by master sommelier pairings from premier private reserve cellars, accompanied by live classical cello and jazz harmonies.",
    organizer: {
      name: "Culinary Heritage Society",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Curating Michelin-grade dining experiences and masterclasses worldwide.",
      eventsHosted: 36,
      rating: 4.92
    },
    ticketTiers: [
      { id: "tier-tasting", name: "Wine Tasting & Hors d'oeuvres", price: 95, perks: ["Tasting flights of 12 reserve wines", "Artisan cheese & charcuterie board", "Souvenir crystal tasting glass"], available: 50 },
      { id: "tier-grand-dinner", name: "Full 7-Course Chef Gala", price: 180, perks: ["Complete 7-course Michelin tasting menu", "Grand Cru wine pairings for every dish", "Reserved dining table in conservatory", "Live cello and jazz performances"], available: 25 },
      { id: "tier-chef-table", name: "Chef's Private Table VIP", price: 220, perks: ["Front-row seat at the open kitchen counter", "Direct interaction with master chefs", "Rare cellar vintage tasting", "Personalized signed cookbook"], available: 8 }
    ],
    schedule: [
      { time: "17:00 - 18:00", title: "Welcome Sparkling Reception & Vineyard Stroll", artist: "Sommelier Jean-Luc", stage: "Vineyard Terrace" },
      { time: "18:00 - 19:30", title: "First Flight: Ocean Delicacies & Rare Whites", artist: "Chef Matteo Rossi", stage: "Grand Glasshouse" },
      { time: "19:30 - 21:00", title: "Second Flight: Dry-Aged Truffle Infusions & Reserve Reds", artist: "Chef Simone LeClair", stage: "Grand Glasshouse" },
      { time: "21:00 - 22:30", title: "Artisan Dessert Showcase & Vintage Port Toast", artist: "Pastry Chef Yuka Sato", stage: "Lounge Pavilion" }
    ],
    speakers: [
      { name: "Matteo Rossi", role: "3-Star Michelin Chef, Florence", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80" },
      { name: "Simone LeClair", role: "Master Sommelier & Author", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "Can dietary restrictions or allergies be accommodated?", a: "Yes! Vegan, gluten-free, and nut-free custom pairings can be selected during the booking checkout form." }
    ]
  },
  {
    id: "evt-004",
    title: "Immersive Van Gogh & Digital Lumina Exhibition",
    slug: "immersive-van-gogh-digital-lumina",
    category: "arts",
    categoryLabel: "Arts & Theatre",
    date: "2026-11-20",
    time: "10:00 - 21:00 (Hourly Slots)",
    venue: "Luminary Digital Arts Center",
    address: "740 Arts Boulevard, Downtown",
    city: "Seattle, WA",
    type: "in-person",
    featured: false,
    trending: true,
    rating: 4.91,
    reviewsCount: 420,
    minPrice: 35,
    maxPrice: 85,
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80",
    badge: "FAMILY FRIENDLY",
    capacity: 1200,
    bookedSeats: 890,
    shortDescription: "Step inside moving masterpieces with 360-degree floor-to-ceiling projections, spatial audio, and interactive brushstroke installations.",
    fullDescription: "Wander through breathtaking interactive digital landscapes where Vincent van Gogh's iconic brushstrokes come to life all around you. Covering over 30,000 square feet of projection space with 4K laser projectors and synchronized acoustic orchestrations, this exhibition invites visitors of all ages to immerse themselves in Starry Night, Sunflowers, and The Bedroom in Arles like never before.",
    organizer: {
      name: "Luminary Arts Collective",
      avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Global creators of monumental digital experiential art exhibitions.",
      eventsHosted: 19,
      rating: 4.89
    },
    ticketTiers: [
      { id: "tier-child", name: "Child / Student Ticket", price: 35, perks: ["Full exhibition entry", "Interactive VR drawing booth access"], available: 120 },
      { id: "tier-standard", name: "Standard Adult Pass", price: 48, perks: ["Full 75-minute exhibition walkthrough", "Interactive sensory room access", "Commemorative poster print"], available: 180 },
      { id: "tier-flex-vip", name: "VIP Anytime & VR Experience", price: 85, perks: ["Flexible arrival time (skip scheduled slot)", "Priority express entry", "Exclusive VR headset journey through Arles", "Limited edition art tote bag"], available: 35 }
    ],
    schedule: [
      { time: "10:00 - 12:00", title: "Morning Calm Walkthrough & Ambient Chamber Music", artist: "Open Galleries", stage: "Main Gallery" },
      { time: "13:00 - 16:00", title: "Afternoon Interactive Light Sculpting Sessions", artist: "Resident Artists", stage: "Lab Space" },
      { time: "17:00 - 21:00", title: "Lumina Nightfall: Starry Night Synchronized Light Show", artist: "Curator Projection Team", stage: "Grand Dome" }
    ],
    speakers: [
      { name: "Dr. Clara Moreau", role: "Chief Curator & Digital Historian", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "Is photography permitted?", a: "Yes! Non-commercial flash-free photography and video recording are fully encouraged." },
      { q: "Is the venue wheelchair accessible?", a: "100% ADA compliant with elevator access and dedicated quiet viewing benches throughout." }
    ]
  },
  {
    id: "evt-005",
    title: "Apex Esports World Championship Grand Finals",
    slug: "apex-esports-world-championship",
    category: "sports",
    categoryLabel: "Sports & Gaming",
    date: "2026-12-12",
    time: "14:00 - 22:00",
    venue: "CyberArena Coliseum",
    address: "101 Olympic Drive",
    city: "Los Angeles, CA",
    type: "hybrid",
    featured: true,
    trending: true,
    rating: 4.94,
    reviewsCount: 780,
    minPrice: 45,
    maxPrice: 195,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    badge: "HOT",
    capacity: 8000,
    bookedSeats: 7200,
    shortDescription: "The world's top 16 professional teams clash in the ultimate battle arena for a $3,000,000 championship trophy.",
    fullDescription: "Witness hyper-competitive esports at its peak! The world's top pro squads face off live inside the legendary CyberArena Coliseum. Featuring massive 360-degree LED overhead jumbotrons, thunderous spatial game audio, instant player heart-rate telemetry, live shoutcasting by fan-favorite casters, and exclusive in-game digital loot drops for every ticket holder.",
    organizer: {
      name: "Global Esports League (GEL)",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "The premier international federation producing tier-1 competitive esports championships.",
      eventsHosted: 62,
      rating: 4.96
    },
    ticketTiers: [
      { id: "tier-upper", name: "Coliseum Bowl Seating", price: 45, perks: ["Tiered bowl arena seat", "Exclusive in-game champion skin code", "Event clapper banner"], available: 400 },
      { id: "tier-floor", name: "Arena Floor & Soundstage", price: 95, perks: ["Main arena floor close-up seating", "Free championship lanyard & pin set", "Fast-track entrance gate"], available: 90 },
      { id: "tier-vip-meet", name: "Pro Fanatics VIP Pass", price: 195, perks: ["Front row player booth seating", "VIP Player Lounge & autograph session", "Official team jersey of choice", "Exclusive press conference pass"], available: 15 }
    ],
    schedule: [
      { time: "14:00 - 15:00", title: "Opening Ceremony & Virtual Reality Hologram Reveal", artist: "League Production", stage: "Main Stage" },
      { time: "15:00 - 17:30", title: "Semifinal Showdown: North America vs Asia-Pacific", artist: "Team Titan vs Phoenix", stage: "Arena Pods" },
      { time: "18:00 - 21:00", title: "Grand Final: Best-of-7 Championship Decider", artist: "Finalist Contenders", stage: "Main Stage" },
      { time: "21:00 - 22:00", title: "Trophy Presentation & MVP Awards Ceremony", artist: "League Officials", stage: "Center Stage" }
    ],
    speakers: [
      { name: "Jack 'Zero' Sterling", role: "Lead Esports Shoutcaster", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "How do I claim my in-game digital loot codes?", a: "Your exclusive promo code will be printed directly on your digital ticket and sent to your email after booking." }
    ]
  },
  {
    id: "evt-006",
    title: "Venture Capital & Tech Founders Pitch Summit 2026",
    slug: "venture-capital-founders-pitch-summit",
    category: "business",
    categoryLabel: "Business & Networking",
    date: "2026-11-25",
    time: "08:30 - 17:00",
    venue: "Meridian Financial Center Tower",
    address: "200 Wall Street Plaza, 42nd Floor",
    city: "New York, NY",
    type: "in-person",
    featured: false,
    trending: false,
    rating: 4.87,
    reviewsCount: 164,
    minPrice: 150,
    maxPrice: 499,
    coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=80",
    badge: "CAREER BOOSTER",
    capacity: 500,
    bookedSeats: 430,
    shortDescription: "Connect with 80+ top tier angel investors, venture funds with $5B+ AUM, and breakout tech startup founders raising seed to Series B.",
    fullDescription: "Where capital meets audacious vision. The Founders Pitch Summit curates 50 pre-screened breakout technology startups pitching live to Managing Partners from Sequoia, Benchmark, Andreessen, and leading corporate funds. Features 1-on-1 curated office hours, tactical keynote sessions on IPO prep, governance, and private fundraising teardowns.",
    organizer: {
      name: "Apex Venture Alliance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Connecting high-growth startups with global venture ecosystems.",
      eventsHosted: 15,
      rating: 4.93
    },
    ticketTiers: [
      { id: "tier-attendee", name: "Professional Observer Pass", price: 150, perks: ["Full access to pitch stages and panel discussions", "Breakfast networking & executive lunch", "Access to attendee networking directory"], available: 40 },
      { id: "tier-founder", name: "Startup Founder & Pitch Pass", price: 299, perks: ["All Observer Pass benefits", "Guaranteed 3-minute stage pitch slot", "Direct inclusion in Investor Deal Book sent to 200+ VCs", "Dedicated demo pod in exhibition hall"], available: 12 },
      { id: "tier-investor", name: "Accredited Investor All-Access", price: 499, perks: ["Private VIP Investor Lounge with barista", "Full access to confidential pitch decks & financials", "Priority seating during all pitch sessions", "Exclusive closed-door partner dinner"], available: 10 }
    ],
    schedule: [
      { time: "08:30 - 09:30", title: "Breakfast Networking & Registration", artist: "Host Committee", stage: "Sky Lounge" },
      { time: "09:30 - 11:30", title: "Session 1: AI Infrastructure & Enterprise SaaS Pitches", artist: "Cohort Alpha", stage: "Auditorium A" },
      { time: "11:45 - 13:00", title: "Keynote: Navigating Macro Tech Valuations in 2026", artist: "Managing Partners Panel", stage: "Auditorium A" },
      { time: "13:00 - 14:15", title: "Executive Lunch & 1-on-1 Speed Matchmaking", artist: "All Attendees", stage: "Banquet Hall" },
      { time: "14:15 - 16:30", title: "Session 2: BioTech, Clean Energy & Robotics Pitches", artist: "Cohort Beta", stage: "Auditorium B" },
      { time: "16:30 - 17:00", title: "Closing Deals & Sundowner Networking Reception", artist: "Host Committee", stage: "Terrace Bar" }
    ],
    speakers: [
      { name: "Nathaniel Drake", role: "General Partner, Summit Capital", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
      { name: "Sophia Sterling", role: "Founding Partner, Quantum Ventures", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "What is the dress code?", a: "Business casual to smart formal is recommended." }
    ]
  },
  {
    id: "evt-007",
    title: "Broadway Nights: Starlight Musical Symphony",
    slug: "broadway-nights-starlight-musical-symphony",
    category: "arts",
    categoryLabel: "Arts & Theatre",
    date: "2026-12-24",
    time: "19:30 - 22:30",
    venue: "Majestic Grand Theatre",
    address: "242 West 45th Street",
    city: "New York, NY",
    type: "in-person",
    featured: false,
    trending: true,
    rating: 4.95,
    reviewsCount: 310,
    minPrice: 55,
    maxPrice: 240,
    coverImage: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1600&q=80",
    badge: "HOLIDAY SPECIAL",
    capacity: 1800,
    bookedSeats: 1650,
    shortDescription: "A mesmerizing Christmas Eve celebration featuring award-winning Broadway vocalists, a 60-piece orchestra, and timeless showtunes.",
    fullDescription: "Experience the magic of theatre during the festive winter holidays. An extraordinary ensemble of Tony-award winning Broadway lead vocalists take the stage accompanied by the 60-piece New York Philharmonic Pops Orchestra. Revisit showstopping anthems from Phantom of the Opera, Les Misérables, Wicked, Hamilton, and holiday classics under the gilded chandeliers of the Majestic Grand Theatre.",
    organizer: {
      name: "Starlight Theatrical Guild",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Presenting premier symphonic theatrical productions across historic Broadway stages.",
      eventsHosted: 28,
      rating: 4.97
    },
    ticketTiers: [
      { id: "tier-balcony", name: "Balcony Tier", price: 55, perks: ["Full view balcony seat", "Digital program booklet"], available: 65 },
      { id: "tier-orchestra", name: "Orchestra Stalls", price: 120, perks: ["Prime ground floor orchestra seating", "Printed commemorative collector's program", "Glass of champagne at intermission"], available: 32 },
      { id: "tier-royal-box", name: "Royal Private Box VIP", price: 240, perks: ["Private box seating for up to 4 guests", "Pre-show backstage tour and champagne toast", "Post-show meet & greet with lead vocalists", "Valet parking voucher"], available: 6 }
    ],
    schedule: [
      { time: "18:45 - 19:30", title: "Doors Open & Orchestra Tuning", artist: "Orchestra", stage: "Main Stage" },
      { time: "19:30 - 20:45", title: "Act I: The Golden Age of Broadway Classics", artist: "Broadway Soloists", stage: "Main Stage" },
      { time: "20:45 - 21:15", title: "Intermission & Champagne Service", artist: "All Guests", stage: "Crystal Foyer" },
      { time: "21:15 - 22:30", title: "Act II: Contemporary Showstoppers & Holiday Finale", artist: "Full Company Ensemble", stage: "Main Stage" }
    ],
    speakers: [
      { name: "Vivienne Cross", role: "Tony-Winning Soprano", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "Is coat check available?", a: "Yes, complimentary heated coat check is provided in the main lobby." }
    ]
  },
  {
    id: "evt-008",
    title: "Pacific Coast Half Marathon & Wellness Festival",
    slug: "pacific-coast-half-marathon-wellness",
    category: "sports",
    categoryLabel: "Sports & Fitness",
    date: "2026-11-22",
    time: "06:30 - 14:00",
    venue: "Oceanview Promenade & Pier",
    address: "1000 Coastal Highway",
    city: "Santa Monica, CA",
    type: "in-person",
    featured: false,
    trending: false,
    rating: 4.85,
    reviewsCount: 420,
    minPrice: 40,
    maxPrice: 110,
    coverImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80",
    badge: "OUTDOOR",
    capacity: 4000,
    bookedSeats: 3450,
    shortDescription: "Run along the breathtaking sun-drenched Pacific coastline, followed by an oceanfront yoga festival, recovery lounges, and DJ sound bath.",
    fullDescription: "Embrace the energy of the coast! Whether you're aiming for a personal record on the USATF-certified fast and flat oceanfront course or joining the 5K community fun run, every participant finishes at the vibrant Wellness Village on the beach. Enjoy cryotherapy recovery pods, electrolyte nutrition bars, oceanfront meditation, and live acoustic recovery sessions.",
    organizer: {
      name: "Coastline Athletics Club",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      verified: true,
      bio: "Organizing premier scenic endurance races and wellness experiences across California.",
      eventsHosted: 22,
      rating: 4.88
    },
    ticketTiers: [
      { id: "tier-5k", name: "5K Community Fun Run", price: 40, perks: ["Official event tech t-shirt", "Finisher medal", "Hydration pack & bib", "Access to wellness village"], available: 180 },
      { id: "tier-half", name: "Official Half Marathon (21K)", price: 75, perks: ["USATF chip timing & live tracking", "Cast metal heavyweight medal", "Oceanfront recovery smoothie", "Free digital race photography"], available: 95 },
      { id: "tier-wellness-vip", name: "VIP Runner & Spa Recovery", price: 110, perks: ["All Half Marathon perks", "VIP Gear drop lounge", "Post-race sports massage session (20m)", "Reserved oceanfront brunch buffet"], available: 20 }
    ],
    schedule: [
      { time: "06:00 - 06:45", title: "Warmup Yoga & Gear Drop", artist: "Coastline Coaches", stage: "Beach Stage" },
      { time: "07:00", title: "Half Marathon Wave 1 Gun Starts", artist: "Elite Runners", stage: "Starting Arch" },
      { time: "07:30", title: "5K Fun Run Wave Starts", artist: "Open Runners", stage: "Starting Arch" },
      { time: "09:00 - 14:00", title: "Oceanfront Recovery Festival, Medals & Live Music", artist: "DJ Sound Bath", stage: "Wellness Village" }
    ],
    speakers: [
      { name: "Coach Dave Miller", role: "Olympic Marathon Trainer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" }
    ],
    faqs: [
      { q: "Where do I pick up my race bib?", a: "Bibs can be picked up at the Expo on Friday and Saturday, or on race morning from 5:30 AM at the registration tent." }
    ]
  }
];

// LocalStorage helpers for persistence
const EVENTS_STORAGE_KEY = "eventpulse_events_data";
const BOOKINGS_STORAGE_KEY = "eventpulse_user_bookings";
const WISHLIST_STORAGE_KEY = "eventpulse_user_wishlist";
const USER_STORAGE_KEY = "eventpulse_active_user";

function getStoredEvents() {
  const local = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Failed to parse stored events", e);
    }
  }
  // Initialize with initial events
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
  return INITIAL_EVENTS;
}

function saveEvents(events) {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
}

function getStoredBookings() {
  const local = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

function getStoredWishlist() {
  const local = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
}

function getActiveUser() {
  const local = localStorage.getItem(USER_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setActiveUser(user) {
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

// Currency Conversion & Formatting Utilities (USD $ & INR ₹)
const CURRENCY_STORAGE_KEY = "eventpulse_currency";
const EXCHANGE_RATE_USD_TO_INR = 83; // 1 USD = 83 INR

function getStoredCurrency() {
  return localStorage.getItem(CURRENCY_STORAGE_KEY) || "INR";
}

function saveStoredCurrency(curr) {
  localStorage.setItem(CURRENCY_STORAGE_KEY, curr);
}

function getConvertedValue(amountInUSD, currency = null) {
  const curr = currency || getStoredCurrency();
  if (curr === "INR") {
    return Math.round(amountInUSD * EXCHANGE_RATE_USD_TO_INR);
  }
  return amountInUSD;
}

function formatPrice(amountInUSD, currency = null) {
  if (amountInUSD === 0) return "FREE";
  const curr = currency || getStoredCurrency();
  if (curr === "INR") {
    const val = Math.round(amountInUSD * EXCHANGE_RATE_USD_TO_INR);
    return `₹${val.toLocaleString('en-IN')}`;
  }
  return `$${Math.round(amountInUSD).toLocaleString('en-US')}`;
}

function formatCurrencyAmount(amount, currency = null) {
  const curr = currency || getStoredCurrency();
  if (curr === "INR") {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  return `$${Number(amount).toFixed(2)}`;
}
