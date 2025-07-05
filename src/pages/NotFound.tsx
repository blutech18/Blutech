import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center text-center p-4"
    >
      <h1 className="text-9xl font-bold text-primary-500">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-white mt-6 mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="btn-primary">
          <Home size={18} className="mr-2" />
          Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-secondary">
          <ArrowLeft size={18} className="mr-2" />
          Go Back
        </button>
      </div>
    </motion.div>
  );
};

export default NotFound;