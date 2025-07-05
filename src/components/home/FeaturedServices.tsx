import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Router, Database, GraduationCap, Cpu, Palette, BookOpen, Zap, BarChart3, Globe, Workflow, CircuitBoard, X, Check, Clock, Users } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ProjectInquiryForm from '../forms/ProjectInquiryForm';

const services = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies and best practices.',
    icon: '🌐',
    features: ['Responsive Design', 'Modern Frameworks', 'Performance Optimized'],
    category: 'Development',
    detailedDescription: 'We create stunning, responsive websites and powerful web applications using cutting-edge technologies like React, Next.js, and TypeScript. Our development process focuses on performance, SEO optimization, and user experience.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    deliverables: ['Responsive Website', 'Source Code', 'Documentation', 'SEO Optimization', 'Performance Report'],
    timeline: '2-8 weeks',
    pricing: 'Starting from $500',
  },
  {
    id: 2,
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile solutions for iOS and Android platforms.',
    icon: '📱',
    features: ['Cross-Platform', 'Native Performance', 'App Store Ready'],
    category: 'Development',
    detailedDescription: 'Build powerful mobile applications that work seamlessly across iOS and Android platforms. We use React Native and Flutter to deliver native-like performance with cross-platform compatibility.',
    technologies: ['React Native', 'Flutter', 'Firebase', 'Redux', 'SQLite', 'API Integration'],
    deliverables: ['Mobile App (iOS & Android)', 'App Store Submission', 'User Guide', 'Backend Integration', 'Testing Report'],
    timeline: '4-12 weeks',
    pricing: 'Starting from $800',
  },
  {
    id: 3,
    title: 'Cisco Packet Tracer',
    description: 'Network simulation and configuration using Cisco Packet Tracer for educational and training purposes.',
    icon: <Router className="text-primary-500" size={32} />,
    features: ['Network Simulation', 'CCNA Training', 'Lab Exercises'],
    category: 'Networking',
    detailedDescription: 'Master network design and troubleshooting with comprehensive Cisco Packet Tracer projects. Perfect for CCNA preparation, academic assignments, and hands-on networking experience.',
    technologies: ['Cisco Packet Tracer', 'Network Protocols', 'Routing & Switching', 'VLANs', 'OSPF', 'EIGRP'],
    deliverables: ['Network Topology', 'Configuration Files', 'Documentation', 'Lab Exercises', 'Troubleshooting Guide'],
    timeline: '1-3 weeks',
    pricing: 'Starting from $150',
  },
  {
    id: 4,
    title: 'Network Design',
    description: 'Complete network infrastructure design and implementation for businesses of all sizes.',
    icon: '🔗',
    features: ['Infrastructure Design', 'Security Implementation', 'Performance Optimization'],
    category: 'Networking',
    detailedDescription: 'Design robust network infrastructures that scale with your business. From small office setups to enterprise-level networks, we ensure security, performance, and reliability.',
    technologies: ['Cisco Equipment', 'Firewall Configuration', 'VPN Setup', 'Load Balancing', 'Network Monitoring'],
    deliverables: ['Network Architecture', 'Security Plan', 'Implementation Guide', 'Performance Metrics', 'Maintenance Schedule'],
    timeline: '3-8 weeks',
    pricing: 'Starting from $1000',
  },
  {
    id: 5,
    title: 'Custom Software',
    description: 'Tailor-made software solutions designed to meet your specific business needs.',
    icon: '💻',
    features: ['Business Logic', 'Custom Workflows', 'Scalable Architecture'],
    category: 'Development',
    detailedDescription: 'Develop bespoke software solutions that perfectly align with your business processes. From inventory management to CRM systems, we build software that grows with your business.',
    technologies: ['Python', 'Java', 'C#', 'PostgreSQL', 'Docker', 'Microservices'],
    deliverables: ['Custom Application', 'User Training', 'Documentation', 'Support Plan', 'Source Code'],
    timeline: '6-16 weeks',
    pricing: 'Starting from $2000',
  },
  {
    id: 6,
    title: 'API Development',
    description: 'Robust and scalable APIs to connect your systems and enable seamless integrations.',
    icon: '🔌',
    features: ['RESTful APIs', 'GraphQL', 'Real-time Data'],
    category: 'Development',
    detailedDescription: 'Build powerful APIs that serve as the backbone of your digital ecosystem. Our APIs are designed for scalability, security, and ease of integration with third-party services.',
    technologies: ['Node.js', 'Express', 'GraphQL', 'REST', 'JWT Authentication', 'Rate Limiting'],
    deliverables: ['API Endpoints', 'Documentation', 'Authentication System', 'Testing Suite', 'Deployment Guide'],
    timeline: '2-6 weeks',
    pricing: 'Starting from $400',
  },
  {
    id: 7,
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that enhance user experience and drive engagement.',
    icon: '🎨',
    features: ['User Research', 'Prototyping', 'Interaction Design'],
    category: 'Design',
    detailedDescription: 'Create exceptional user experiences through thoughtful design and user research. We design interfaces that are not only beautiful but also functional and user-friendly.',
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision', 'Miro'],
    deliverables: ['Design System', 'Wireframes', 'Prototypes', 'User Journey Maps', 'Style Guide'],
    timeline: '2-6 weeks',
    pricing: 'Starting from $300',
  },
  {
    id: 8,
    title: 'Capstone Projects',
    description: 'Complete capstone project development and guidance for academic requirements and portfolio building.',
    icon: <GraduationCap className="text-primary-500" size={32} />,
    features: ['Project Planning', 'Implementation', 'Documentation'],
    category: 'Academic',
    detailedDescription: 'Get expert guidance on your capstone project from conception to completion. We help you build impressive projects that showcase your skills and meet academic requirements.',
    technologies: ['Various based on project', 'Research Methods', 'Documentation Tools', 'Presentation Software'],
    deliverables: ['Complete Project', 'Research Paper', 'Presentation', 'Source Code', 'Defense Preparation'],
    timeline: '8-16 weeks',
    pricing: 'Starting from $600',
  },
  {
    id: 9,
    title: 'Database Design',
    description: 'Efficient database architecture and management solutions for optimal performance and scalability.',
    icon: <Database className="text-primary-500" size={32} />,
    features: ['Schema Design', 'Query Optimization', 'Data Migration'],
    category: 'Development',
    detailedDescription: 'Design and optimize databases that handle your data efficiently and scale with your growth. From schema design to performance tuning, we ensure your data infrastructure is robust.',
    technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'ElasticSearch', 'Database Optimization'],
    deliverables: ['Database Schema', 'Migration Scripts', 'Performance Report', 'Backup Strategy', 'Documentation'],
    timeline: '2-6 weeks',
    pricing: 'Starting from $350',
  },
  {
    id: 10,
    title: 'Arduino & Tinkercad',
    description: 'Electronics prototyping and simulation using Arduino hardware and Tinkercad software.',
    icon: <CircuitBoard className="text-primary-500" size={32} />,
    features: ['Circuit Design', 'Sensor Integration', 'IoT Projects'],
    category: 'Electronics',
    detailedDescription: 'Bring your electronic ideas to life with Arduino projects and Tinkercad simulations. Perfect for IoT projects, automation systems, and educational purposes.',
    technologies: ['Arduino IDE', 'Tinkercad', 'C++', 'Sensors', 'Actuators', 'IoT Protocols'],
    deliverables: ['Circuit Design', 'Arduino Code', 'Simulation File', 'Component List', 'Assembly Guide'],
    timeline: '1-4 weeks',
    pricing: 'Starting from $200',
  },
  {
    id: 11,
    title: 'Machine Learning',
    description: 'AI and machine learning solutions to automate processes and extract valuable insights.',
    icon: <Cpu className="text-primary-500" size={32} />,
    features: ['Predictive Analytics', 'Automation', 'Data Processing'],
    category: 'AI/ML',
    detailedDescription: 'Harness the power of artificial intelligence to solve complex problems and automate decision-making processes. From predictive models to natural language processing.',
    technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas', 'Jupyter', 'AWS/GCP'],
    deliverables: ['ML Model', 'Training Data', 'Model Documentation', 'API Integration', 'Performance Metrics'],
    timeline: '4-12 weeks',
    pricing: 'Starting from $1500',
  },
  {
    id: 12,
    title: 'Graphic Design',
    description: 'Creative visual design services including logos, branding, and marketing materials.',
    icon: <Palette className="text-primary-500" size={32} />,
    features: ['Logo Design', 'Brand Identity', 'Marketing Graphics'],
    category: 'Design',
    detailedDescription: 'Create compelling visual identities that represent your brand perfectly. From logos to complete brand packages, we design graphics that make lasting impressions.',
    technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Canva Pro', 'Brand Guidelines'],
    deliverables: ['Logo Files', 'Brand Guidelines', 'Business Cards', 'Letterhead', 'Social Media Assets'],
    timeline: '1-4 weeks',
    pricing: 'Starting from $150',
  },
  {
    id: 13,
    title: 'School Programming Activities',
    description: 'Programming assignments, homework assistance, and coding projects for academic courses.',
    icon: <BookOpen className="text-primary-500" size={32} />,
    features: ['Homework Help', 'Code Review', 'Algorithm Design'],
    category: 'Academic',
    detailedDescription: 'Get expert help with programming assignments and projects. We provide guidance, code review, and explanations to help you learn and succeed in your coursework.',
    technologies: ['Python', 'Java', 'C++', 'JavaScript', 'Data Structures', 'Algorithms'],
    deliverables: ['Completed Assignment', 'Code Explanation', 'Documentation', 'Testing', 'Learning Materials'],
    timeline: '1-2 weeks',
    pricing: 'Starting from $50',
  },
  {
    id: 14,
    title: 'Performance Optimization',
    description: 'Fine-tune applications and systems for maximum speed, efficiency, and user experience.',
    icon: <Zap className="text-primary-500" size={32} />,
    features: ['Speed Optimization', 'Load Testing', 'Resource Management'],
    category: 'Development',
    detailedDescription: 'Optimize your applications and systems for peak performance. We identify bottlenecks, implement solutions, and ensure your systems run at maximum efficiency.',
    technologies: ['Performance Profiling', 'Caching Strategies', 'CDN Integration', 'Database Optimization', 'Code Refactoring'],
    deliverables: ['Performance Report', 'Optimization Plan', 'Implementation', 'Testing Results', 'Monitoring Setup'],
    timeline: '2-6 weeks',
    pricing: 'Starting from $400',
  },
  {
    id: 15,
    title: 'Data Analytics',
    description: 'Transform raw data into actionable insights with advanced analytics and visualization.',
    icon: <BarChart3 className="text-primary-500" size={32} />,
    features: ['Data Visualization', 'Business Intelligence', 'Reporting'],
    category: 'Analytics',
    detailedDescription: 'Turn your data into powerful insights with comprehensive analytics solutions. From data cleaning to interactive dashboards, we help you make data-driven decisions.',
    technologies: ['Python', 'R', 'Tableau', 'Power BI', 'SQL', 'Statistical Analysis'],
    deliverables: ['Data Dashboard', 'Analysis Report', 'Visualizations', 'Data Pipeline', 'Training Session'],
    timeline: '3-8 weeks',
    pricing: 'Starting from $700',
  },
  {
    id: 16,
    title: 'E-commerce Solutions',
    description: 'Complete online store development with payment integration and inventory management.',
    icon: <Globe className="text-primary-500" size={32} />,
    features: ['Online Stores', 'Payment Gateways', 'Inventory Systems'],
    category: 'Development',
    detailedDescription: 'Build comprehensive e-commerce platforms that drive sales and provide excellent customer experiences. From product catalogs to secure payment processing.',
    technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Inventory Management', 'Analytics'],
    deliverables: ['E-commerce Website', 'Payment Integration', 'Admin Panel', 'Mobile App', 'Training Manual'],
    timeline: '4-10 weeks',
    pricing: 'Starting from $1200',
  },
  {
    id: 17,
    title: 'Diagrams & Documentation',
    description: 'Professional diagrams including flowcharts, ERDs, UML, system architecture, and activity diagrams.',
    icon: <Workflow className="text-primary-500" size={32} />,
    features: ['Flowcharts', 'ERD Design', 'UML Diagrams'],
    category: 'Documentation',
    detailedDescription: 'Create professional technical diagrams and documentation that clearly communicate complex systems and processes. Perfect for presentations, documentation, and academic projects.',
    technologies: ['Lucidchart', 'Draw.io', 'Visio', 'PlantUML', 'Mermaid', 'Documentation Tools'],
    deliverables: ['Professional Diagrams', 'Documentation', 'Editable Files', 'Export Formats', 'Style Guide'],
    timeline: '1-3 weeks',
    pricing: 'Starting from $100',
  },
];

