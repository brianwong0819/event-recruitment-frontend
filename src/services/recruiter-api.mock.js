/**
 * Mock data for recruiters and companies
 */
const mockRecruiters = [
  {
    id: '1',
    company: 'Shan Poornam Metals Sdn Bhd',
    industry: 'Manufacturing, Transport & Logistics',
    companySize: '101-1,000 employees',
    yearFounded: '1998',
    location: 'Penang, Malaysia',
    description:
      "We are established company specializing in Waste Management Service Provider, servicing MNC's throughout Malaysia. We manage e-waste especially intellectual property rights protection by converting the e-waste to raw material for other industries with full environmental compliance. The company enjoys a good reputation in the international market and becomes as well-trusted partner of domestic and overseas clients. Currently, we are expanding our business and seeking for a suitable candidate with experience to be based at our HQ.",
    address:
      'Plot 34 (No. 1479), Lorong Perusahaan Maju 6, Kawasan Perindustrian Perai, Fasa 4, 13600 Perai, Pulau Pinang.',
    googleMapsUrl: 'https://maps.google.com',
    logoUrl: null, // Will use placeholder
    email: 'contact@shanpoornam.com',
    phone: '+60 4-123 4567',
    website: 'https://www.shanpoornam.com',
    linkedIn: 'https://www.linkedin.com/company/shanpoornam',
    openPositions: 5,
    values: [
      {
        title: 'Environmental Responsibility',
        description:
          'We are committed to sustainable practices and minimizing environmental impact.',
      },
      {
        title: 'Innovation',
        description:
          'We constantly seek new and better ways to serve our clients and protect the environment.',
      },
      {
        title: 'Integrity',
        description:
          'We operate with transparency and honesty in all our business dealings.',
      },
    ],
    portfolio: [
      {
        id: '1',
        title: 'Corporate Event Series',
        description:
          'A series of high-profile corporate events organized for a Fortune 500 company across multiple locations.',
        imageUrl:
          'https://via.placeholder.com/600x400/4f46e5/ffffff?text=Project+1',
        tags: ['Corporate', 'Events'],
      },
      {
        id: '2',
        title: 'Annual Tech Conference',
        description:
          'A large-scale technology conference with over 5,000 attendees, featuring top industry speakers.',
        imageUrl:
          'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Project+2',
        tags: ['Technology', 'Conference'],
      },
      {
        id: '3',
        title: 'Charity Fundraising Gala',
        description:
          'An elegant charity gala that raised over $2 million for educational initiatives in underserved communities.',
        imageUrl:
          'https://via.placeholder.com/600x400/ec4899/ffffff?text=Project+3',
        tags: ['Charity', 'Fundraising'],
      },
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        company: 'Tech Innovations Inc.',
        rating: 5,
        testimonial:
          'Working with this team has been an absolute pleasure. They organized our corporate retreat flawlessly and with great attention to detail.',
      },
      {
        name: 'Michael Chen',
        company: 'Global Finance Group',
        rating: 4,
        testimonial:
          'Their professionalism and expertise made our annual conference a huge success. I highly recommend their services for any corporate event.',
      },
      {
        name: 'Aisha Patel',
        company: 'Creative Solutions Ltd',
        rating: 5,
        testimonial:
          'The team went above and beyond to ensure our product launch was perfect. Their staff was courteous, efficient, and highly professional.',
      },
    ],
  },
  {
    id: '2',
    company: 'TechVision Global',
    industry: 'Information Technology',
    companySize: '500-1,000 employees',
    yearFounded: '2005',
    location: 'Kuala Lumpur, Malaysia',
    description:
      'TechVision Global is a leading provider of innovative IT solutions for businesses worldwide. With expertise in cloud computing, artificial intelligence, and digital transformation, we help organizations streamline operations and drive growth in the digital age.',
    address: '123 Tech Tower, Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
    googleMapsUrl: 'https://maps.google.com',
    logoUrl: null,
    email: 'info@techvisionglobal.com',
    phone: '+60 3-2145 6789',
    website: 'https://www.techvisionglobal.com',
    linkedIn: 'https://www.linkedin.com/company/techvisionglobal',
    openPositions: 12,
    values: [
      {
        title: 'Innovation',
        description:
          'We push boundaries and embrace new technologies to solve complex problems.',
      },
      {
        title: 'Excellence',
        description:
          'We are committed to delivering the highest quality solutions in everything we do.',
      },
      {
        title: 'Collaboration',
        description:
          'We believe in the power of teamwork and partnerships to achieve greater outcomes.',
      },
    ],
    portfolio: [
      {
        id: '1',
        title: 'AI-Powered Analytics Platform',
        description:
          'Developed a comprehensive analytics platform using artificial intelligence for a major financial institution.',
        imageUrl:
          'https://via.placeholder.com/600x400/3b82f6/ffffff?text=AI+Project',
        tags: ['AI', 'Analytics', 'Finance'],
      },
      {
        id: '2',
        title: 'Smart City Infrastructure',
        description:
          'Implemented IoT solutions for smart city management, including traffic control and energy optimization.',
        imageUrl:
          'https://via.placeholder.com/600x400/10b981/ffffff?text=Smart+City',
        tags: ['IoT', 'Infrastructure', 'Smart City'],
      },
      {
        id: '3',
        title: 'Healthcare Management System',
        description:
          'Created an integrated healthcare management system for a network of hospitals, improving patient care and operational efficiency.',
        imageUrl:
          'https://via.placeholder.com/600x400/ef4444/ffffff?text=Healthcare',
        tags: ['Healthcare', 'Management', 'Software'],
      },
    ],
    testimonials: [
      {
        name: 'David Lim',
        company: 'Pacific Bank Group',
        rating: 5,
        testimonial:
          "TechVision's AI analytics platform transformed our data processing capabilities, providing invaluable insights for our business decisions.",
      },
      {
        name: 'Emily Wong',
        company: 'Metropolitan Healthcare',
        rating: 5,
        testimonial:
          'The healthcare management system developed by TechVision has revolutionized how we operate, saving time and improving patient outcomes.',
      },
      {
        name: 'Rajesh Kumar',
        company: 'Global Logistics Corporation',
        rating: 4,
        testimonial:
          'Their technical expertise and professional approach made our digital transformation journey smooth and successful.',
      },
    ],
  },
];

/**
 * Mock Recruiter API service
 */
class RecruiterApiMock {
  /**
   * Get recruiter by ID
   * @param {string} id - Recruiter ID
   * @returns {Promise} Promise that resolves to recruiter data
   */
  getRecruiterById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const recruiter = mockRecruiters.find((r) => r.id === id);

        if (recruiter) {
          resolve(recruiter);
        } else {
          reject(new Error('Recruiter not found'));
        }
      }, 800); // Simulate network delay
    });
  }

  /**
   * Get all recruiters
   * @returns {Promise} Promise that resolves to an array of recruiters
   */
  getAllRecruiters() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecruiters);
      }, 800);
    });
  }

  /**
   * Search recruiters by name
   * @param {string} query - Search query
   * @returns {Promise} Promise that resolves to an array of matching recruiters
   */
  searchRecruiters(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchResults = mockRecruiters.filter((recruiter) =>
          recruiter.company.toLowerCase().includes(query.toLowerCase())
        );
        resolve(searchResults);
      }, 500);
    });
  }
}

export default new RecruiterApiMock();
