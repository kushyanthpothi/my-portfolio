// Firebase Seeding Script for Blog Posts
// Run this once to add sample blog data to Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const blogPosts = [
    {
        slug: "nvidia-rubin-ai-platform-ces-2026",
        title: "NVIDIA Unveils Rubin AI Platform with Six Revolutionary Chips",
        excerpt: "NVIDIA's latest Rubin AI platform promises to dramatically reduce data processing costs with its new chip architecture, marking a significant leap in AI computing efficiency.",
        content: `NVIDIA has made waves at CES 2026 with the announcement of its groundbreaking Rubin AI platform, featuring six new chips designed to revolutionize how we approach artificial intelligence processing.

## What is the Rubin Platform?

The Rubin AI platform represents NVIDIA's next-generation approach to AI computing. Named after astronomer Vera Rubin, this platform is designed to significantly reduce the cost of data processing for AI applications, making advanced AI capabilities more accessible to businesses of all sizes.

## Key Features

**Six New Chip Designs**
The platform introduces six distinct chip designs, each optimized for different aspects of AI workloads. This modular approach allows organizations to build systems tailored to their specific needs, whether focused on training large language models or running real-time inference at scale.

**Cost Efficiency**
One of the most significant advantages of the Rubin platform is its focus on cost reduction. NVIDIA claims the new architecture can reduce data processing costs by up to 40% compared to previous generations, making AI more economically viable for a broader range of applications.

**Enhanced Performance**
The chips feature improved memory bandwidth and energy efficiency, enabling faster processing of complex AI models while consuming less power. This is particularly important for data centers looking to scale their AI capabilities without proportionally increasing their energy consumption.

## Industry Impact

The Rubin platform is expected to have far-reaching implications across industries. From healthcare to autonomous vehicles, the improved cost-efficiency and performance will enable organizations to deploy more sophisticated AI solutions.

## Availability

NVIDIA has announced that the first Rubin-based products will be available to enterprise customers in Q3 2026, with broader availability expected by the end of the year.`,
        category: "AI & Machine Learning",
        date: "January 8, 2026",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
        author: "Kushyanth Pothineni",
        readTime: "5 min read",
        featured: true
    },
    {
        slug: "lenovo-rollable-display-laptop-ces-2026",
        title: "Lenovo's Rollable Display Laptop Transforms Screen Real Estate",
        excerpt: "Lenovo showcases revolutionary rollable display technology at CES 2026, allowing laptop screens to expand vertically or horizontally on demand.",
        content: `Lenovo has unveiled a groundbreaking laptop concept at CES 2026 that features rollable display technology, fundamentally changing how we think about portable computing.

## The Future of Laptop Displays

The new prototype demonstrates screens that can physically expand and contract, offering users the flexibility to choose their viewing area based on their current task. This innovation addresses one of the most persistent limitations of laptop computing: the fixed screen size.

## How It Works

**Flexible OLED Technology**
The display uses advanced flexible OLED panels that can roll up and down like a scroll. The screen is housed in a specially designed mechanism that allows for smooth, controlled expansion.

**Multiple Configurations**
Users can operate the laptop in several modes:
- Standard mode: 14-inch display for typical productivity tasks
- Extended mode: Screen expands vertically to 17 inches for coding or document work
- Wide mode: Horizontal expansion for video editing and multitasking

**Durability Testing**
Lenovo claims the display mechanism has been tested for over 20,000 expansion cycles, ensuring long-term reliability comparable to traditional laptops.

## Practical Applications

The technology is particularly appealing for:
- Software developers who need more vertical space for code
- Content creators working with video timelines
- Business professionals who frequently work with spreadsheets
- Travelers who want a larger display without the bulk

## Release Timeline

While the current model is a concept device, Lenovo has indicated plans to bring a commercial version to market by late 2027, pending further development and refinement of the technology.`,
        category: "Gadgets",
        date: "January 8, 2026",
        coverImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop",
        author: "Kushyanth Pothineni",
        readTime: "4 min read",
        featured: false
    },
    {
        slug: "motorola-razr-fold-foldable-smartphone-2026",
        title: "Motorola Razr Fold: A New Era for Foldable Smartphones",
        excerpt: "Motorola enters the large foldable market with the Razr Fold, challenging Samsung's dominance with its unique approach to foldable design.",
        content: `Motorola has announced its entry into the book-style foldable smartphone market with the new Razr Fold, marking a significant expansion of its foldable phone lineup.

## Breaking into Book-Style Foldables

While Motorola has been successful with its flip-style Razr phones, the Razr Fold represents the company's first venture into the larger, book-style foldable category dominated by Samsung's Galaxy Z Fold series.

## Design and Features

**Display Specifications**
- Inner Display: 7.6-inch LTPO OLED with 120Hz refresh rate
- Cover Display: 3.2-inch AMOLED for quick interactions
- Ultra Thin Glass (UTG) for improved durability

**Hardware**
The Razr Fold is powered by the latest Qualcomm Snapdragon 8 Gen 4 processor, paired with 12GB of RAM and up to 512GB of storage.

**Camera System**
- 50MP main sensor with OIS
- 12MP ultrawide lens
- 10MP telephoto with 3x optical zoom
- 10MP inner selfie camera

## Unique Features

**Flex Mode Enhancements**
Motorola has developed custom software features that take advantage of the foldable form factor, including enhanced multitasking and a redesigned camera interface that uses both screen halves effectively.

**Durability**
The device features an IPX8 water resistance rating and uses a reinforced hinge mechanism that Motorola claims can withstand 400,000 folds.

## Pricing and Availability

The Motorola Razr Fold will be available in February 2026, starting at $1,599, positioning it competitively against Samsung's offerings.`,
        category: "Mobile",
        date: "January 8, 2026",
        coverImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop",
        author: "Kushyanth Pothineni",
        readTime: "4 min read",
        featured: false
    },
    {
        slug: "boston-dynamics-atlas-commercial-2028",
        title: "Boston Dynamics Atlas Robot Going Commercial by 2028",
        excerpt: "The iconic humanoid robot Atlas is set to become a commercial product, marking a historic milestone in robotics and automation.",
        content: `Boston Dynamics has announced that its famous Atlas humanoid robot will transition from a research platform to a commercial product by 2028, representing a major milestone in the robotics industry.

## From Research to Reality

Atlas has been one of the most recognized robots in the world, known for its impressive demonstrations of parkour, dancing, and complex physical tasks. Now, the company is preparing to bring this technology to practical commercial applications.

## Commercial Applications

**Manufacturing**
Atlas is being designed to work alongside humans in manufacturing environments, handling tasks that are difficult or dangerous for human workers. Its human-like form factor allows it to operate in spaces designed for people without requiring infrastructure modifications.

**Logistics**
The robot's ability to navigate complex environments and manipulate objects makes it ideal for warehouse and logistics applications, moving goods through facilities that weren't designed for traditional automation.

**Construction**
Boston Dynamics is exploring applications in construction, where Atlas could handle heavy materials and operate in challenging terrain typical of job sites.

## Technical Capabilities

**Mobility**
- Walking, running, and climbing capabilities
- Balance recovery from pushes and impacts
- Navigation on uneven terrain

**Manipulation**
- Two-handed object manipulation
- Precise movements for assembly tasks
- Lifting capacity of up to 25 kg

## Safety and Integration

Boston Dynamics is working closely with safety regulators to ensure Atlas meets all requirements for human-robot collaboration. The commercial version will include enhanced sensors and software for safe operation in shared workspaces.

## Market Impact

This announcement signals the beginning of a new era in humanoid robotics, moving from impressive demonstrations to practical utility. Industry analysts expect the commercial Atlas to significantly impact labor markets and manufacturing capabilities.`,
        category: "Robotics",
        date: "January 8, 2026",
        coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop",
        author: "Kushyanth Pothineni",
        readTime: "5 min read",
        featured: false
    },
    {
        slug: "solid-state-battery-ev-motorcycle-370-miles",
        title: "Verge Announces EV Motorcycle with 370-Mile Range and 10-Minute Charging",
        excerpt: "Revolutionary solid-state battery technology enables unprecedented range and charging speeds in Verge's new electric motorcycle.",
        content: `Verge Motorcycles has unveiled a new electric motorcycle at CES 2026 that promises to address two of the biggest concerns in EV adoption: range and charging time.

## Breaking EV Barriers

The new Verge model features solid-state battery technology that delivers a stunning 370-mile range on a single charge, along with the ability to reach 80% charge in just 10 minutes.

## Solid-State Battery Revolution

**What Makes It Different**
Unlike traditional lithium-ion batteries, solid-state batteries use solid electrolytes instead of liquid ones. This fundamental change offers several advantages:

- Higher energy density for more range
- Faster charging capabilities
- Improved safety with reduced fire risk
- Longer lifespan with more charge cycles

**Technical Specifications**
- Battery Capacity: 25 kWh
- Range: 370 miles (595 km)
- Fast Charging: 10-80% in 10 minutes
- Motor Output: 180 kW (241 hp)
- Top Speed: 180 mph (290 km/h)

## Impact on EV Industry

The successful implementation of solid-state batteries in a production vehicle represents a significant milestone. If these specs hold up in real-world conditions, they could accelerate adoption of solid-state technology across the entire EV industry.

## Production Timeline

Verge has announced that the motorcycle will enter production in Q4 2026, with deliveries beginning in early 2027. The company is targeting an initial production run of 5,000 units.

## Pricing

The motorcycle is expected to be priced at approximately $35,000, positioning it as a premium offering but competitive with other high-performance electric motorcycles.

## Industry Implications

This announcement puts pressure on car manufacturers to accelerate their solid-state battery programs. Several major automakers, including Toyota and BMW, have been working on similar technology but have faced delays in bringing products to market.`,
        category: "Electric Vehicles",
        date: "January 8, 2026",
        coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
        author: "Kushyanth Pothineni",
        readTime: "5 min read",
        featured: false
    }
];

async function seedBlogs() {
    console.log('Starting to seed blog posts...');

    for (const blog of blogPosts) {
        try {
            await setDoc(doc(db, 'blogs', blog.slug), blog);
            console.log(`✓ Added blog: ${blog.title}`);
        } catch (error) {
            console.error(`✗ Failed to add blog: ${blog.title}`, error);
        }
    }

    console.log('\nSeeding complete!');
}

seedBlogs();
