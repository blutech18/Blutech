import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Database, Monitor, Zap, BarChart3, Router, GraduationCap, Palette, BookOpen, Globe, Workflow, CircuitBoard, Search, Layers, TestTube, Rocket, HeadphonesIcon } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';

const services = [
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies and best practices.',
  },
  {
    icon: '📱',
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile solutions for iOS and Android platforms.',
  },
  {
    icon: <Router size={24} />,
    title: 'Cisco Packet Tracer',
    description: 'Network simulation and configuration using Cisco Packet Tracer for educational and training purposes.',
  },
  {
    icon: '🔗',
    title: 'Network Design',
    description: 'Complete network infrastructure design and implementation for businesses of all sizes.',
  },
  {
    icon: '💻',
    title: 'Custom Software',
    description: 'Tailor-made software solutions designed to meet your specific business needs.',
  },
  {
    icon: '🔌',
    title: 'API Development',
    description: 'Robust and scalable APIs to connect your systems and enable seamless integrations.',
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that enhance user experience and drive engagement.',
  },
  {
    icon: <GraduationCap size={24} />,
    title: 'Capstone Projects',
    description: 'Complete capstone project development and guidance for academic requirements and portfolio building.',
  },
  {
    icon: <Database size={24} />,
    title: 'Database Design',
    description: 'Efficient database architecture and management solutions for optimal performance and scalability.',
  },
  {
    icon: <CircuitBoard size={24} />,
    title: 'Arduino & Tinkercad',
    description: 'Electronics prototyping and simulation using Arduino hardware and Tinkercad software.',
  },
  {
    icon: <Monitor size={24} />,
    title: 'Machine Learning',
    description: 'AI and machine learning solutions to automate processes and extract valuable insights.',
  },
  {
    icon: <Palette size={24} />,
    title: 'Graphic Design',
    description: 'Creative visual design services including logos, branding, and marketing materials.',
  },
  {
    icon: <BookOpen size={24} />,
    title: 'School Programming Activities',
    description: 'Programming assignments, homework assistance, and coding projects for academic courses.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Performance Optimization',
    description: 'Fine-tune applications and systems for maximum speed, efficiency, and user experience.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Data Analytics',
    description: 'Transform raw data into actionable insights with advanced analytics and visualization.',
  },
  {
    icon: <Globe size={24} />,
    title: 'E-commerce Solutions',
    description: 'Complete online store development with payment integration and inventory management.',
  },
  {
    icon: <Workflow size={24} />,
    title: 'Diagrams & Documentation',
    description: 'Professional diagrams including flowcharts, ERDs, UML, system architecture, and activity diagrams.',
  },
  {
    icon: '🚀',
    title: 'Others & Any Project',
    description: 'Got something unique in mind? We love challenges! Whatever your project is, we\'ll find a solution. From unconventional ideas to specialized requirements - we make it happen.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Consultation',
    description: 'We begin with a comprehensive consultation to understand your vision, goals, and requirements. This includes project scope definition, timeline planning, and technology selection.',
    icon: <Search size={32} />,
  },
  {
    number: '02',
    title: 'Design & Architecture',
    description: 'Our team creates detailed wireframes, mockups, and system architecture. We focus on user experience, scalability, and performance optimization from the ground up.',
    icon: <Layers size={32} />,
  },
  {
    number: '03',
    title: 'Development & Implementation',
    description: 'Using agile methodologies, we develop your solution with regular updates and feedback loops. Our code follows industry best practices and is thoroughly documented.',
    icon: <Code size={32} />,
  },
  {
    number: '04',
    title: 'Testing & Quality Assurance',
    description: 'Rigorous testing ensures your application is secure, performant, and bug-free. We conduct unit tests, integration tests, and user acceptance testing.',
    icon: <TestTube size={32} />,
  },
  {
    number: '05',
    title: 'Deployment & Launch',
    description: 'We handle the complete deployment process, including server setup, domain configuration, and go-live support. Your project launches smoothly and successfully.',
    icon: <Rocket size={32} />,
  },
  {
    number: '06',
    title: 'Maintenance & Support',
    description: 'Post-launch support includes monitoring, updates, bug fixes, and feature enhancements. We ensure your solution continues to perform optimally over time.',
    icon: <HeadphonesIcon size={32} />,
  },
];

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy-800">
        <div className="container-custom">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our <span className="heading-gradient">Services</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We offer a comprehensive range of development services tailored to meet your business needs.
            From web and mobile applications to specialized academic projects, our team delivers
            high-quality solutions that drive results.
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20" ref={ref}>
        <div className="container-custom">
          <SectionHeader
            title="What We Offer"
            subtitle="Our comprehensive range of services designed to meet your business needs"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-500 mb-4">
                  {typeof service.icon === 'string' ? (
                    <span className="text-2xl">{service.icon}</span>
                  ) : (
                    service.icon
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-navy-800">
        <div className="container-custom">
          <SectionHeader
            title="Our Process"
            subtitle="A streamlined approach to deliver exceptional results"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  {step.icon}
                </div>
                <div className="mb-4">
                  <span className="text-primary-500 text-sm font-bold tracking-wider">
                    STEP {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{step.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Services;