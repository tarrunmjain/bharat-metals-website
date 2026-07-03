const site = {
  name: "Bharat Metals",
  established: "1986",
  finalDomain: "https://www.stainlesssteeldealers.com/",
  preview: "https://tarrunmjain.github.io/bharat-metals-website/",
  phone: "+91 99411 33888",
  phoneHref: "tel:+919941133888",
  whatsappHref: "https://wa.me/919941133888?text=Hello%20Bharat%20Metals%2C%20I%20want%20to%20send%20a%20stainless%20steel%20requirement.",
  email: "stainlesssteeldealers@gmail.com",
  secondaryEmail: "manohar.bharat@yahoo.com",
  mailto: "mailto:stainlesssteeldealers@gmail.com?subject=Stainless%20Steel%20Requirement%20-%20Bharat%20Metals&body=Hello%20Bharat%20Metals%2C%0A%0AProduct%20Form%3A%0AGrade%3A%0ASize%2FThickness%3A%0AQuantity%3A%0AFinish%3A%0ADelivery%20Location%3A%0ACertificate%20Requirement%3A%0A%0ARegards%2C",
  maps: "https://maps.app.goo.gl/oXEYZZnMaAN2kfSV6",
  addressLines: [
    "No. 19 (10), Shop No. G1 & S10,",
    "Majfa Towers, Mookernallamuthu Street,",
    "Chennai - 600001, Tamil Nadu, India"
  ],
  logo: "assets/brand/bharat-metals-header-logo-centered-left-transparent.png",
  icon: "assets/brand/bharat-metals-bm-map-icon-centered-left-transparent.png",
  ogLogo: "assets/brand/bharat-metals-horizontal-logo-centered-left-transparent.png"
};

