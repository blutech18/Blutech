import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import FeaturedServices from '../components/home/FeaturedServices';
import FeaturedProjects from '../components/home/FeaturedProjects';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <FeaturedServices />
      <FeaturedProjects />
    </motion.div>
  );
};

export default Home;