// Service Modal Component
const ServiceModal = ({ service, isOpen, onClose, onGetStarted }: { service: any; isOpen: boolean; onClose: () => void; onGetStarted: (service: any) => void }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-navy-700">
                <div className="flex items-center gap-4">
                  <div className="transform scale-110">
                    {typeof service.icon === 'string' ? (
                      <div className="text-4xl">{service.icon}</div>
                    ) : (
                      <div className="text-primary-500">{service.icon}</div>
                    )}
                  </div>
                  <div>
                    <span className="px-3 py-1 text-xs font-semibold bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
                      {service.category}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-2">{service.title}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-navy-800 hover:bg-navy-700 border border-navy-600 hover:border-primary-500/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Detailed Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About This Service</h3>
                  <p className="text-gray-300 leading-relaxed">{service.detailedDescription}</p>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-navy-800/50 rounded-lg border border-navy-700">
                        <Check size={16} className="text-primary-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Technologies & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-500/10 text-primary-300 rounded-lg border border-primary-500/20 text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">What You'll Get</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.deliverables.map((deliverable: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"></div>
                        <span className="text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-navy-700">
                  <div className="text-center">
                    <Clock className="text-primary-400 mx-auto mb-2" size={24} />
                    <h4 className="text-white font-semibold mb-1">Timeline</h4>
                    <p className="text-gray-400 text-sm">{service.timeline}</p>
                  </div>
                  <div className="text-center">
                    <Users className="text-primary-400 mx-auto mb-2" size={24} />
                    <h4 className="text-white font-semibold mb-1">Pricing</h4>
                    <p className="text-gray-400 text-sm">{service.pricing}</p>
                  </div>
                  <div className="text-center">
                    <Zap className="text-primary-400 mx-auto mb-2" size={24} />
                    <h4 className="text-white font-semibold mb-1">Category</h4>
                    <p className="text-gray-400 text-sm">{service.category}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    onClick={() => onGetStarted(service)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-3 bg-navy-800 hover:bg-navy-700 border border-navy-600 hover:border-primary-500/50 text-gray-300 hover:text-white rounded-lg font-semibold transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FeaturedServices = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<any>(null);
  
  // Calculate how many services to show per slide based on screen size
  const getServicesPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg screens
      if (window.innerWidth >= 768) return 2;  // md screens
      return 1; // small screens
    }
    return 3;
  };

  const [servicesPerSlide, setServicesPerSlide] = useState(getServicesPerSlide);
  const totalSlides = Math.ceil(services.length / servicesPerSlide);

  useEffect(() => {
    const handleResize = () => {
      const newServicesPerSlide = getServicesPerSlide();
      setServicesPerSlide(newServicesPerSlide);
      setCurrentSlide(0); // Reset to first slide on resize
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSlideTransition = (newSlide: number) => {
    if (isTransitioning || newSlide === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(newSlide);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const nextSlide = () => {
    const nextIndex = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    handleSlideTransition(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    handleSlideTransition(prevIndex);
  };

  const goToSlide = (index: number) => {
    handleSlideTransition(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning, totalSlides, isPaused]);

  const openServiceModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const openInquiryForm = (service?: any) => {
    setSelectedServiceForInquiry(service);
    setIsInquiryFormOpen(true);
    // Close service modal if open
    if (isModalOpen) {
      setIsModalOpen(false);
      setSelectedService(null);
    }
  };

  const closeInquiryForm = () => {
    setIsInquiryFormOpen(false);
    setSelectedServiceForInquiry(null);
  };

  return (
    <section className="py-20 bg-navy-800 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Our Services"
          subtitle="Professional development and networking solutions tailored to meet your business requirements with precision and excellence."
          centered
        />

        {/* Services Carousel */}
        <div className="relative mt-16">
          {/* Previous Arrow - Positioned absolutely */}
          <button
            onClick={prevSlide}
            disabled={totalSlides <= 1 || isTransitioning}
            className="absolute z-20 w-14 h-14 bg-navy-900/90 backdrop-blur-sm border border-navy-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-navy-700 hover:border-primary-500/50 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ 
              left: '-32px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Previous services"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Next Arrow - Positioned absolutely */}
          <button
            onClick={nextSlide}
            disabled={totalSlides <= 1 || isTransitioning}
            className="absolute z-20 w-14 h-14 bg-navy-900/90 backdrop-blur-sm border border-navy-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-navy-700 hover:border-primary-500/50 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ 
              right: '-32px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Next services"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>

          {/* Services Grid */}
          <div className="overflow-hidden mx-8">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {services.slice(slideIndex * servicesPerSlide, (slideIndex + 1) * servicesPerSlide).map((service, index) => (
                    <motion.div
                      key={service.id}
                      className="card h-full flex flex-col p-8 group hover:shadow-2xl transition-all duration-300 border border-navy-700 hover:border-primary-500/30"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ 
                        y: -8, 
                        boxShadow: '0 25px 50px -10px rgba(0, 191, 255, 0.25)',
                        scale: 1.02
                      }}
                    >
                                             {/* Category Badge */}
                       <div className="flex justify-between items-start mb-4">
                         <span className="px-3 py-1 text-xs font-semibold bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
                           {service.category}
                         </span>
                         <div className="transform group-hover:scale-110 transition-transform duration-300">
                           {typeof service.icon === 'string' ? (
                             <div className="text-3xl">{service.icon}</div>
                           ) : (
                             service.icon
                           )}
                         </div>
                       </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors duration-300">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 mb-6 flex-grow text-sm leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-xs text-gray-300">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3 opacity-80"></div>
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Learn More Button */}
                      <motion.button 
                        onClick={() => openServiceModal(service)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-navy-700 to-navy-600 hover:from-primary-500/20 hover:to-primary-600/20 text-gray-300 hover:text-primary-400 rounded-lg transition-all duration-300 text-sm font-semibold border border-navy-600 hover:border-primary-500/50 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Learn More
                        <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

                 {/* Navigation Indicators */}
         <div className="flex justify-center items-center mt-12 space-x-4">
           {Array.from({ length: totalSlides }, (_, index) => (
             <motion.button
               key={index}
               onClick={() => goToSlide(index)}
               disabled={isTransitioning}
               className={`relative h-2 transition-all duration-300 rounded-full ${
                 index === currentSlide 
                   ? 'w-8 bg-primary-500 shadow-lg shadow-primary-500/50' 
                   : 'w-2 bg-gray-600 hover:bg-gray-500'
               }`}
               whileHover={{ scale: 1.2 }}
               aria-label={`Navigate to slide ${index + 1}`}
             />
           ))}
         </div>

                 {/* Call to Action */}
         <motion.div 
           className="text-center mt-16"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.3 }}
         >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Begin Your Project?
          </h3>
          <p className="text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            From network configuration with Cisco Packet Tracer to comprehensive software development solutions, 
            our expert team delivers professional results that exceed expectations.
          </p>
          <motion.button
            onClick={() => openInquiryForm()}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project Today
            <ExternalLink size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={closeServiceModal}
        onGetStarted={openInquiryForm}
      />

      {/* Project Inquiry Form */}
      <ProjectInquiryForm
        isOpen={isInquiryFormOpen}
        onClose={closeInquiryForm}
        prefilledService={selectedServiceForInquiry}
      />
    </section>
  );
};

export default FeaturedServices;