const forms = [
  { name: "Stainless Steel Pipes", short: "Pipes", slug: "stainless-steel-pipes", formSlug: "pipes", image: "assets/images/photos/hero/stainless-steel-pipes-stockyard.webp", specs: "outside diameter, schedule, wall thickness, welded or seamless preference", uses: ["piping fabrication", "utility lines", "commercial kitchens", "marine repair"] },
  { name: "Stainless Steel Tubes", short: "Tubes", slug: "stainless-steel-tubes", formSlug: "tubes", image: "assets/images/photos/materials/stainless-steel.webp", specs: "round, square or rectangular tube size, thickness and finish", uses: ["railings", "interiors", "frames", "equipment fabrication"] },
  { name: "Stainless Steel Sheets", short: "Sheets", slug: "stainless-steel-sheets", formSlug: "sheets", image: "assets/images/photos/materials/stainless-steel.webp", specs: "thickness, finish, sheet size and PVC coating need", uses: ["kitchen equipment", "cladding", "ducting", "fabrication"] },
  { name: "Stainless Steel Plates", short: "Plates", slug: "stainless-steel-plates", formSlug: "plates", image: "assets/images/photos/materials/stainless-steel.webp", specs: "plate thickness, width, length, cutting and certificate requirement", uses: ["base plates", "machine shops", "structural fabrication", "industrial repair"] },
  { name: "Stainless Steel Coils", short: "Coils", slug: "stainless-steel-coils", formSlug: "coils", image: "assets/images/photos/materials/stainless-steel.webp", specs: "coil width, thickness, grade, finish and slit coil requirement", uses: ["sheet conversion", "fabrication", "commercial processing", "trader supply"] },
  { name: "Stainless Steel Rods", short: "Rods", slug: "stainless-steel-rods", formSlug: "rods", image: "assets/images/photos/materials/stainless-steel.webp", specs: "diameter, length, grade, finish and machining use", uses: ["machining", "workshop repair", "shafts", "fabrication"] },
  { name: "Stainless Steel Bars", short: "Bars", slug: "stainless-steel-bars", formSlug: "bars", image: "assets/images/photos/materials/stainless-steel.webp", specs: "round, square or hex bar size, grade and length", uses: ["machine shops", "auto components", "maintenance", "industrial fabrication"] },
  { name: "Stainless Steel Angles", short: "Angles", slug: "stainless-steel-angles", formSlug: "angles", image: "assets/images/photos/materials/stainless-steel.webp", specs: "leg size, thickness, length and grade", uses: ["frames", "supports", "construction", "fabrication"] },
  { name: "Stainless Steel Flats", short: "Flats", slug: "stainless-steel-flats", formSlug: "flats", image: "assets/images/photos/materials/stainless-steel.webp", specs: "flat width, thickness, length and grade", uses: ["bracing", "architectural work", "repair", "fabrication"] },
  { name: "Stainless Steel Channels", short: "Channels", slug: "stainless-steel-channels", formSlug: "channels", image: "assets/images/photos/materials/stainless-steel.webp", specs: "channel size, thickness, length and grade", uses: ["industrial frames", "supports", "fabrication", "construction"] },
  { name: "Stainless Steel Flanges", short: "Flanges", slug: "stainless-steel-flanges", formSlug: "flanges", image: "assets/images/photos/materials/stainless-steel.webp", specs: "flange type, class, size, grade and standard if known", uses: ["piping", "maintenance", "marine", "chemical handling"] },
  { name: "Stainless Steel Fittings", short: "Fittings", slug: "stainless-steel-fittings", formSlug: "fittings", image: "assets/images/photos/materials/stainless-steel.webp", specs: "elbow, tee, reducer or coupling type, size and schedule", uses: ["pipe connections", "plant maintenance", "food equipment", "industrial repair"] },
  { name: "Stainless Steel Circles", short: "Circles", slug: "stainless-steel-circles", formSlug: "circles", image: "assets/images/photos/materials/stainless-steel.webp", specs: "circle diameter, thickness, grade and finish", uses: ["vessels", "equipment fabrication", "kitchenware", "custom parts"] },
  { name: "Stainless Steel Fasteners", short: "Fasteners", slug: "stainless-steel-fasteners", formSlug: "fasteners", image: "assets/images/photos/materials/stainless-steel.webp", specs: "bolt, nut, washer or screw type, size, grade and quantity", uses: ["construction", "marine", "machinery", "site installation"] },
  { name: "Stainless Steel Wire Mesh", short: "Wire Mesh", slug: "stainless-steel-wire-mesh", formSlug: "wire-mesh", image: "assets/images/photos/materials/stainless-steel.webp", specs: "mesh opening, wire diameter, roll or sheet size and grade", uses: ["filters", "guards", "partitions", "industrial screening"] },
  { name: "Stainless Steel Perforated Sheets", short: "Perforated Sheets", slug: "stainless-steel-perforated-sheets", formSlug: "perforated-sheets", image: "assets/images/photos/materials/stainless-steel.webp", specs: "hole pattern, thickness, sheet size, open area and finish", uses: ["screens", "guards", "architecture", "industrial panels"] }
];

const grades = [
  { id: "202", slug: "ss-202", name: "SS 202", primary: true, summary: "a cost-sensitive austenitic stainless steel grade often discussed for general fabrication and railing work where the application is suitable", notes: "Share whether the material will be used indoors, outdoors or near moisture so grade suitability can be reviewed." },
  { id: "304", slug: "ss-304", name: "SS 304", primary: true, summary: "a widely requested stainless steel grade for fabrication, kitchen equipment, food handling, interiors and general industrial work", notes: "SS 304 is commonly requested when corrosion resistance, clean finish and fabrication practicality matter." },
  { id: "304l", slug: "ss-304l", name: "SS 304L", primary: false, summary: "a low-carbon 304 variant requested for selected welding and fabrication requirements", notes: "Send welding and certificate needs clearly when asking for SS 304L material." },
  { id: "310", slug: "ss-310", name: "SS 310", primary: false, summary: "a heat-resisting grade considered for selected high-temperature applications", notes: "Confirm temperature, application and certificate need before finalizing SS 310 enquiries." },
  { id: "316", slug: "ss-316", name: "SS 316", primary: true, summary: "a molybdenum-bearing stainless steel grade commonly discussed for marine, coastal, chemical and higher corrosion exposure requirements", notes: "SS 316 is often reviewed for coastal and marine use, but exact application details are important." },
  { id: "316l", slug: "ss-316l", name: "SS 316L", primary: false, summary: "a low-carbon 316 variant used where welding and corrosion exposure are important", notes: "Share drawing, certificate and inspection needs when requesting SS 316L." },
  { id: "410", slug: "ss-410", name: "SS 410", primary: false, summary: "a martensitic stainless steel grade requested for selected wear and mechanical applications", notes: "Application and heat treatment expectations should be discussed before supply." },
  { id: "420", slug: "ss-420", name: "SS 420", primary: false, summary: "a martensitic grade sometimes considered for selected hardness and wear-related uses", notes: "Confirm form, application and machining expectation for SS 420 enquiries." },
  { id: "430", slug: "ss-430", name: "SS 430", primary: false, summary: "a ferritic stainless steel grade often discussed for decorative, appliance and selected sheet applications", notes: "Send finish, thickness and usage details for SS 430 sheet enquiries." }
];

const finishes = ["2B Finish", "No. 1 Finish", "BA Finish", "Mirror Finish", "No. 8 Finish", "Matt Finish", "Hairline Finish", "Brush Finish", "Satin Finish", "PVC Coated Sheets", "Polished Pipes", "Polished Rods", "Polished Bars"];
const services = ["Cutting", "Polishing", "PVC coating", "Bending", "Drilling", "Packing", "Local delivery", "Transport booking", "Door delivery", "Courier for small items", "Export packing", "Material Test Certificate / MTC", "Mill certificate", "Third party inspection"];
const rfqFields = ["Product form", "Grade", "Size / thickness / schedule / diameter", "Quantity", "Finish", "Delivery location", "Certificate requirement", "Packing / transport requirement", "Required date"];

const industries = [
  ["Fabrication and Welding", "fabrication-welding", ["Pipes", "Sheets", "Rods", "Angles"], ["SS 202", "SS 304", "SS 316"]],
  ["Railing Contractors", "railing-contractors", ["Polished Pipes", "Tubes", "Flats", "Sheets"], ["SS 202", "SS 304", "SS 316"]],
  ["Automobile and Auto Components", "automobile-auto-components", ["Rods", "Bars", "Sheets", "Fasteners"], ["SS 304", "SS 316", "SS 410"]],
  ["Hotel and Commercial Kitchen Equipment", "commercial-kitchen-equipment", ["Sheets", "Tubes", "Pipes", "Plates"], ["SS 304", "SS 316"]],
  ["Food Processing", "food-processing", ["Sheets", "Pipes", "Fittings", "Wire Mesh"], ["SS 304", "SS 316", "SS 316L"]],
  ["Pharma and Healthcare Equipment", "pharma-healthcare-equipment", ["Sheets", "Tubes", "Pipes", "Fittings"], ["SS 304", "SS 316", "SS 316L"]],
  ["Engineering and Machine Shops", "engineering-machine-shops", ["Bars", "Rods", "Plates", "Flats"], ["SS 304", "SS 316", "SS 410"]],
  ["Builders and Construction", "builders-construction", ["Angles", "Channels", "Sheets", "Fasteners"], ["SS 202", "SS 304", "SS 316"]],
  ["Interior and Architectural Contractors", "interior-architectural-contractors", ["Sheets", "Tubes", "Flats", "Decorative Stainless Steel"], ["SS 304", "SS 430"]],
  ["Marine and Ship Repair", "marine-ship-repair", ["Pipes", "Plates", "Fasteners", "Fittings"], ["SS 316", "SS 316L"]],
  ["Railways and Metro Projects", "railways-metro-projects", ["Sheets", "Pipes", "Fasteners", "Plates"], ["SS 304", "SS 316"]],
  ["Oil and Gas", "oil-gas", ["Pipes", "Flanges", "Fittings", "Plates"], ["SS 304", "SS 316", "SS 316L"]],
  ["Chemical and Petrochemical", "chemical-petrochemical", ["Pipes", "Fittings", "Flanges", "Plates"], ["SS 304", "SS 316", "SS 316L"]],
  ["Textile Machinery", "textile-machinery", ["Rods", "Bars", "Sheets", "Flats"], ["SS 304", "SS 316"]],
  ["Water Treatment and Utilities", "water-treatment-utilities", ["Pipes", "Fittings", "Wire Mesh", "Plates"], ["SS 304", "SS 316"]],
  ["Electrical and Control Panel Fabrication", "electrical-control-panel-fabrication", ["Sheets", "Angles", "Fasteners", "Channels"], ["SS 304", "SS 430"]],
  ["Dairy and Beverage Processing", "dairy-beverage-processing", ["Pipes", "Tubes", "Sheets", "Fittings"], ["SS 304", "SS 316", "SS 316L"]],
  ["Sugar Mills and Agro Processing", "sugar-mills-agro-processing", ["Plates", "Sheets", "Pipes", "Wire Mesh"], ["SS 304", "SS 316"]],
  ["Paper Mills", "paper-mills", ["Sheets", "Plates", "Pipes", "Fittings"], ["SS 304", "SS 316"]],
  ["Ports, Shipping and Coastal Infrastructure", "ports-shipping-coastal-infrastructure", ["Pipes", "Plates", "Fasteners", "Flanges"], ["SS 316", "SS 316L"]],
  ["Educational and Institutional Fabrication", "institutional-fabrication", ["Sheets", "Pipes", "Tubes", "Fasteners"], ["SS 202", "SS 304"]],
  ["Public Works and Infrastructure Contractors", "public-works-infrastructure", ["Angles", "Channels", "Plates", "Fasteners"], ["SS 304", "SS 316"]],
  ["Textile Dyeing and Processing Units", "textile-dyeing-processing", ["Pipes", "Sheets", "Perforated Sheets", "Fittings"], ["SS 304", "SS 316"]],
  ["Boiler and Heat Exchanger Fabricators", "boiler-heat-exchanger-fabricators", ["Tubes", "Plates", "Pipes", "Flanges"], ["SS 304", "SS 316", "SS 310"]],
  ["Pump, Valve and Equipment Manufacturers", "pump-valve-equipment-manufacturers", ["Bars", "Rods", "Flanges", "Fittings"], ["SS 304", "SS 316", "SS 410"]]
].map(([name, slug, products, grades]) => ({ name, slug, products, grades }));

const secondaryMaterials = {
  aluminium: ["Sheets", "Plates", "Coils", "Pipes", "Flats", "Rods", "Bars"],
  brass: ["Pipes", "Bush Pipes", "Rods", "Bars", "Flats"],
  copper: ["Tubes", "Flats", "Rods", "Bars", "Plates"]
};

const cityNames = [
  "Chennai", "George Town Chennai", "Parrys Chennai", "Mookernallamuthu Street Chennai", "Armenian Street Chennai", "Ambattur", "Guindy", "Manali", "Ennore", "Avadi", "Poonamallee", "Tiruvallur", "Gummidipoondi", "Red Hills", "Sriperumbudur", "Oragadam", "Irungattukottai", "Maraimalai Nagar", "Chengalpattu", "Kanchipuram", "Mahabalipuram", "Ranipet", "Vellore", "Katpadi", "Arcot", "Arakkonam", "Tirupattur", "Hosur", "Krishnagiri", "Dharmapuri", "Salem", "Namakkal", "Rasipuram", "Erode", "Perundurai", "Bhavani", "Tiruppur", "Avinashi", "Palladam", "Coimbatore", "Pollachi", "Mettupalayam", "Udumalaipettai", "Ooty Udhagamandalam", "Karur", "Trichy", "Thanjavur", "Kumbakonam", "Mayiladuthurai", "Nagapattinam", "Karaikal", "Ariyalur", "Perambalur", "Pudukkottai", "Cuddalore", "Neyveli", "Chidambaram", "Villupuram", "Tindivanam", "Tiruvannamalai", "Madurai", "Dindigul", "Theni", "Sivakasi", "Virudhunagar", "Rajapalayam", "Karaikudi", "Sivaganga", "Ramanathapuram", "Rameswaram", "Tuticorin", "Tirunelveli", "Tenkasi", "Nagercoil", "Kanyakumari", "Tiruchendur", "Pondicherry", "Puducherry", "Cuddalore Pondicherry Belt", "Kochi", "Ernakulam", "Thrissur", "Kozhikode", "Trivandrum", "Thiruvananthapuram", "Palakkad", "Kollam", "Kannur", "Alappuzha", "Kottayam", "Malappuram", "Bengaluru", "Mysuru", "Mangalore", "Hubballi", "Belagavi", "Tumakuru", "Davangere", "Ballari", "Shivamogga", "Hassan", "Kolar", "Tirupati", "Renigunta", "Chittoor", "Nellore", "Sricity", "Tada", "Naidupeta", "Gudur", "Vijayawada", "Visakhapatnam", "Anantapur", "Kadapa", "Port Blair", "Andaman and Nicobar Islands", "Sri Lanka", "Colombo", "Maldives", "Male"
];

const cityProfiles = {
  Chennai: { region: "Tamil Nadu", profile: "automobile, fabrication, pharma, commercial kitchen, port, marine, engineering and construction procurement", products: ["Pipes", "Sheets", "Plates", "Coils", "Rods", "Bars", "Flanges", "Fittings"], grades: ["SS 304", "SS 316", "SS 202"] },
  Ambattur: { region: "Tamil Nadu", profile: "industrial estate, machinery, fabrication and auto-component support", products: ["Rods", "Bars", "Flats", "Sheets", "Pipes"], grades: ["SS 304", "SS 316", "SS 202"] },
  Guindy: { region: "Tamil Nadu", profile: "engineering, institutional, workshop and commercial fabrication demand", products: ["Sheets", "Pipes", "Rods", "Fasteners"], grades: ["SS 304", "SS 316"] },
  Sriperumbudur: { region: "Tamil Nadu", profile: "automobile and manufacturing corridor procurement", products: ["Rods", "Bars", "Pipes", "Tubes", "Sheets", "Fasteners"], grades: ["SS 304", "SS 316", "SS 202"] },
  Oragadam: { region: "Tamil Nadu", profile: "automobile, engineering and manufacturing corridor buyer requirements", products: ["Pipes", "Tubes", "Rods", "Bars", "Sheets", "Plates"], grades: ["SS 304", "SS 316"] },
  Irungattukottai: { region: "Tamil Nadu", profile: "automotive, manufacturing and fabrication corridor demand", products: ["Rods", "Bars", "Pipes", "Fasteners"], grades: ["SS 304", "SS 316"] },
  Hosur: { region: "Tamil Nadu", profile: "industrial manufacturing, automotive, engineering and fabrication", products: ["Rods", "Bars", "Sheets", "Pipes", "Plates"], grades: ["SS 304", "SS 316", "SS 202"] },
  Coimbatore: { region: "Tamil Nadu", profile: "engineering, pumps, motors, textile machinery, machine shops and food equipment", products: ["Rods", "Bars", "Flats", "Plates", "Sheets", "Pipes"], grades: ["SS 304", "SS 316", "SS 410"] },
  Tiruppur: { region: "Tamil Nadu", profile: "textile, dyeing, processing, fabrication and utility support", products: ["Pipes", "Sheets", "Plates", "Perforated Sheets", "Fittings"], grades: ["SS 304", "SS 316"] },
  Erode: { region: "Tamil Nadu", profile: "textile, agro processing, trading and fabrication demand", products: ["Pipes", "Sheets", "Plates", "Coils"], grades: ["SS 304", "SS 316"] },
  Salem: { region: "Tamil Nadu", profile: "steel, engineering, fabrication and construction buyer requirements", products: ["Sheets", "Plates", "Rods", "Angles", "Channels"], grades: ["SS 304", "SS 316", "SS 202"] },
  Trichy: { region: "Tamil Nadu", profile: "fabrication, boiler, engineering and infrastructure procurement", products: ["Plates", "Pipes", "Fittings", "Flanges", "Rods"], grades: ["SS 304", "SS 316", "SS 310"] },
  Madurai: { region: "Tamil Nadu", profile: "commercial fabrication, food processing, builders and kitchen equipment", products: ["Sheets", "Pipes", "Rods", "Decorative Stainless Steel"], grades: ["SS 304", "SS 316", "SS 202"] },
  Cuddalore: { region: "Tamil Nadu", profile: "chemical, power, port-side and industrial processing requirements", products: ["Pipes", "Plates", "Fittings", "Flanges"], grades: ["SS 304", "SS 316", "SS 316L"] },
  Neyveli: { region: "Tamil Nadu", profile: "power, industrial processing, utilities and maintenance procurement", products: ["Plates", "Pipes", "Fittings", "Fasteners"], grades: ["SS 304", "SS 316"] },
  Tuticorin: { region: "Tamil Nadu", profile: "port, marine, chemical, salt and logistics-related procurement", products: ["Pipes", "Plates", "Flanges", "Fittings", "Fasteners"], grades: ["SS 316", "SS 316L", "SS 304"] },
  Tirunelveli: { region: "Tamil Nadu", profile: "fabrication, wind energy support, food and agro processing buyers", products: ["Sheets", "Rods", "Pipes", "Angles"], grades: ["SS 304", "SS 316", "SS 202"] },
  Tenkasi: { region: "Tamil Nadu", profile: "fabrication, agro processing, service workshops and project buyers", products: ["Sheets", "Rods", "Pipes", "Angles"], grades: ["SS 304", "SS 316"] },
  Pondicherry: { region: "Pondicherry", profile: "pharma, food processing, engineering, hotels and coastal fabrication", products: ["Pipes", "Sheets", "Polished Pipes", "Plates"], grades: ["SS 304", "SS 316", "SS 316L"] },
  Puducherry: { region: "Puducherry", profile: "pharma, food processing, engineering, hotels and coastal fabrication", products: ["Pipes", "Sheets", "Polished Pipes", "Plates"], grades: ["SS 304", "SS 316", "SS 316L"] },
  Sricity: { region: "Andhra Pradesh", profile: "industrial and manufacturing procurement accessible from Chennai", products: ["Pipes", "Tubes", "Rods", "Bars", "Sheets", "Fasteners"], grades: ["SS 304", "SS 316"] },
  Tada: { region: "Andhra Pradesh", profile: "industrial and manufacturing belt near Chennai", products: ["Pipes", "Tubes", "Rods", "Bars", "Sheets"], grades: ["SS 304", "SS 316"] },
  Renigunta: { region: "Andhra Pradesh", profile: "industrial, railway-linked and manufacturing procurement accessible from Chennai", products: ["Pipes", "Sheets", "Plates", "Fasteners"], grades: ["SS 304", "SS 316"] },
  Tirupati: { region: "Andhra Pradesh", profile: "industrial, institutional, hotel, commercial and fabrication buyers", products: ["Pipes", "Sheets", "Rods", "Bars", "Fasteners"], grades: ["SS 304", "SS 316", "SS 202"] },
  "Sri Lanka": { region: "Nearby export", profile: "nearby export enquiries for construction, marine, fabrication and commercial kitchen stainless steel", products: ["Pipes", "Sheets", "Plates", "Fasteners"], grades: ["SS 304", "SS 316"] },
  Maldives: { region: "Nearby export", profile: "nearby export enquiries for hospitality, marine, construction and coastal stainless steel needs", products: ["Pipes", "Sheets", "Plates", "Fasteners"], grades: ["SS 304", "SS 316"] }
};

