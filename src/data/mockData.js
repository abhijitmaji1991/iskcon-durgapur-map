// ISKCON Durgapur Mock Dataset for Custom Mapping Platform

export const categories = {
  TEMPLE: 'temple',
  NAMAHATTA: 'namahatta',
  BHAKTA: 'bhakta',
  EVENT: 'event',
};

export const locations = [
  {
    id: 'dgp-temple',
    name: 'ISKCON Durgapur (Sri Sri Radha Madhav Sundar Mandir)',
    category: categories.TEMPLE,
    lat: 23.5413,
    lng: 87.3015,
    address: 'Albert Einstein Avenue, A-Zone, Durgapur, West Bengal 713205',
    phone: '+91 343 256 4582',
    description: 'The main temple and community center. Daily programs include Mangala Arati, Srimad Bhagavatam class, and evening Sandhya Arati. Free Sunday feast prasadam served to all.',
    timings: '04:30 AM - 01:00 PM, 04:30 PM - 08:30 PM',
    president: 'HG Mukunda Bhakti Das',
    image: 'https://images.unsplash.com/photo-1609137982420-b18854d97c54?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'nh-benachity',
    name: 'Benachity Namahatta Center',
    category: categories.NAMAHATTA,
    lat: 23.5510,
    lng: 87.3150,
    address: 'Benachity Market Road, Near Janata High School, Durgapur',
    phone: '+91 98321 45678',
    description: 'Weekly congregational programs every Saturday evening from 6:30 PM to 8:30 PM. Includes bhajan, Bhagavad Gita discussion, and Prasadam distribution.',
    leader: 'HG Gouranga Chandra Das',
    activeMembers: 45,
  },
  {
    id: 'nh-citycentre',
    name: 'City Centre Namahatta Sanga',
    category: categories.NAMAHATTA,
    lat: 23.5285,
    lng: 87.2920,
    address: 'Ambuja Housing Complex, Phase II, City Centre, Durgapur',
    phone: '+91 94747 12345',
    description: 'Weekly group meets every Friday at 7:00 PM. Focusing on corporate youth and families in the City Centre area.',
    leader: 'HG Nitai Pada Das',
    activeMembers: 30,
  },
  {
    id: 'nh-bidhannagar',
    name: 'Bidhannagar Namahatta Sanga',
    category: categories.NAMAHATTA,
    lat: 23.5090,
    lng: 87.3310,
    address: 'Near Bidhannagar Sub-Post Office, Sector 2A, Durgapur',
    phone: '+91 81160 98765',
    description: 'Congregational center serving local students of NIT Durgapur and local families. Weekly classes on Sunday evenings.',
    leader: 'Dr. Debasish Sen (Devoted Bhakta)',
    activeMembers: 60,
  },
  {
    id: 'nh-steel',
    name: 'Steel Township Namahatta Sanga',
    category: categories.NAMAHATTA,
    lat: 23.5540,
    lng: 87.2750,
    address: 'B-Zone Community Hall Lane, Steel Township, Durgapur',
    phone: '+91 90022 55443',
    description: 'Weekly congregational meeting on Tuesdays from 6:30 PM. Serves families of DSP steel plant employees.',
    leader: 'HG Jagannath Mishra Das',
    activeMembers: 25,
  },
  // Bhakta/Devotee Houses
  {
    id: 'bh-amit',
    name: 'Amit Das & Family (Bhakta House)',
    category: categories.BHAKTA,
    lat: 23.5240,
    lng: 87.2990,
    address: 'Quarter 12/B, Street 15, City Centre, Durgapur',
    phone: '+91 97755 88990',
    description: 'Home program hosting Namahatta sangas once a month. Active in book distribution.',
    occupation: 'Software Engineer',
  },
  {
    id: 'bh-rajesh',
    name: 'Rajesh Sharma & Family (Bhakta House)',
    category: categories.BHAKTA,
    lat: 23.5470,
    lng: 87.3220,
    address: 'Nivedita Avenue, Benachity, Durgapur',
    phone: '+91 98833 77441',
    description: 'Host for Rath Yatra prasadam cooking seva. Family active in temple kitchen service.',
    occupation: 'Businessman',
  },
  {
    id: 'bh-gouranga',
    name: 'Gouranga Das & Family (Bhakta House)',
    category: categories.BHAKTA,
    lat: 23.5120,
    lng: 87.3380,
    address: 'G-14, Bidhannagar Housing Estate, Durgapur',
    phone: '+91 80011 22334',
    description: 'Youth coordinator house. Weekly NIT student Gita study group meets here.',
    occupation: 'Professor, NIT Durgapur',
  },
  {
    id: 'bh-vinod',
    name: 'Vinod Gupta & Family (Bhakta House)',
    category: categories.BHAKTA,
    lat: 23.5440,
    lng: 87.3420,
    address: 'Mamra Bazar Main Road, Durgapur',
    phone: '+91 93322 11005',
    description: 'Regular donor and festival volunteer family. Grocery store owner.',
    occupation: 'Merchant',
  },
  {
    id: 'bh-sridhar',
    name: 'Sridhar Das & Family (Bhakta House)',
    category: categories.BHAKTA,
    lat: 23.5385,
    lng: 87.2940,
    address: 'Qtr 4A-12, A-Zone, Durgapur',
    phone: '+91 91234 56789',
    description: 'Temple pujari family. Home deity worship instruction hub.',
    occupation: 'Temple Priest',
  },
];

