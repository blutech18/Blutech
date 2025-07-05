import { Mail, Phone, Clock, Monitor, Facebook, Instagram, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastContext } from '../../contexts/ToastContext';
import { useState } from 'react';

const contactInfo = [
  {
    icon: <Mail className="text-primary-500" size={24} />,
    title: 'Email',
    content: 'blutech18@gmail.com',
    link: 'mailto:blutech18@gmail.com',
    copyText: 'blutech18@gmail.com',
  },
  {
    icon: <Phone className="text-primary-500" size={24} />,
    title: 'Phone',
    content: '0961-711-0582',
    link: 'tel:+639617110582',
    copyText: '0961-711-0582',
  },
  {
    icon: <Monitor className="text-primary-500" size={24} />,
    title: 'Social Media',
    content: '@blutech18',
    isModal: true,
  },
  {
    icon: <Clock className="text-primary-500" size={24} />,
    title: 'Commission Hours',
    content: 'Mon-Fri: 9AM - 6PM EST',
  },
];

const ContactInfo = () => {
  const { success, error } = useToastContext();
  const [showSocialModal, setShowSocialModal] = useState(false);

  const handleCopyClick = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      success(`${type} copied!`, `${text} has been copied to your clipboard`);
    }).catch(() => {
      error(`Failed to copy ${type.toLowerCase()}`, 'Please try again or copy manually');
    });
  };

  const socialMediaLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: 'https://www.facebook.com/profile.php?id=61576743929523',
      color: 'text-blue-500 hover:text-blue-400',
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} />,
      url: 'https://www.instagram.com/blutech18/',
      color: 'text-pink-500 hover:text-pink-400',
    },
    {
      name: 'TikTok',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      url: 'https://www.tiktok.com/@blutech18',
      color: 'text-gray-300 hover:text-white',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
      <p className="text-gray-400 mb-8">
        We'd love to hear from you! Reach out through any of the following channels and we'll get back to you as soon as possible.
      </p>
      
      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="mt-1">{item.icon}</div>
            <div>
              <h4 className="text-white font-medium">{item.title}</h4>
              {(item as any).copyText ? (
                <button
                  onClick={() => handleCopyClick((item as any).copyText, item.title)}
                  className="text-gray-400 hover:text-primary-500 transition-colors cursor-pointer text-left"
                >
                  {item.content}
                </button>
              ) : (item as any).isModal ? (
                <button
                  onClick={() => setShowSocialModal(true)}
                  className="text-gray-400 hover:text-primary-500 transition-colors cursor-pointer text-left"
                >
                  {item.content}
                </button>
              ) : item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  {item.content}
                </a>
              ) : (
                <p className="text-gray-400">{item.content}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12">
        <h3 className="text-white font-bold mb-4">Let's Connect</h3>
        <p className="text-gray-400">
          Follow us on social media for updates, insights, and more information about our services.
        </p>
      </div>

      {/* Social Media Modal */}
      <AnimatePresence>
        {showSocialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSocialModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-navy-800 rounded-lg p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSocialModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-4">Follow BluTech</h3>
              <p className="text-gray-400 mb-6">Connect with us on social media</p>
              
              <div className="space-y-4">
                {socialMediaLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors ${social.color}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setShowSocialModal(false)}
                  >
                    {social.icon}
                    <span className="text-white font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactInfo;