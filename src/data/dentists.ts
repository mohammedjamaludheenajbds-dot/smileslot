export interface Dentist {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  clinicName: string;
  address: string;
  area: string;
  phone: string;
  whatsapp: string;
  website: string;
  image: string;
  achievements: string[];
  treatments: string[];
  about: string;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  procedure: string[];
  idaFixedCost: { min: number; max: number };
  materials: Material[];
  duration: string;
  videoUrl?: string;
}

export interface Material {
  name: string;
  type: string;
  costAddon: number;
  description: string;
}

export const dentists: Dentist[] = [
  {
    id: "dr-kumar",
    name: "Dr. Senthil Kumar R.",
    qualification: "BDS, MDS (Prosthodontics)",
    specialization: "Prosthodontics & Implantology",
    experience: 18,
    rating: 4.8,
    reviewCount: 342,
    clinicName: "Erode Dental Care Centre",
    address: "45, Brough Road, Erode - 638001",
    area: "Brough Road",
    phone: "+91 94433 12345",
    whatsapp: "+91 94433 12345",
    website: "https://erodedental.in",
    image: "/placeholder.svg",
    achievements: [
      "Best Dentist Award - IDA Erode Branch 2022",
      "Published 12 research papers in implantology",
      "Fellow of International Congress of Oral Implantologists (FICOI)",
      "Performed 3000+ successful implant surgeries"
    ],
    treatments: ["Dental Implants", "Crowns & Bridges", "Complete Dentures", "Teeth Whitening"],
    about: "Dr. Senthil Kumar is a renowned prosthodontist in Erode with over 18 years of experience in dental implants and full mouth rehabilitation."
  },
  {
    id: "dr-priya",
    name: "Dr. Priya Lakshmi M.",
    qualification: "BDS, MDS (Orthodontics)",
    specialization: "Orthodontics & Dentofacial Orthopedics",
    experience: 12,
    rating: 4.9,
    reviewCount: 289,
    clinicName: "SmileLine Orthodontic Clinic",
    address: "12, Perundurai Road, Erode - 638009",
    area: "Perundurai Road",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    website: "https://smilelineclinic.com",
    image: "/placeholder.svg",
    achievements: [
      "Gold Medalist - Tamil Nadu Dr. MGR Medical University",
      "Invisalign Certified Provider - Diamond Level",
      "Best Orthodontist - Erode District 2023",
      "Trained 500+ dentists in orthodontic workshops"
    ],
    treatments: ["Braces (Metal & Ceramic)", "Invisalign", "Retainers", "Jaw Correction"],
    about: "Dr. Priya is a leading orthodontist specializing in invisible aligners and complex bite corrections with a patient-first approach."
  },
  {
    id: "dr-rajesh",
    name: "Dr. Rajesh Kannan S.",
    qualification: "BDS, MDS (Oral Surgery)",
    specialization: "Oral & Maxillofacial Surgery",
    experience: 22,
    rating: 4.7,
    reviewCount: 456,
    clinicName: "Erode Maxillofacial Centre",
    address: "78, EVN Road, Erode - 638003",
    area: "EVN Road",
    phone: "+91 97867 54321",
    whatsapp: "+91 97867 54321",
    website: "https://erodemaxfac.com",
    image: "/placeholder.svg",
    achievements: [
      "Fellow of Royal College of Surgeons (FRCS)",
      "Pioneer of minimally invasive wisdom tooth surgery in Erode",
      "20+ years of surgical excellence",
      "Speaker at 50+ national conferences"
    ],
    treatments: ["Wisdom Tooth Extraction", "Dental Implants", "Jaw Surgery", "Cyst Removal"],
    about: "Dr. Rajesh is a highly experienced oral surgeon known for painless extractions and complex jaw surgeries in Erode district."
  },
  {
    id: "dr-meena",
    name: "Dr. Meenakshi D.",
    qualification: "BDS, MDS (Pedodontics)",
    specialization: "Pediatric Dentistry",
    experience: 10,
    rating: 4.9,
    reviewCount: 198,
    clinicName: "Little Smiles Kids Dental",
    address: "23, Gandhiji Road, Erode - 638001",
    area: "Gandhiji Road",
    phone: "+91 93456 78901",
    whatsapp: "+91 93456 78901",
    website: "https://littlesmileserode.com",
    image: "/placeholder.svg",
    achievements: [
      "Best Pediatric Dentist - IDA South Zone 2023",
      "Child-friendly clinic design award",
      "Published author on pediatric dental anxiety management",
      "Treated 5000+ children"
    ],
    treatments: ["Pit & Fissure Sealants", "Fluoride Treatment", "Pulpotomy", "Space Maintainers"],
    about: "Dr. Meenakshi specializes in making dental visits fun for children with a gentle, caring approach and a fully themed kids clinic."
  },
  {
    id: "dr-arjun",
    name: "Dr. Arjun Balaji V.",
    qualification: "BDS, MDS (Endodontics)",
    specialization: "Conservative Dentistry & Endodontics",
    experience: 15,
    rating: 4.8,
    reviewCount: 312,
    clinicName: "Precision Root Canal Centre",
    address: "56, Mettur Road, Erode - 638011",
    area: "Mettur Road",
    phone: "+91 94567 89012",
    whatsapp: "+91 94567 89012",
    website: "https://precisionrct.in",
    image: "/placeholder.svg",
    achievements: [
      "Microscope-Enhanced Endodontics Pioneer in Erode",
      "Success rate of 98.5% in root canal treatments",
      "Advanced training from University of Pennsylvania",
      "IDA Fellowship in Endodontics"
    ],
    treatments: ["Root Canal Treatment", "Re-Root Canal", "Tooth Colored Fillings", "Post & Core"],
    about: "Dr. Arjun is an endodontic specialist known for painless single-sitting root canals using advanced microscope technology."
  },
  {
    id: "dr-kavitha",
    name: "Dr. Kavitha Sundaram P.",
    qualification: "BDS, MDS (Periodontics)",
    specialization: "Periodontics & Laser Dentistry",
    experience: 14,
    rating: 4.6,
    reviewCount: 267,
    clinicName: "Erode Gum Care & Laser Centre",
    address: "34, Cauvery Road, Bhavani, Erode - 638301",
    area: "Bhavani",
    phone: "+91 96543 21098",
    whatsapp: "+91 96543 21098",
    website: "https://erodegumcare.com",
    image: "/placeholder.svg",
    achievements: [
      "Laser Dentistry Certification from Austria",
      "Best Periodontist Award - IDA Erode 2021",
      "Published research on laser-assisted gum surgery",
      "Trained in advanced bone grafting techniques"
    ],
    treatments: ["Gum Surgery", "Laser Treatment", "Bone Grafting", "Deep Cleaning"],
    about: "Dr. Kavitha is a periodontist and laser dentistry expert offering advanced gum treatments with minimal pain and faster recovery."
  },
  {
    id: "dr-abimanyu",
    name: "Dr. Abhimanyu",
    qualification: "BDS, MDS (Prosthodontics & Cosmetic Dentistry)",
    specialization: "Cosmetic Dentistry & Implantology",
    experience: 15,
    rating: 4.7,
    reviewCount: 185,
    clinicName: "Dr. Abhimanyu Dental Clinic",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 85710 76969",
    whatsapp: "+91 85710 76969",
    website: "https://drabhi.in",
    image: "/placeholder.svg",
    achievements: [
      "15+ years of comprehensive dental care experience",
      "Advanced rotary endodontic & digital X-ray technology",
      "Specialist in smile makeovers & cosmetic transformations",
      "Patient-focused gentle care approach"
    ],
    treatments: ["Root Canal Treatment", "Smile Makeovers", "Dental Implants", "Crowns & Bridges", "Braces & Aligners", "Cosmetic Dentistry"],
    about: "Dr. Abhimanyu Dental Clinic (drabhi.in) offers comprehensive, personalized dental care using advanced rotary instruments and digital X-rays for precision and comfort. Specializing in root canal treatments, smile makeovers, implants, crowns, and orthodontics with a gentle, patient-first approach."
  },
];

