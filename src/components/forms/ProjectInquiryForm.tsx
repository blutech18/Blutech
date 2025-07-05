import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle, User, Clock, FileText, Plus, Trash2, Mail, Phone, Building, Facebook, Instagram, Music } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToastContext } from '../../contexts/ToastContext';

interface ProjectInquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledService?: {
    title: string;
    category: string;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  service_type: string;
  budget_range: string;
  timeline: string;
  description: string;
  requested_features: string[];
  social_media_links: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

const PROJECT_TYPES = [
  'Web Application',
  'Mobile Application',
  'Desktop Application',
  'E-commerce Website',
  'CMS Website',
  'API Development',
  'Database Design',
  'System Integration',
  'Network Configuration',
  'Automation Tool',
  'Custom Software',
  'Other'
];

const BUDGET_RANGES = [
  'Under ₱2,000',
  '₱3,000 - ₱6,000',
  '₱6,000 - ₱10,000',
  '₱10,000 - ₱15,000',
  '₱15,000 - ₱25,000',
  'Over ₱30,000',
  'Let\'s discuss'
];

const TIMELINES = [
  'ASAP (Rush job)',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  '6+ months',
  'Flexible'
];

const ProjectInquiryForm: React.FC<ProjectInquiryFormProps> = ({ 
  isOpen, 
  onClose, 
  prefilledService 
}) => {
  const { success, error: showError } = useToastContext();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    service_type: prefilledService?.title || '',
    budget_range: '',
    timeline: '',
    description: '',
    requested_features: [''],
    social_media_links: {
      facebook: '',
      instagram: '',
      tiktok: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  // Function to detect social media platform from URL
  const detectSocialMediaPlatform = (url: string): 'facebook' | 'instagram' | 'tiktok' | null => {
    if (!url) return null;
    
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.me')) {
      return 'facebook';
    }
    if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
      return 'instagram';
    }
    if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('tiktok.app')) {
      return 'tiktok';
    }
    return null;
  };

  // Function to get social media icon
  const getSocialMediaIcon = (platform: string | null) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={16} className="text-blue-500" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-500" />;
      case 'tiktok':
        return <Music size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for contact purposes';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    // Validate social media links format
    Object.entries(formData.social_media_links).forEach(([platform, url]) => {
      if (url && !url.match(/^https?:\/\/.+/)) {
        newErrors[`social_${platform}`] = 'Please enter a valid URL (starting with http:// or https://)';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
      setSubmitStatus('idle');
    }
  };

  const handleSocialMediaChange = (platform: keyof FormData['social_media_links'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media_links: {
        ...prev.social_media_links,
        [platform]: value
      }
    }));

    // Clear error for this field
    const errorKey = `social_${platform}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requested_features: prev.requested_features.map((feature, i) => 
        i === index ? value : feature
      )
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      requested_features: [...prev.requested_features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.requested_features.length > 1) {
      setFormData(prev => ({
        ...prev,
        requested_features: prev.requested_features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    try {
      // Filter out empty features and prepare submission data
      const submissionData = {
        ...formData,
        requested_features: formData.requested_features.filter(feature => feature.trim() !== ''),
        social_media_links: JSON.stringify(formData.social_media_links),
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('project_inquiries')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to submit inquiry');
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from submission');
      }

      setSubmitStatus('success');
      success('Project Inquiry Submitted Successfully', 'Your inquiry has been received and will be reviewed within 24 hours.');
      
      // Reset form and navigate to home after brief delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          project_type: '',
          service_type: prefilledService?.title || '',
          budget_range: '',
          timeline: '',
          description: '',
          requested_features: [''],
          social_media_links: {
            facebook: '',
            instagram: '',
            tiktok: ''
          }
        });
        onClose();
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setSubmitError(errorMessage);
      setSubmitStatus('error');
      showError('Project Inquiry Submission Failed', `Unable to process your inquiry: ${errorMessage}. Please verify your information and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form state when closing
      setSubmitStatus('idle');
      setSubmitError('');
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Form Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                      {prefilledService ? `${prefilledService.title} - Project Inquiry` : 'Project Inquiry Form'}
                  </h2>
                    <p className="text-primary-100 mt-1 text-sm">
                      Please provide detailed information about your project requirements
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white hover:text-white transition-colors duration-300 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                        }`}
                        placeholder="Enter your full name"
                      />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                        }`}
                          placeholder="your.email@example.com"
                      />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={16} className="text-gray-400" />
                        </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.phone ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                          }`}
                          placeholder="+63 912 345 6789"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Company/Organization
                        <span className="text-gray-500 text-xs ml-1">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building size={16} className="text-gray-400" />
                        </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                          placeholder="Your company or organization name"
                        />
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Social Media Profiles
                        <span className="text-gray-500 text-xs ml-1">(Optional - for better communication)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Facebook */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Facebook Profile/Page
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {getSocialMediaIcon(detectSocialMediaPlatform(formData.social_media_links.facebook)) || <Facebook size={16} className="text-gray-400" />}
                            </div>
                            <input
                              type="url"
                              value={formData.social_media_links.facebook}
                              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                              className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                                errors.social_facebook ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                              }`}
                              placeholder="https://facebook.com/yourprofile"
                            />
                          </div>
                          {errors.social_facebook && (
                            <p className="text-red-500 text-xs mt-1">{errors.social_facebook}</p>
                          )}
                        </div>

                        {/* Instagram */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Instagram Profile
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {getSocialMediaIcon(detectSocialMediaPlatform(formData.social_media_links.instagram)) || <Instagram size={16} className="text-gray-400" />}
                            </div>
                            <input
                              type="url"
                              value={formData.social_media_links.instagram}
                              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                              className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                                errors.social_instagram ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                              }`}
                              placeholder="https://instagram.com/yourprofile"
                            />
                          </div>
                          {errors.social_instagram && (
                            <p className="text-red-500 text-xs mt-1">{errors.social_instagram}</p>
                          )}
                        </div>

                        {/* TikTok */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            TikTok Profile
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {getSocialMediaIcon(detectSocialMediaPlatform(formData.social_media_links.tiktok)) || <Music size={16} className="text-gray-400" />}
                            </div>
                            <input
                              type="url"
                              value={formData.social_media_links.tiktok}
                              onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                              className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                                errors.social_tiktok ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                              }`}
                              placeholder="https://tiktok.com/@yourprofile"
                            />
                          </div>
                          {errors.social_tiktok && (
                            <p className="text-red-500 text-xs mt-1">{errors.social_tiktok}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <FileText size={18} className="text-white" />
                    </div>
                    Project Details
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Project Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Project Type
                      </label>
                      <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                      >
                        <option value="">Select project type</option>
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Service Type
                        {prefilledService && (
                          <span className="text-primary-500 text-xs ml-2">(Pre-selected)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                        placeholder="Specific service you're interested in"
                        readOnly={!!prefilledService}
                      />
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budget_range"
                        value={formData.budget_range}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                      >
                        <option value="">Select budget range</option>
                        {BUDGET_RANGES.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Clock size={16} />
                        Timeline
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                      >
                        <option value="">Select timeline</option>
                        {TIMELINES.map((timeline) => (
                          <option key={timeline} value={timeline}>
                            {timeline}
                          </option>
                        ))}
                      </select>
                </div>

                {/* Project Description */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                        className={`w-full px-4 py-3 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-vertical ${
                          errors.description ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-navy-600 focus:border-primary-500 focus:ring-primary-500/50'
                    }`}
                        placeholder="Please provide a detailed description of your project, including goals, target audience, and key features you want to implement..."
                  />
                  {errors.description && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.description}
                    </p>
                  )}
                    </div>
                  </div>
                </div>

                {/* Requested Features Section */}
                <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <Plus size={18} className="text-white" />
                    </div>
                    Requested Features
                  </h3>
                  
                  <div className="space-y-4">
                    {formData.requested_features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold">
                            {index + 1}
                        </span>
                        </div>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                          placeholder={`Feature ${index + 1} (e.g., User authentication, Payment integration, etc.)`}
                        />
                        {formData.requested_features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="flex-shrink-0 w-10 h-10 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-300"
                            title="Remove feature"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-center pt-4">
                      <button
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 border border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 rounded-lg text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300 font-medium"
                      >
                        <Plus size={16} />
                        Add Another Feature
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-navy-700">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting Inquiry...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle size={20} />
                        Inquiry Submitted Successfully!
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit Project Inquiry
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 border border-gray-300 dark:border-navy-600 hover:border-gray-400 dark:hover:border-navy-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectInquiryForm; 