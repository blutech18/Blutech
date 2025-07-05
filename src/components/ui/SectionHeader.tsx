import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

const SectionHeader = ({ title, subtitle, centered = false }: SectionHeaderProps) => {
  return (
    <motion.div 
      className={`mb-12 ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        <span className="heading-gradient">{title}</span>
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
    </motion.div>
  );
};

export default SectionHeader;