// Route Paths (e.g., Festival/Rath Yatra routes)
export const routesData = [
  {
    id: 'rath-yatra',
    name: 'Annual Rath Yatra Grand Procession Route',
    description: 'Route of the Lord Jagannath chariot cart starting from ISKCON Temple, moving via Benachity Market and concluding at the City Centre Gundicha Temple Mandap.',
    color: '#f97316', // Orange
    distance: '6.4 km',
    duration: 'Approx. 5 Hours (Festive pace)',
    coordinates: [
      [23.5413, 87.3015], // ISKCON Temple (Start)
      [23.5435, 87.3050], // A-Zone crossing
      [23.5450, 87.3110], // Bhiringi Crossing
      [23.5510, 87.3150], // Benachity Market (Namahatta Stop)
      [23.5380, 87.3180], // Nachan Road Junction
      [23.5310, 87.3120], // Gandhi More
      [23.5285, 87.2920], // City Centre Gundicha Mandap (Destination)
    ],
    stops: [
      { name: 'ISKCON Temple (Arati & Start)', time: '02:00 PM' },
      { name: 'Bhiringi Chhau Dance Welcoming', time: '03:15 PM' },
      { name: 'Benachity Namahatta Chappan Bhog Offerings', time: '04:30 PM' },
      { name: 'Gandhi More Chariot Pulling Rest Stop', time: '06:00 PM' },
      { name: 'City Centre Gundicha Mandap (Maha Arati)', time: '07:15 PM' },
    ],
  },
  {
    id: 'weekly-harinam',
    name: 'Weekly Saturday Evening Harinam Sankirtan Route',
    description: 'Devotees chanting and distributing books in a walking procession through public spaces.',
    color: '#a855f7', // Purple
    distance: '2.1 km',
    duration: '1.5 Hours',
    coordinates: [
      [23.5285, 87.2920], // City Centre Gandhi More
      [23.5295, 87.2960], // Junction Mall
      [23.5260, 87.2980], // Commercial complex lane
      [23.5240, 87.2990], // Amit Das House (Prasadam distribution end point)
    ],
    stops: [
      { name: 'Gandhi More (Start)', time: '05:30 PM' },
      { name: 'Junction Mall Plaza (Megaphone Sankirtan)', time: '06:00 PM' },
      { name: 'Amit Das House (Prasadam feast)', time: '07:00 PM' },
    ],
  },
];