export const treatments: Treatment[] = [
  {
    id: "scaling",
    name: "Teeth Cleaning & Scaling",
    category: "Preventive",
    description: "Professional removal of plaque, tartar, and stains from teeth surfaces. Essential for maintaining oral hygiene and preventing gum disease.",
    procedure: [
      "Initial oral examination and assessment",
      "Ultrasonic scaling to remove calculus deposits",
      "Hand scaling for fine tartar removal",
      "Polishing with prophylaxis paste",
      "Fluoride application for enamel strengthening",
      "Oral hygiene instructions and follow-up scheduling"
    ],
    idaFixedCost: { min: 500, max: 1500 },
    materials: [],
    duration: "30-45 minutes"
  },
  {
    id: "root-canal",
    name: "Root Canal Treatment (RCT)",
    category: "Endodontics",
    description: "Treatment to save a severely infected or damaged tooth by removing the infected pulp tissue, cleaning and shaping the root canals, and sealing them.",
    procedure: [
      "Digital X-ray and diagnosis of infected tooth",
      "Local anesthesia administration for pain-free treatment",
      "Rubber dam isolation for sterile environment",
      "Access opening and pulp removal",
      "Root canal cleaning and shaping with rotary instruments",
      "Irrigation with antimicrobial solutions",
      "Obturation (filling) with gutta-percha",
      "Temporary restoration and crown recommendation"
    ],
    idaFixedCost: { min: 2000, max: 8000 },
    materials: [
      { name: "Gutta Percha", type: "Standard", costAddon: 0, description: "Standard root canal filling material with proven biocompatibility" },
      { name: "Bioceramic Sealer", type: "Premium", costAddon: 1500, description: "Advanced biocompatible sealer with superior seal and antibacterial properties" },
      { name: "MTA (Mineral Trioxide Aggregate)", type: "Premium", costAddon: 2000, description: "Gold standard for complex cases, excellent biocompatibility and sealing" }
    ],
    duration: "45-90 minutes per sitting (1-2 sittings)"
  },
  {
    id: "dental-implant",
    name: "Dental Implant",
    category: "Implantology",
    description: "A titanium screw surgically placed into the jawbone to replace a missing tooth root. It provides a permanent foundation for a crown, bridge, or denture.",
    procedure: [
      "Comprehensive assessment with CBCT 3D scan",
      "Treatment planning with digital implant planning software",
      "Surgical placement of titanium implant under local anesthesia",
      "Healing period of 3-6 months for osseointegration",
      "Abutment placement connecting implant to crown",
      "Final crown fabrication and cementation",
      "Follow-up visits for monitoring"
    ],
    idaFixedCost: { min: 20000, max: 50000 },
    materials: [
      { name: "Korean Implant (Osstem/Dentium)", type: "Standard", costAddon: 0, description: "High-quality Korean implant system with excellent clinical results" },
      { name: "Nobel Biocare (Sweden)", type: "Premium", costAddon: 15000, description: "World-leading premium implant with 40+ years of clinical evidence" },
      { name: "Straumann (Switzerland)", type: "Premium", costAddon: 20000, description: "Top-tier Swiss implant with SLActive surface for faster healing" }
    ],
    duration: "3-6 months total (multiple visits)"
  },
  {
    id: "braces",
    name: "Orthodontic Braces",
    category: "Orthodontics",
    description: "Fixed appliances used to correct misaligned teeth, bite problems, and improve dental aesthetics. Treatment duration varies based on complexity.",
    procedure: [
      "Initial consultation and orthodontic records",
      "Digital impressions and cephalometric analysis",
      "Treatment planning and case presentation",
      "Bonding of brackets and archwire placement",
      "Monthly adjustment visits for wire changes",
      "Debonding and retainer placement after treatment completion"
    ],
    idaFixedCost: { min: 25000, max: 80000 },
    materials: [
      { name: "Metal Braces (SS)", type: "Standard", costAddon: 0, description: "Traditional stainless steel braces - most effective and affordable" },
      { name: "Ceramic Braces", type: "Aesthetic", costAddon: 10000, description: "Tooth-colored brackets that blend with natural teeth" },
      { name: "Self-Ligating (Damon)", type: "Premium", costAddon: 20000, description: "Advanced system requiring fewer adjustments and less friction" },
      { name: "Lingual Braces", type: "Invisible", costAddon: 40000, description: "Placed behind teeth - completely hidden from view" }
    ],
    duration: "12-24 months"
  },
  {
    id: "teeth-whitening",
    name: "Teeth Whitening / Bleaching",
    category: "Cosmetic",
    description: "Professional whitening treatment to remove stains and discoloration, making teeth several shades brighter for a confident smile.",
    procedure: [
      "Shade assessment and photography",
      "Teeth cleaning to remove surface stains",
      "Gum protection with barrier application",
      "Whitening gel application on teeth",
      "LED/Laser light activation (3 cycles of 15 minutes)",
      "Post-treatment sensitivity management and care instructions"
    ],
    idaFixedCost: { min: 5000, max: 15000 },
    materials: [
      { name: "Hydrogen Peroxide Gel (Standard)", type: "Standard", costAddon: 0, description: "Professional-grade whitening gel for effective results" },
      { name: "Zoom Whitening System", type: "Premium", costAddon: 5000, description: "Advanced LED-activated system for faster, brighter results" },
      { name: "Laser Whitening", type: "Premium", costAddon: 8000, description: "Cutting-edge laser technology for maximum whitening in one session" }
    ],
    duration: "60-90 minutes"
  },
  {
    id: "crown",
    name: "Dental Crown",
    category: "Prosthodontics",
    description: "A tooth-shaped cap placed over a damaged tooth to restore its shape, size, strength, and appearance. Protects weakened teeth and improves aesthetics.",
    procedure: [
      "Tooth preparation and shade selection",
      "Digital or physical impression taking",
      "Temporary crown placement",
      "Crown fabrication in dental laboratory",
      "Trial fitting and adjustment",
      "Permanent cementation of final crown"
    ],
    idaFixedCost: { min: 2000, max: 15000 },
    materials: [
      { name: "Metal Crown (Base Metal)", type: "Economy", costAddon: 0, description: "Durable metal crown suitable for back teeth" },
      { name: "PFM Crown (Porcelain Fused to Metal)", type: "Standard", costAddon: 2000, description: "Metal strength with porcelain aesthetics" },
      { name: "Zirconia Crown", type: "Premium", costAddon: 5000, description: "Metal-free, natural-looking, extremely strong and biocompatible" },
      { name: "E-max (Lithium Disilicate)", type: "Premium", costAddon: 7000, description: "Most aesthetic option with excellent translucency mimicking natural teeth" }
    ],
    duration: "2-3 visits over 1-2 weeks"
  },
  {
    id: "extraction",
    name: "Tooth Extraction",
    category: "Oral Surgery",
    description: "Removal of a tooth that is severely decayed, damaged, or impacted. Includes simple extractions and surgical removal of wisdom teeth.",
    procedure: [
      "Pre-operative X-ray assessment",
      "Local anesthesia administration",
      "Tooth loosening with elevators",
      "Tooth removal with forceps or surgical technique",
      "Socket cleaning and inspection",
      "Suturing if needed and post-operative instructions"
    ],
    idaFixedCost: { min: 500, max: 5000 },
    materials: [],
    duration: "15-45 minutes"
  },
  {
    id: "denture",
    name: "Complete/Partial Denture",
    category: "Prosthodontics",
    description: "Removable dental prosthesis replacing missing teeth and surrounding tissues. Available as complete dentures (full arch) or partial dentures.",
    procedure: [
      "Initial consultation and treatment planning",
      "Primary and secondary impressions",
      "Jaw relation recording",
      "Trial denture try-in and approval",
      "Final denture processing",
      "Insertion and adjustment visits"
    ],
    idaFixedCost: { min: 5000, max: 25000 },
    materials: [
      { name: "Acrylic Denture", type: "Standard", costAddon: 0, description: "Traditional acrylic denture - lightweight and repairable" },
      { name: "Flexible Denture (Valplast)", type: "Premium", costAddon: 5000, description: "Metal-free flexible material for comfort and aesthetics" },
      { name: "Cast Partial Denture (CoCr)", type: "Premium", costAddon: 8000, description: "Metal framework for precise fit and durability" },
      { name: "BPS Denture (Ivoclar)", type: "Premium", costAddon: 12000, description: "Swiss precision denture system for superior fit and aesthetics" }
    ],
    duration: "4-6 visits over 2-3 weeks"
  },
  {
    id: "filling",
    name: "Tooth Filling / Restoration",
    category: "Conservative",
    description: "Restoration of a decayed or damaged tooth using filling materials. Removes decay and restores tooth function and shape.",
    procedure: [
      "Cavity detection and assessment",
      "Local anesthesia if needed",
      "Decay removal with dental handpiece",
      "Tooth surface preparation and etching",
      "Layer-by-layer filling material placement",
      "Light curing and bite adjustment",
      "Polishing for smooth finish"
    ],
    idaFixedCost: { min: 300, max: 2000 },
    materials: [
      { name: "GIC (Glass Ionomer Cement)", type: "Standard", costAddon: 0, description: "Fluoride-releasing filling ideal for certain areas" },
      { name: "Composite Resin", type: "Aesthetic", costAddon: 500, description: "Tooth-colored filling matching natural tooth shade" },
      { name: "Ceramic Inlay/Onlay", type: "Premium", costAddon: 3000, description: "Lab-made precision restoration for large cavities" }
    ],
    duration: "20-40 minutes"
  },
  {
    id: "veneer",
    name: "Dental Veneers",
    category: "Cosmetic",
    description: "Thin shells of porcelain or composite bonded to front teeth to improve appearance - color, shape, size, or length.",
    procedure: [
      "Smile design consultation and digital planning",
      "Minimal tooth preparation (0.3-0.5mm)",
      "Impression and shade selection",
      "Temporary veneer placement",
      "Lab fabrication of final veneers",
      "Trial bonding and approval",
      "Permanent bonding with dental cement"
    ],
    idaFixedCost: { min: 3000, max: 20000 },
    materials: [
      { name: "Composite Veneer", type: "Standard", costAddon: 0, description: "Direct application, can be done in single visit" },
      { name: "Porcelain Veneer (Feldspathic)", type: "Premium", costAddon: 8000, description: "Handcrafted porcelain for most natural appearance" },
      { name: "E-max Veneer", type: "Premium", costAddon: 10000, description: "Ultra-thin, highly aesthetic pressed ceramic veneer" }
    ],
    duration: "2-3 visits over 1-2 weeks"
  }
];
