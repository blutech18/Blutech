import { motion } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '100+', label: 'Projects Completed' },
  { value: '50+', label: 'Happy Clients' },
  { value: '24/7', label: 'Support' },
];



const About = () => {

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                About <span className="heading-gradient">BLUTECH</span>
              </motion.h1>
              <motion.p
                className="text-gray-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                BLUTECH Commissions is a leading software development company 
                specializing in delivering high-quality custom coding solutions 
                for businesses of all sizes.
              </motion.p>
              <motion.p
                className="text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Founded in 2020, we've helped numerous clients transform their 
                digital ideas into reality with our expert team of developers, 
                designers, and project managers.
              </motion.p>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-navy-700 p-6 rounded-lg text-center border border-navy-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h3 className="text-3xl font-bold text-primary-500 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-navy-900">
        <div className="container-custom">
          <SectionHeader
            title="Our Mission & Vision"
            subtitle="What drives us and where we're headed"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400">
                To deliver exceptional software solutions that empower businesses 
                to thrive in the digital era. We are committed to excellence, 
                innovation, and building long-term partnerships with our clients 
                to help them achieve their goals.
              </p>
            </motion.div>
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400">
                To be recognized as the go-to partner for businesses seeking 
                transformative digital solutions. We aspire to be at the forefront 
                of technological innovation, consistently delivering value and 
                exceeding expectations in every project we undertake.
              </p>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Team Values */}
      <section className="py-20 bg-navy-800">
        <div className="container-custom">
          <SectionHeader
            title="Our Core Values"
            subtitle="The principles that guide our work and define our company culture"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              className="p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
              <p className="text-gray-400">
                We strive for excellence in everything we do, from code quality to client communication.
              </p>
            </motion.div>
            <motion.div
              className="p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-gray-400">
                We embrace cutting-edge technologies and creative solutions to solve complex problems.
              </p>
            </motion.div>
            <motion.div
              className="p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Integrity</h3>
              <p className="text-gray-400">
                We build trust through honest communication, transparency, and delivering on our promises.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;