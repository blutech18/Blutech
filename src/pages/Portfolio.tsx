import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { api, Project } from '../services/api';

const categories = ['all', 'web', 'mobile', 'desktop'];

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProofOfPayment, setShowProofOfPayment] = useState(false);
  const [nextClientId, setNextClientId] = useState('Client #1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, nextIdData] = await Promise.all([
          api.getProjects(),
          api.getNextClientId()
        ]);
        setProjects(projectsData);
        setNextClientId(`Client #${nextIdData.nextId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Sample proof of payment image - you can replace this with an actual screenshot
  const proofOfPaymentImage = "https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading portfolio: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            Our <span className="heading-gradient">Portfolio</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our diverse portfolio of projects. Each project represents our commitment
            to quality, innovation, and delivering exceptional results for our clients.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container-custom">
          <SectionHeader
            title="Featured Projects"
            subtitle="A showcase of our recent work and the technologies we've used"
            centered
          />

          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 overflow-x-auto p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-medium capitalize ${
                    activeCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="card overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="h-48 overflow-hidden rounded-lg mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-navy-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-navy-900/80 flex items-center justify-center text-white hover:bg-navy-700"
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </button>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                <p className="text-gray-300 mb-6">{selectedProject.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-start">
                  {selectedProject.proofOfPaymentImage && (
                    <button
                      onClick={() => setShowProofOfPayment(true)}
                      className="btn-primary flex items-center"
                    >
                      <Receipt size={18} className="mr-2" />
                      PROOF OF PAYMENT
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proof of Payment Modal */}
      <AnimatePresence>
        {showProofOfPayment && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProofOfPayment(false)}
          >
            <motion.div
              className="bg-navy-900 rounded-3xl w-[432px] h-[540px] relative overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ aspectRatio: '1080/1350' }}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-navy-800/80 flex items-center justify-center text-white hover:bg-navy-700 z-10"
                onClick={() => setShowProofOfPayment(false)}
              >
                ✕
              </button>

              {/* BLUTECH Header with Logo */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex items-center">
                  <img 
                    src="/blutech.svg" 
                    alt="BluTech Logo" 
                    className="w-10 h-10 mr-3"
                  />
                  <h1 className="text-primary-500 text-2xl font-bold tracking-wider">
                    BLUTECH
                  </h1>
                </div>
              </div>

              {/* Payment Screenshot Container */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-72 h-80 bg-white rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={selectedProject?.proofOfPaymentImage || proofOfPaymentImage}
                  alt="Payment Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hexagon Background Decorations */}
              <div className="absolute top-32 right-8 w-16 h-16 border-2 border-primary-500/30 transform rotate-12" 
                   style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}>
              </div>
              <div className="absolute top-48 right-4 w-24 h-24 border-2 border-primary-500/20 transform -rotate-12" 
                   style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}>
              </div>
              <div className="absolute bottom-32 left-4 w-20 h-20 border-2 border-primary-500/20 transform rotate-45" 
                   style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}>
              </div>

              {/* Client Information - Below Image */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center max-w-[320px]">
                <div className="flex items-center justify-center mb-1 whitespace-nowrap">
                  <span className="text-white text-sm font-semibold">Client#:&nbsp;</span>
                  <span className="text-primary-500 text-sm font-bold">
                    {selectedProject?.clientId 
                      ? selectedProject.clientId.replace('Client #', '') 
                      : nextClientId
                    }
                  </span>
                </div>
                <div className="flex items-center justify-center mb-1 whitespace-nowrap overflow-hidden">
                  <span className="text-white text-sm font-medium">Service:&nbsp;</span>
                  <span className="text-primary-500 text-sm font-bold truncate">{selectedProject?.serviceType || 'WEBSITE PROJECT'}</span>
                </div>
                <div className="flex items-center justify-center whitespace-nowrap">
                  <span className="text-white text-sm font-semibold">Date:&nbsp;</span>
                  <span className="text-primary-500 text-sm font-bold">{selectedProject?.paymentDate || '6/3/25'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Portfolio;