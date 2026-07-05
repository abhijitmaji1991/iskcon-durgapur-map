<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'id' => 'dgp-temple',
                'name' => 'ISKCON Durgapur (Sri Sri Radha Madhav Sundar Mandir)',
                'category' => 'temple',
                'lat' => 23.5413,
                'lng' => 87.3015,
                'address' => 'Albert Einstein Avenue, A-Zone, Durgapur, West Bengal 713205',
                'phone' => '+91 343 256 4582',
                'description' => 'The main temple and community center. Daily programs include Mangala Arati, Srimad Bhagavatam class, and evening Sandhya Arati. Free Sunday feast prasadam served to all.',
                'timings' => '04:30 AM - 01:00 PM, 04:30 PM - 08:30 PM',
                'president' => 'HG Mukunda Bhakti Das',
                'image' => 'https://images.unsplash.com/photo-1609137982420-b18854d97c54?auto=format&fit=crop&w=400&q=80',
            ],
            [
                'id' => 'nh-benachity',
                'name' => 'Benachity Namahatta Center',
                'category' => 'namahatta',
                'lat' => 23.5510,
                'lng' => 87.3150,
                'address' => 'Benachity Market Road, Near Janata High School, Durgapur',
                'phone' => '+91 98321 45678',
                'description' => 'Weekly congregational programs every Saturday evening from 6:30 PM to 8:30 PM. Includes bhajan, Bhagavad Gita discussion, and Prasadam distribution.',
                'leader' => 'HG Gouranga Chandra Das',
                'active_members' => 45,
            ],
            [
                'id' => 'nh-citycentre',
                'name' => 'City Centre Namahatta Sanga',
                'category' => 'namahatta',
                'lat' => 23.5285,
                'lng' => 87.2920,
                'address' => 'Ambuja Housing Complex, Phase II, City Centre, Durgapur',
                'phone' => '+91 94747 12345',
                'description' => 'Weekly group meets every Friday at 7:00 PM. Focusing on corporate youth and families in the City Centre area.',
                'leader' => 'HG Nitai Pada Das',
                'active_members' => 30,
            ],
            [
                'id' => 'nh-bidhannagar',
                'name' => 'Bidhannagar Namahatta Sanga',
                'category' => 'namahatta',
                'lat' => 23.5090,
                'lng' => 87.3310,
                'address' => 'Near Bidhannagar Sub-Post Office, Sector 2A, Durgapur',
                'phone' => '+91 81160 98765',
                'description' => 'Congregational center serving local students of NIT Durgapur and local families. Weekly classes on Sunday evenings.',
                'leader' => 'Dr. Debasish Sen (Devoted Bhakta)',
                'active_members' => 60,
            ],
            [
                'id' => 'nh-steel',
                'name' => 'Steel Township Namahatta Sanga',
                'category' => 'namahatta',
                'lat' => 23.5540,
                'lng' => 87.2750,
                'address' => 'B-Zone Community Hall Lane, Steel Township, Durgapur',
                'phone' => '+91 90022 55443',
                'description' => 'Weekly congregational meeting on Tuesdays from 6:30 PM. Serves families of DSP steel plant employees.',
                'leader' => 'HG Jagannath Mishra Das',
                'active_members' => 25,
            ],
            [
                'id' => 'bh-amit',
                'name' => 'Amit Das & Family (Bhakta House)',
                'category' => 'bhakta',
                'lat' => 23.5240,
                'lng' => 87.2990,
                'address' => 'Quarter 12/B, Street 15, City Centre, Durgapur',
                'phone' => '+91 97755 88990',
                'description' => 'Home program hosting Namahatta sangas once a month. Active in book distribution.',
                'occupation' => 'Software Engineer',
            ],
            [
                'id' => 'bh-rajesh',
                'name' => 'Rajesh Sharma & Family (Bhakta House)',
                'category' => 'bhakta',
                'lat' => 23.5470,
                'lng' => 87.3220,
                'address' => 'Nivedita Avenue, Benachity, Durgapur',
                'phone' => '+91 98833 77441',
                'description' => 'Host for Rath Yatra prasadam cooking seva. Family active in temple kitchen service.',
                'occupation' => 'Businessman',
            ],
            [
                'id' => 'bh-gouranga',
                'name' => 'Gouranga Das & Family (Bhakta House)',
                'category' => 'bhakta',
                'lat' => 23.5120,
                'lng' => 87.3380,
                'address' => 'G-14, Bidhannagar Housing Estate, Durgapur',
                'phone' => '+91 80011 22334',
                'description' => 'Youth coordinator house. Weekly NIT student Gita study group meets here.',
                'occupation' => 'Professor, NIT Durgapur',
            ],
            [
                'id' => 'bh-vinod',
                'name' => 'Vinod Gupta & Family (Bhakta House)',
                'category' => 'bhakta',
                'lat' => 23.5440,
                'lng' => 87.3420,
                'address' => 'Mamra Bazar Main Road, Durgapur',
                'phone' => '+91 93322 11005',
                'description' => 'Regular donor and festival volunteer family. Grocery store owner.',
                'occupation' => 'Merchant',
            ],
            [
                'id' => 'bh-sridhar',
                'name' => 'Sridhar Das & Family (Bhakta House)',
                'category' => 'bhakta',
                'lat' => 23.5385,
                'lng' => 87.2940,
                'address' => 'Qtr 4A-12, A-Zone, Durgapur',
                'phone' => '+91 91234 56789',
                'description' => 'Temple pujari family. Home deity worship instruction hub.',
                'occupation' => 'Temple Priest',
            ],
        ];

        foreach ($locations as $loc) {
            Location::updateOrCreate(['id' => $loc['id']], $loc);
        }
    }
}
