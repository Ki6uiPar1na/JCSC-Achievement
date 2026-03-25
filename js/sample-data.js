// Sample data for demo purposes (when CSV files can't be loaded)
const SAMPLE_DATA = {
    achievements: [
        {
            title: "National Cyber Security CTF Championship 2026 - 🥇 1st Place",
            description: "🏆 Team: Code Breakers\n\n👥 Team Members:\n   • Md. Ariful Islam\n   • Tasnim Jahan\n   • Fahim Ahmed\n   • Nusrat Jahan\n\n💰 Prize Money: ৳50,000",
            date: "2026-03-15",
            image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"
        },
        {
            title: "Inter University Hacking Challenge - 🥈 2nd Place",
            description: "🏆 Team: Binary Warriors\n\n👥 Team Members:\n   • Rahim Khan\n   • Sumaiya Akter\n   • Kamal Hassan\n\n💰 Prize Money: ৳30,000",
            date: "2026-02-28",
            image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400"
        },
        {
            title: "Google Bug Bounty Program - 🥇 1st Place",
            description: "🏆 Team: Solo Achievement\n\n👥 Team Members:\n   • Rafiqul Islam\n\n💰 Prize Money: ৳25,000",
            date: "2026-02-10",
            image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
        },
        {
            title: "BDOSN Capture The Flag Competition - 🥉 3rd Place",
            description: "🏆 Team: Cyber Hawks\n\n👥 Team Members:\n   • Sadia Rahman\n   • Rakib Hasan\n   • Faria Sultana\n   • Mehedi Hasan\n\n💰 Prize Money: ৳15,000",
            date: "2026-02-05",
            image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
        },
        {
            title: "National Hackathon 2025 - 🥇 1st Place",
            description: "🏆 Team: Innovation Squad\n\n👥 Team Members:\n   • Tanvir Ahmed\n   • Nadia Islam\n   • Sabbir Khan\n   • Riya Chowdhury\n   • Imran Hossain\n\n💰 Prize Money: ৳100,000",
            date: "2025-12-20",
            image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400"
        },
        {
            title: "Asia Pacific CTF Finals - 🥈 2nd Place",
            description: "🏆 Team: Elite Hackers\n\n👥 Team Members:\n   • Ashraf Ali\n   • Fatema Begum\n   • Saif Rahman\n\n💰 Prize Money: ৳40,000",
            date: "2025-11-15",
            image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"
        }
    ],
    
    members: [
        {
            name: "Alex Morgan",
            role: "President",
            bio: "Passionate cybersecurity researcher with 3 years of CTF experience. Specializes in web application security and penetration testing.",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "alex@cybersecclub.edu"
        },
        {
            name: "Sarah Chen",
            role: "Vice President",
            bio: "Network security enthusiast and certified ethical hacker. Focuses on infrastructure security and incident response.",
            image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "sarah@cybersecclub.edu"
        }
    ],
    
    alumni: [
        {
            name: "James Wilson",
            batch: "2023",
            position: "Senior Security Analyst",
            company: "Google",
            linkedin: "https://linkedin.com/in/jameswilson"
        },
        {
            name: "Maria Garcia",
            batch: "2023",
            position: "Penetration Tester",
            company: "Microsoft",
            linkedin: "https://linkedin.com/in/mariagarcia"
        },
        {
            name: "Robert Johnson",
            batch: "2022",
            position: "Security Engineer",
            company: "Amazon",
            linkedin: "https://linkedin.com/in/robertjohnson"
        }
    ],
    
    events: [
        {
            title: "Advanced Web Security Workshop",
            description: "Hands-on workshop covering OWASP Top 10 vulnerabilities with live demonstrations.",
            date: "2026-04-20",
            time: "2:00 PM",
            location: "Computer Lab A",
            category: "workshop",
            image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
            gallery: "",
            registration_link: "https://forms.google.com/workshop1"
        },
        {
            title: "National CTF Competition 2026",
            description: "Join us for the biggest Capture The Flag competition of the year.",
            date: "2026-05-15",
            time: "9:00 AM",
            location: "Online Platform",
            category: "competition",
            image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
            gallery: "",
            registration_link: "https://ctf.cybersecclub.edu"
        }
    ],
    
    contests: [
        {
            title: "Spring CTF Challenge 2026",
            description: "Test your hacking skills in our quarterly CTF competition.",
            start_date: "2026-04-01",
            end_date: "2026-04-30",
            prize: "$1000 + Certificates",
            rules: "1. Teams of up to 4 members allowed. 2. No attacking competition infrastructure.",
            registration_link: "https://ctf.cybersecclub.edu/register",
            results_link: ""
        },
        {
            title: "Secure Code Review Contest",
            description: "Find security vulnerabilities in provided code samples.",
            start_date: "2026-05-01",
            end_date: "2026-05-15",
            prize: "$500 + Recognition",
            rules: "1. Individual participation only. 2. Submit findings in PDF format.",
            registration_link: "https://forms.google.com/contest1",
            results_link: ""
        }
    ]
};
