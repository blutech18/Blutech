import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { submitContactForm } from '../../lib/supabase';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitContactForm(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-navy-800 p-8 rounded-xl shadow-lg border border-navy-700"
    >
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-500/20 text-success-500 mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-gray-400 mb-6">
            Thank you for reaching out! We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
          
          {error && (
            <div className="mb-6 p-4 bg-error-500/20 border border-error-500 rounded-md text-error-500">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your name"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your email"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="How can we help you?"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ContactForm;