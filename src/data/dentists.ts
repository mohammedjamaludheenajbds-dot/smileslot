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
    id: "dr-on-ravi",
    name: "Dr. O.N. Ravi",
    qualification: "BDS, MDS",
    specialization: "General & Multispeciality Dentistry",
    experience: 35,
    rating: 4.8,
    reviewCount: 1300,
    clinicName: "Dr. O.N. Ravi Dental Care Center",
    address: "554, Perundurai Road, Edayankattuvalasu, Erode - 638011",
    area: "Perundurai Road",
    phone: "+91 97881 51777",
    whatsapp: "+91 97881 51777",
    website: "https://dronravidental.in",
    image: "/placeholder.svg",
    achievements: [
      "Senior most Dentist in Erode - Since 1987",
      "6-chair multispecialty dental clinic with advanced technology",
      "Over 4,00,000 happy patients treated",
      "In-house X-rays & dental laboratory"
    ],
    treatments: ["Oral & Maxillofacial Surgery", "Invisible Braces", "Teeth Whitening", "Dental Implants", "Laser Dentistry", "Wisdom Tooth Extraction", "Children Dentistry", "Smile Designing"],
    about: "Dr. O.N. Ravi Dental Care Center has been providing the best possible dental care since 1987 with 5 doctors and lab technicians. The clinic features advanced equipment, in-house X-rays & laboratory, and separate waiting and consultation areas for patient comfort."
  },
  {
    id: "dr-divakar",
    name: "Dr. Divakar Gnanasekar",
    qualification: "BDS, MDS",
    specialization: "Root Canal & Implant Dentistry",
    experience: 10,
    rating: 4.8,
    reviewCount: 111,
    clinicName: "G-Dent Dental Clinic",
    address: "PMB Complex, 19, Nachiappa Road, Sub Line, Erode Fort, Erode - 638001",
    area: "Erode Fort",
    phone: "+91 89730 50555",
    whatsapp: "+91 89730 50555",
    website: "https://gdent.in",
    image: "/placeholder.svg",
    achievements: [
      "Top 3 Best Rated Dental Clinic in Erode",
      "Specialist in immediate loading implants",
      "Advanced cosmetic & aesthetic dentistry",
      "Myofunctional orthodontics expertise"
    ],
    treatments: ["Root Canal Treatment", "Dental Implants", "Braces", "Smile Design", "Surgical Tooth Extraction", "Tooth-Coloured Fillings", "Wisdom Tooth Extraction", "Cosmetic Dentistry"],
    about: "G-Dent Dental Clinic, established in 2015, is committed to providing a positive experience with advanced technology. Their skilled doctors specialize in root canal treatments, immediate loading implants, and tooth replacements with precise care."
  },
  {
    id: "dr-dentiq",
    name: "Dr. DentiQ Team",
    qualification: "BDS, MDS (Multiple Specializations)",
    specialization: "Laser Dentistry & Super Speciality Care",
    experience: 12,
    rating: 4.7,
    reviewCount: 450,
    clinicName: "DentiQ Super Speciality Laser Dental Hospital",
    address: "149/1, Chenniyappa Complex, Perundurai Road, Palayapalayam, Erode - 638011",
    area: "Perundurai Road",
    phone: "+91 84894 88999",
    whatsapp: "+91 84894 88999",
    website: "",
    image: "/placeholder.svg",
    achievements: [
      "Super Speciality Laser Dental Hospital since 2013",
      "ADA, OSHA & CDC sterilization standards compliance",
      "Full range of 12+ dental specializations",
      "State-of-the-art laser dentistry equipment"
    ],
    treatments: ["Laser Dentistry", "Orthodontics", "Pedodontics", "Conservative Dentistry", "Prosthodontics", "Endodontics", "Cosmetic Dentistry", "Implant Dentistry", "Oral & Maxillofacial Surgery"],
    about: "DentiQ Super Speciality Laser Dental Hospital provides exceptional quality care with highly specialised doctors and state-of-the-art equipment. They strictly adhere to ADA, OSHA, and CDC sterilization protocols."
  },
  {
    id: "dr-royal",
    name: "Royal Dental Care Team",
    qualification: "BDS, MDS",
    specialization: "Implantology & General Dentistry",
    experience: 15,
    rating: 4.6,
    reviewCount: 320,
    clinicName: "Royal Dental Care and Implant Center",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "https://www.royaldentalcare.org",
    image: "/placeholder.svg",
    achievements: [
      "Best Dental Hospital in Erode",
      "Highest standards of hygiene and sterilization",
      "Advanced dental implant technology",
      "Comprehensive patient-focused care"
    ],
    treatments: ["Dental Implants", "Root Canal Treatment", "Crowns & Bridges", "Teeth Whitening", "Braces", "Extractions", "Dentures", "Cosmetic Dentistry"],
    about: "Royal Dental Care Erode aims to cater to patients with utmost care by meeting the highest standards of hygiene and sterilization protocols, using the latest equipment for high-quality treatment."
  },
  {
    id: "dr-faizal",
    name: "Dr. Faizal",
    qualification: "BDS, MDS",
    specialization: "Implantology & Invisalign",
    experience: 12,
    rating: 4.7,
    reviewCount: 275,
    clinicName: "Faizal Dental Care",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "https://www.faizaldentalcare.com",
    image: "/placeholder.svg",
    achievements: [
      "Leading Invisalign provider in Erode",
      "Advanced dental implant procedures",
      "Comprehensive orthodontic care",
      "Patient-comfort focused clinic"
    ],
    treatments: ["Dental Implants", "Invisalign & Clear Aligners", "Orthodontic Braces", "Root Canal Treatment", "Teeth Whitening", "Crowns & Bridges", "Cosmetic Dentistry"],
    about: "Faizal Dental Care is one of the best dental clinics in Erode offering dental implants, Invisalign, orthodontic braces, and comprehensive dental care with a focus on patient comfort."
  },
  {
    id: "dr-srikala",
    name: "Sri Kala Dental Team",
    qualification: "BDS, MDS",
    specialization: "General & Preventive Dentistry",
    experience: 10,
    rating: 4.5,
    reviewCount: 190,
    clinicName: "Sri Kala Dental Clinic",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "https://srikaladentalclinic.com",
    image: "/placeholder.svg",
    achievements: [
      "Comprehensive dental care for families",
      "Advanced gum treatment specialists",
      "Kids dentistry with gentle approach",
      "Smile makeover expertise"
    ],
    treatments: ["Root Canal Treatment", "Dental Fillings", "Wisdom Teeth Removal", "Teeth Whitening", "Braces & Aligners", "Dental Implants", "Dentures", "Crowns & Bridges", "Kids Dentistry", "Preventive Dentistry", "Smile Makeover"],
    about: "Sri Kala Dental Clinic provides a full range of dental treatments including root canal, implants, braces, kids dentistry, preventive care, and advanced gum treatment in Erode."
  },
  {
    id: "dr-rafi",
    name: "Dr. Rafi",
    qualification: "BDS, MDS",
    specialization: "Implantology & Maxillofacial Surgery",
    experience: 15,
    rating: 4.6,
    reviewCount: 310,
    clinicName: "RAFI Dental Clinic",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "https://www.drrafidentalclinic.com",
    image: "/placeholder.svg",
    achievements: [
      "Erode's best dentist consultants",
      "Microscope dentistry & laser treatments",
      "Sedation dentistry for anxious patients",
      "Expert in maxillofacial surgical cases"
    ],
    treatments: ["Root Canal Treatment", "Dental Implants", "Crowns & Bridges", "Orthodontics", "Endodontics", "Laser Dental Treatments", "Sedation Dentistry", "Maxillofacial Surgery", "Children Dental Care"],
    about: "RAFI Dental Clinic provides root canal treatment, implant dentistry, crown fixing, orthodontics, endodontics, laser treatments, sedation dentistry, microscope dentistry, and all maxillofacial surgical cases."
  },
  {
    id: "dr-arumugavadivu",
    name: "Sree Arumugavadivu Team",
    qualification: "BDS, MDS",
    specialization: "Multispeciality Dental & Implant Care",
    experience: 12,
    rating: 4.5,
    reviewCount: 220,
    clinicName: "Sree Arumugavadivu Multispeciality Dental & Implant Clinic",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "https://sreearumugavadivudental.com",
    image: "/placeholder.svg",
    achievements: [
      "12 years of dental excellence",
      "Quality dental care for everyone",
      "EMI available for orthodontic treatments",
      "Comprehensive restorative & cosmetic dentistry"
    ],
    treatments: ["General Dentistry", "Restorative Dentistry", "Cosmetic Dentistry", "Endodontics", "Pediatric Care", "Orthodontics", "Dental Implants"],
    about: "Sree Arumugavadivu Multispeciality Dental and Implant Clinic offers quality dental care for everyone with 12 years of excellence, including EMI options for orthodontic treatments."
  },
  {
    id: "dr-dental-foundation",
    name: "The Dental Foundation Team",
    qualification: "BDS, MDS",
    specialization: "General & Cosmetic Dentistry",
    experience: 8,
    rating: 4.5,
    reviewCount: 160,
    clinicName: "The Dental Foundation",
    address: "Naal Road, near Surampaatti, Erode, Tamil Nadu",
    area: "Naal Road",
    phone: "+91 76860 68606",
    whatsapp: "+91 76860 68606",
    website: "https://www.thedentalfoundation.in",
    image: "/placeholder.svg",
    achievements: [
      "Modern dental clinic with latest technology",
      "Comprehensive smile makeover services",
      "Affordable dental care in Erode",
      "Patient-friendly environment"
    ],
    treatments: ["Teeth Whitening", "Root Canal Treatment", "Dental Implants", "Braces", "Extractions", "Crowns & Bridges", "Cosmetic Dentistry"],
    about: "The Dental Foundation in Erode provides modern dental care with the latest technology, offering teeth whitening, root canals, implants, braces, and cosmetic dentistry near Surampaatti."
  },
  {
    id: "dr-vimalaa",
    name: "Dr. K.K. Umashankar",
    qualification: "B.Sc., BDS",
    specialization: "General & Multispeciality Dentistry",
    experience: 15,
    rating: 4.6,
    reviewCount: 280,
    clinicName: "Vimalaa Multi-speciality Dental Centre",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 98431 45575",
    whatsapp: "+91 96262 33363",
    website: "https://vimaladentalclinic.com",
    image: "/placeholder.svg",
    achievements: [
      "Experienced multispeciality dental centre",
      "Comprehensive treatment portfolio",
      "Advanced dental care technology",
      "Trusted name in Erode dental care"
    ],
    treatments: ["Root Canal Treatment", "Dental Implants", "Crowns & Bridges", "Braces", "Teeth Whitening", "Dentures", "Extractions", "Cosmetic Dentistry"],
    about: "Vimalaa Multi-speciality Dental Centre, led by Dr. K.K. Umashankar (B.Sc., BDS), provides comprehensive multispeciality dental care in Erode with advanced technology and a patient-first approach."
  },
  {
    id: "dr-shahid",
    name: "Dr. Shahid Basha G",
    qualification: "BDS",
    specialization: "General Dentistry",
    experience: 16,
    rating: 4.5,
    reviewCount: 150,
    clinicName: "Dr. Shahid Basha Dental Clinic",
    address: "Erode Railway Colony, Erode, Tamil Nadu",
    area: "Erode Railway Colony",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "",
    image: "/placeholder.svg",
    achievements: [
      "16 years of dental practice experience",
      "Medical registration verified on Practo",
      "Trusted dental surgeon in Erode Railway Colony",
      "Comprehensive dental care provider"
    ],
    treatments: ["Root Canal Treatment", "Extractions", "Dental Fillings", "Teeth Cleaning", "Crowns & Bridges", "Dentures"],
    about: "Dr. Shahid Basha G is a dental surgeon with 16 years of experience practicing in Erode Railway Colony, offering comprehensive dental care services."
  },
  {
    id: "dr-senthoor",
    name: "Dr. Senthoor R",
    qualification: "BDS, MDS (Orthodontics)",
    specialization: "Orthodontics & Dentofacial Orthopedics",
    experience: 11,
    rating: 4.7,
    reviewCount: 175,
    clinicName: "Dr. Senthoor Orthodontic Clinic",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "",
    image: "/placeholder.svg",
    achievements: [
      "MDS Orthodontics from Saveetha Dental College",
      "11 years of orthodontic experience",
      "Specialist in braces & aligners",
      "Medical registration verified"
    ],
    treatments: ["Metal Braces", "Ceramic Braces", "Clear Aligners", "Retainers", "Jaw Correction", "Orthodontic Treatment"],
    about: "Dr. Senthoor R is a specialist orthodontist with 11 years of experience, having completed BDS and MDS in Orthodontics from Saveetha Dental College, Chennai."
  },
  {
    id: "dr-ragavendran",
    name: "Dr. N. Ragavendran",
    qualification: "BDS, MDS (Conservative Dentistry & Endodontics)",
    specialization: "Endodontics & Restorative Dentistry",
    experience: 17,
    rating: 4.8,
    reviewCount: 290,
    clinicName: "Dr. Ragavendran Dental Clinic",
    address: "Karungalpalayam, Erode, Tamil Nadu",
    area: "Karungalpalayam",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "",
    image: "/placeholder.svg",
    achievements: [
      "17 years experience (12 years as specialist)",
      "MDS in Conservative Dentistry & Endodontics",
      "Expert in advanced root canal treatments",
      "Medical registration verified on Practo"
    ],
    treatments: ["Root Canal Treatment", "Re-Root Canal", "Tooth Colored Fillings", "Post & Core", "Dental Restorations", "Conservative Dentistry"],
    about: "Dr. N. Ragavendran is an experienced endodontist and conservative dentist with 17 years of practice in Karungalpalayam, Erode, specializing in advanced root canal treatments and restorative dentistry."
  },
  {
    id: "dr-abimanyu",
    name: "Dr. Abhimanyu",
    qualification: "BDS, MDS",
    specialization: "General & Cosmetic Dentistry",
    experience: 10,
    rating: 4.7,
    reviewCount: 185,
    clinicName: "Abhimanyu Dental Clinic",
    address: "Erode, Tamil Nadu",
    area: "Erode",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    website: "",
    image: "/placeholder.svg",
    achievements: [
      "Trusted dental care provider in Erode",
      "Advanced cosmetic dentistry procedures",
      "Patient-focused gentle care approach"
    ],
    treatments: ["Root Canal Treatment", "Dental Implants", "Teeth Whitening", "Braces", "Crowns & Bridges", "Extractions"],
    about: "Abhimanyu Dental Clinic provides comprehensive dental care with a focus on patient comfort and the latest treatment techniques in Erode."
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