function defaultCityProfile(name) {
  let region = "Tamil Nadu";
  if (["Kochi", "Ernakulam", "Thrissur", "Kozhikode", "Trivandrum", "Thiruvananthapuram", "Palakkad", "Kollam", "Kannur", "Alappuzha", "Kottayam", "Malappuram"].includes(name)) region = "Kerala";
  if (["Bengaluru", "Mysuru", "Mangalore", "Hubballi", "Belagavi", "Tumakuru", "Davangere", "Ballari", "Shivamogga", "Hassan", "Kolar"].includes(name)) region = "Karnataka";
  if (["Chittoor", "Nellore", "Naidupeta", "Gudur", "Vijayawada", "Visakhapatnam", "Anantapur", "Kadapa"].includes(name)) region = "Andhra Pradesh";
  if (["Port Blair", "Andaman and Nicobar Islands"].includes(name)) region = "Andaman and Nicobar Islands";
  if (["Colombo"].includes(name)) region = "Nearby export";
  if (["Male"].includes(name)) region = "Nearby export";
  const coastal = /Ennore|Nagapattinam|Karaikal|Rameswaram|Kanyakumari|Mahabalipuram|Kochi|Mangalore|Kollam|Alappuzha|Kannur|Kozhikode|Visakhapatnam|Port Blair|Colombo|Male|Maldives|Sri Lanka/.test(name);
  return {
    region,
    profile: coastal ? "coastal, marine, construction, hotel, fabrication and maintenance enquiries" : "fabrication, engineering, construction, trading, maintenance and project procurement",
    products: coastal ? ["Pipes", "Sheets", "Plates", "Fasteners", "Fittings"] : ["Pipes", "Sheets", "Plates", "Rods", "Bars"],
    grades: coastal ? ["SS 304", "SS 316", "SS 316L"] : ["SS 304", "SS 316", "SS 202"]
  };
}

