import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Technology icons using PNG images from public folder
const technologies = [
  { 
    name: 'React', 
    icon: <img src="/react.png" alt="React" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'Node.js', 
    icon: <img src="/nodejs.png" alt="Node.js" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'TypeScript', 
    icon: <img src="/typescript.png" alt="TypeScript" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'Python', 
    icon: <img src="/python.png" alt="Python" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'JavaScript', 
    icon: <img src="/javascript.png" alt="JavaScript" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'MongoDB', 
    icon: <img src="/mongodb.png" alt="MongoDB" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'Next.js', 
    icon: <img src="/nextjs.png" alt="Next.js" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'Laravel', 
    icon: <img src="/laravel.png" alt="Laravel" className="w-10 h-10 object-contain" />
  },
  { 
    name: 'Packet Tracer', 
    icon: <img src="/packettracer.png" alt="Packet Tracer" className="w-10 h-10 object-contain" />
  }
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-hero-pattern bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/70 z-0"></div>
      
      <div className="container-custom relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Custom <span className="heading-gradient">Coding Solutions</span> for Modern Businesses
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8">
              We transform your digital ideas into reality with cutting-edge development and pixel-perfect execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services" className="btn-primary">
                Our Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/portfolio" className="btn-secondary">
                View Portfolio
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-navy-800/50 backdrop-blur-sm p-8 rounded-xl border border-navy-700/50">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Our Technology Stack</h3>
              <div className="grid grid-cols-3 gap-6">
                {technologies.map((tech, index) => (
                  <motion.div 
                    key={tech.name} 
                    className="flex flex-col items-center p-4 rounded-lg bg-navy-700/30 border border-navy-600/30 hover:bg-navy-600/40 hover:border-navy-500/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </div>
                    <p className="text-gray-300 text-sm font-medium text-center">{tech.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  );
};

export default Hero;