const locations = cityNames.map((name) => ({ name, ...defaultCityProfile(name), ...(cityProfiles[name] || {}) }));

const blogPosts = [
  ["ss-304-vs-ss-316", "SS 304 vs SS 316: Which Grade Should Fabricators Choose?", "Compare SS 304 and SS 316 for corrosion exposure, fabrication, coastal use and RFQ clarity."],
  ["stainless-steel-pipes-welded-vs-seamless", "Stainless Steel Welded Pipe vs Seamless Pipe: Buyer Guide", "Understand welded and seamless stainless steel pipe enquiries before asking for a quote."],
  ["ss-202-vs-ss-304-railing-work", "SS 202 vs SS 304 for Railing and Fabrication Work", "A practical buyer note for railing contractors comparing SS 202 and SS 304."],
  ["stainless-steel-sheet-finishes", "Stainless Steel Sheet Finishes: 2B, Mirror, Matt, Hairline and BA", "How to describe finish requirements for stainless steel sheets in a quotation."],
  ["how-to-send-stainless-steel-rfq", "What Details to Send for a Fast Stainless Steel Quote", "A simple RFQ checklist for product, grade, size, finish, quantity and delivery location."],
  ["stainless-steel-for-commercial-kitchens", "Stainless Steel for Hotel and Commercial Kitchen Equipment", "Material forms and finish notes for hotel and commercial kitchen equipment fabricators."],
  ["stainless-steel-for-food-and-pharma", "Stainless Steel for Food Processing and Pharma Equipment", "Common stainless steel requirements for food processing and pharma equipment buyers."],
  ["stainless-steel-plates-buyer-guide", "Stainless Steel Plates: Buyer Guide for Tamil Nadu Industries", "Plate enquiry notes for thickness, cutting, grade, certificate and application."],
  ["polished-stainless-steel-pipes-chennai", "Polished Stainless Steel Pipes in Chennai: Buyer Checklist", "Checklist for polished pipe enquiries for railings, interiors and decorative work."],
  ["stainless-steel-perforated-sheets-wire-mesh", "Stainless Steel Perforated Sheets and Wire Mesh: Uses and Buying Tips", "How to specify perforated sheets and wire mesh for industrial and architectural use."],
  ["stainless-steel-supply-tamil-nadu-cities", "Stainless Steel Supply Across Tamil Nadu: Chennai to Coimbatore, Hosur and Trichy", "How Chennai-based stainless steel supply supports enquiries across Tamil Nadu."],
  ["stainless-steel-material-test-certificate", "MTC and Mill Certificate for Stainless Steel: What Buyers Should Know", "Practical notes on certificate requests for stainless steel buyers."],
  ["stainless-steel-for-automobile-industries-tamil-nadu", "Stainless Steel for Automobile and Auto Component Industries in Tamil Nadu", "Common stainless steel forms for automotive and component buyers."],
  ["stainless-steel-supply-to-sricity-tada-tirupati", "Stainless Steel Supply to Sricity, Tada and Tirupati: Buyer Guide", "Supply guidance from Chennai for buyers in Sricity, Tada, Renigunta and Tirupati."],
  ["stainless-steel-for-coastal-and-marine-use", "Stainless Steel for Coastal and Marine Use: 304 vs 316 Buying Notes", "How to discuss 304 and 316 for marine, coastal and export-facing enquiries."]
].map(([slug, title, summary]) => ({ slug, title, summary }));

const priorityCities = ["Chennai", "Coimbatore", "Hosur", "Trichy", "Madurai", "Salem", "Tiruppur", "Pondicherry", "Sricity", "Tada", "Tirupati"];
const priorityForms = ["pipes", "sheets", "plates", "rods", "bars"];
const gradeCityPriority = ["Chennai", "Ambattur", "Sriperumbudur", "Oragadam", "Coimbatore", "Madurai", "Trichy", "Salem", "Hosur", "Pondicherry"];

module.exports = { site, forms, grades, finishes, services, rfqFields, industries, secondaryMaterials, locations, blogPosts, priorityCities, priorityForms, gradeCityPriority };
