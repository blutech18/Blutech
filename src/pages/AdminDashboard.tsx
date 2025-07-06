import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  FolderOpen, 
  Users, 
  BarChart3, 
  Plus,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Building,
  Facebook,
  Instagram,
  Music,
  ExternalLink,
  User,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import { api, Project, ProjectInquiry, ContactSubmission } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import ToastContainer from '../components/ToastContainer';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries' | 'contacts' | 'stats'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<ProjectInquiry | null>(null);
  const [nextClientId, setNextClientId] = useState(1);
  const navigate = useNavigate();
  const { toasts, success, error: showError, removeToast } = useToast();
  const { dialogState, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, inquiriesData, contactsData, nextClientIdData] = await Promise.all([
        api.getProjects(),
        api.getInquiries(),
        api.getContactSubmissions(),
        api.getNextClientId()
      ]);
      setProjects(projectsData);
      setInquiries(inquiriesData);
      setContactSubmissions(contactsData);
      setNextClientId(nextClientIdData.nextId);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showError('Failed to load data', 'Unable to fetch projects, inquiries, and contact messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  const handleDeleteProject = async (project: Project) => {
    showConfirmDialog(
      {
        title: 'Delete Project',
        message: 'Are you sure you want to permanently delete this project? This action cannot be undone and will remove all associated data. After deletion, you may want to use the "Fix Numbering" button to renumber remaining clients.',
        confirmText: 'Delete Project',
        cancelText: 'Keep Project',
        type: 'danger',
        itemName: project.title
      },
      async () => {
        try {
          await api.deleteProject(project.id);
          
          // Refresh all data instead of just filtering
          await fetchData();
          
          success('Project deleted', 'Project has been successfully removed. Use "Fix Numbering" to renumber remaining clients.');
        } catch (error) {
          showError('Delete failed', 'Unable to delete project. Please try again.');
          throw error; // Re-throw to prevent dialog from closing
        }
      }
    );
  };

  const handleRenumberAll = async () => {
    showConfirmDialog(
      {
        title: 'Fix Client Numbering',
        message: 'This will renumber all clients sequentially (1, 2, 3...) to remove gaps caused by deletions. This is useful after deleting clients. Are you sure you want to proceed?',
        confirmText: 'Fix Numbering',
        cancelText: 'Cancel',
        type: 'warning',
        itemName: 'All Client Numbers'
      },
      async () => {
        try {
          setLoading(true);
          
          // Only renumber projects (which contain client IDs)
          const result = await api.renumberProjects();
          
          if (result.success) {
            // Refresh all data
            await fetchData();
            success('Numbering Fixed', 'All client numbers have been renumbered sequentially.');
          } else {
            showError('Fix failed', result.message || 'Unable to fix numbering. Please try again.');
          }
        } catch (error) {
          console.error('Renumber error:', error);
          showError('Fix failed', 'Unable to fix numbering. Please try again.');
          throw error; // Re-throw to prevent dialog from closing
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleDeleteInquiry = async (inquiry: ProjectInquiry) => {
    showConfirmDialog(
      {
        title: 'Delete Inquiry',
        message: 'Are you sure you want to permanently delete this project inquiry? This action cannot be undone.',
        confirmText: 'Delete Inquiry',
        cancelText: 'Keep Inquiry',
        type: 'danger',
        itemName: `${inquiry.name} - ${inquiry.service_type || inquiry.project_type || 'General Inquiry'}`
      },
      async () => {
        try {
          await api.deleteInquiry(inquiry.id);
          setInquiries(inquiries.filter(i => i.id !== inquiry.id));
          success('Inquiry deleted', 'Project inquiry has been successfully removed.');
        } catch (error) {
          showError('Delete failed', 'Unable to delete inquiry. Please try again.');
          throw error;
        }
      }
    );
  };

  const handleDeleteContact = async (contact: ContactSubmission) => {
    showConfirmDialog(
      {
        title: 'Delete Contact Message',
        message: 'Are you sure you want to permanently delete this contact message? This action cannot be undone.',
        confirmText: 'Delete Message',
        cancelText: 'Keep Message',
        type: 'danger',
        itemName: `${contact.name} - ${contact.email}`
      },
      async () => {
        try {
          await api.deleteContactSubmission(contact.id);
          setContactSubmissions(contactSubmissions.filter(c => c.id !== contact.id));
          success('Contact message deleted', 'Contact message has been successfully removed.');
        } catch (error) {
          showError('Delete failed', 'Unable to delete contact message. Please try again.');
          throw error;
        }
      }
    );
  };

  const handleUpdateInquiryStatus = async (inquiry: ProjectInquiry, status: string) => {
    try {
      const updatedInquiry = await api.updateInquiry(inquiry.id, { 
        status
      });
      setInquiries(inquiries.map(i => i.id === inquiry.id ? updatedInquiry : i));
      success('Inquiry updated', 'Inquiry status has been updated successfully.');
    } catch (error) {
      showError('Update failed', 'Unable to update inquiry status. Please try again.');
    }
  };

  const stats = {
    totalProjects: projects.length,
    totalInquiries: inquiries.length,
    totalContacts: contactSubmissions.length,
    webProjects: projects.filter(p => p.category === 'web').length,
    mobileProjects: projects.filter(p => p.category === 'mobile').length,
    desktopProjects: projects.filter(p => p.category === 'desktop').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0">
              <img src="/blutech.svg" alt="BluTech" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              <LogOut size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              activeTab === 'projects' 
                ? 'bg-primary-500 text-white' 
                : 'bg-navy-800 text-gray-400 hover:text-white'
            }`}
          >
            <FolderOpen size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Projects</span>
            <span className="sm:hidden">Proj</span>
            <span className="ml-1">({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              activeTab === 'inquiries' 
                ? 'bg-primary-500 text-white' 
                : 'bg-navy-800 text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Inquiries</span>
            <span className="sm:hidden">Inq</span>
            <span className="ml-1">({inquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              activeTab === 'contacts' 
                ? 'bg-primary-500 text-white' 
                : 'bg-navy-800 text-gray-400 hover:text-white'
            }`}
          >
            <Mail size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Messages</span>
            <span className="sm:hidden">Msg</span>
            <span className="ml-1">({contactSubmissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              activeTab === 'stats' 
                ? 'bg-primary-500 text-white' 
                : 'bg-navy-800 text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Statistics</span>
            <span className="sm:hidden">Stats</span>
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Projects</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowProjectModal(true);
                  }}
                  className="btn-primary flex items-center justify-center text-sm sm:text-base"
                >
                  <Plus size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Project</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <button
                  onClick={handleRenumberAll}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base"
                  title="Renumber all clients sequentially to remove gaps after deletions"
                >
                  🔢 <span className="ml-1 hidden sm:inline">Fix Client Numbers</span>
                  <span className="ml-1 sm:hidden">Fix Numbers</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {projects.map((project) => (
                <div key={project.id} className="card overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 sm:h-48 object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap mb-3 gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="tech-tag text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="tech-tag text-xs">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setShowProjectModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Edit Project"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Project Inquiries</h2>
              <div className="text-sm text-gray-400">
                {inquiries.filter(i => i.status === 'pending').length} pending inquiries
              </div>
            </div>

            <div className="bg-navy-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-navy-700">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Client Info
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Project Type
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-navy-750 transition-colors">
                        <td className="px-3 sm:px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{inquiry.name}</div>
                            <div className="text-sm text-gray-400">{inquiry.email}</div>
                            {inquiry.phone && (
                              <div className="text-xs text-gray-500">{inquiry.phone}</div>
                            )}
                            {inquiry.company && (
                              <div className="text-xs text-gray-500">{inquiry.company}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div>
                            {inquiry.service_type && (
                              <div className="text-sm text-white">{inquiry.service_type}</div>
                            )}
                            {inquiry.project_type && (
                              <div className="text-xs text-gray-400">{inquiry.project_type}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {inquiry.budget_range || 'Not specified'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleUpdateInquiryStatus(inquiry, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-semibold bg-navy-900 border ${
                              inquiry.status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                              inquiry.status === 'in_progress' ? 'text-blue-400 border-blue-400' :
                              inquiry.status === 'completed' ? 'text-green-400 border-green-400' :
                              'text-red-400 border-red-400'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setViewingInquiry(inquiry);
                                setShowInquiryModal(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title="View Details"
                            >
                              <FolderOpen size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteInquiry(inquiry)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete Inquiry"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {inquiries.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No inquiries yet</h3>
                  <p className="text-gray-500">Project inquiries will appear here when submitted.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'contacts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
              <div className="text-sm text-gray-400">
                {contactSubmissions.length} total messages
              </div>
            </div>

            <div className="bg-navy-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-navy-700">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700">
                    {contactSubmissions.map((contact) => (
                      <tr key={contact.id} className="hover:bg-navy-750 transition-colors">
                        <td className="px-3 sm:px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{contact.name}</div>
                            <div className="text-sm text-gray-400">
                              <a href={`mailto:${contact.email}`} className="hover:text-primary-400 transition-colors">
                                {contact.email}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="text-sm text-gray-300 max-w-xs">
                            <p className="line-clamp-3">{contact.message}</p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <a
                              href={`mailto:${contact.email}?subject=Re: Your message&body=Hi ${contact.name},%0D%0A%0D%0AThank you for your message. `}
                              className="text-blue-400 hover:text-blue-300"
                              title="Reply via Email"
                            >
                              <Mail size={16} />
                            </a>
                            <button
                              onClick={() => handleDeleteContact(contact)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete Message"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {contactSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <Mail size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No messages yet</h3>
                  <p className="text-gray-500">Contact messages will appear here when submitted.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="card text-center">
                <FolderOpen size={48} className="mx-auto text-primary-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{stats.totalProjects}</h3>
                <p className="text-gray-400">Total Projects</p>
              </div>
              <div className="card text-center">
                <Users size={48} className="mx-auto text-primary-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{stats.totalInquiries}</h3>
                <p className="text-gray-400">Total Inquiries</p>
              </div>
              <div className="card text-center">
                <Mail size={48} className="mx-auto text-primary-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{stats.totalContacts}</h3>
                <p className="text-gray-400">Contact Messages</p>
              </div>
              <div className="card text-center">
                <BarChart3 size={48} className="mx-auto text-primary-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{stats.webProjects}</h3>
                <p className="text-gray-400">Web Projects</p>
              </div>
              <div className="card text-center">
                <BarChart3 size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{stats.mobileProjects}</h3>
                <p className="text-gray-400">Mobile Projects</p>
              </div>
              <div className="card text-center">
                <BarChart3 size={48} className="mx-auto text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{stats.desktopProjects}</h3>
                <p className="text-gray-400">Desktop Projects</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <ProjectModal
            project={editingProject}
            onClose={() => setShowProjectModal(false)}
            onSave={fetchData}
            nextClientId={nextClientId}
            showSuccess={success}
            showError={showError}
          />
        )}
      </AnimatePresence>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <InquiryModal
          inquiry={viewingInquiry}
          onClose={() => {
            setShowInquiryModal(false);
            setViewingInquiry(null);
          }}
          onUpdate={(inquiry, status) => {
            handleUpdateInquiryStatus(inquiry, status);
            setShowInquiryModal(false);
            setViewingInquiry(null);
          }}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={hideConfirmDialog}
        onConfirm={handleConfirm}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        type={dialogState.type}
        itemName={dialogState.itemName}
        loading={dialogState.loading}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

// Service types from Services page
const SERVICE_TYPES = [
  'Web Development',
  'Mobile Applications', 
  'Cisco Packet Tracer',
  'Network Design',
  'Custom Software',
  'API Development',
  'UI/UX Design',
  'Capstone Projects',
  'Database Design',
  'Arduino & Tinkercad',
  'Machine Learning',
  'Graphic Design',
  'School Programming Activities',
  'Performance Optimization',
  'Data Analytics',
  'E-commerce Solutions',
  'Diagrams & Documentation',
  'Others & Any Project'
];

// Project Modal Component
const ProjectModal = ({ 
  project, 
  onClose, 
  onSave,
  nextClientId,
  showSuccess,
  showError
}: { 
  project: Project | null; 
  onClose: () => void; 
  onSave: () => void; 
  nextClientId: number;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    category: project?.category || 'web' as 'web' | 'mobile' | 'desktop'
  });
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(project?.image || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Proof of payment data
  const [proofOfPaymentFile, setProofOfPaymentFile] = useState<File | null>(null);
  const [proofOfPaymentPreview, setProofOfPaymentPreview] = useState<string>(project?.proofOfPaymentImage || '');
  
  // Keep track of blob URLs to prevent premature cleanup
  const [imageBlobUrl, setImageBlobUrl] = useState<string>('');
  const [paymentBlobUrl, setPaymentBlobUrl] = useState<string>('');
  const [clientInfo, setClientInfo] = useState({
    clientId: project?.clientId || `Client #${nextClientId}`,
    serviceType: project?.serviceType || '',
    date: project?.paymentDate || ''
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
      if (paymentBlobUrl) {
        URL.revokeObjectURL(paymentBlobUrl);
      }
    };
  }, [imageBlobUrl, paymentBlobUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous blob URL if it exists
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageBlobUrl(previewUrl);
      setImagePreview(previewUrl);
    }
  };

  const handleProofOfPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous blob URL if it exists
      if (paymentBlobUrl) {
        URL.revokeObjectURL(paymentBlobUrl);
      }
      setProofOfPaymentFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPaymentBlobUrl(previewUrl);
      setProofOfPaymentPreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imageBlobUrl) {
      URL.revokeObjectURL(imageBlobUrl);
    }
    setImageFile(null);
    setImageBlobUrl('');
    setImagePreview('');
    setFormData({...formData, image: ''});
  };

  const removeProofOfPayment = () => {
    if (paymentBlobUrl) {
      URL.revokeObjectURL(paymentBlobUrl);
    }
    setProofOfPaymentFile(null);
    setPaymentBlobUrl('');
    setProofOfPaymentPreview('');
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let imageUrl = formData.image;
      let proofOfPaymentUrl = '';

      // Upload project image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await api.uploadProjectImage(imageFile);
          imageUrl = uploadResult.imageUrl;
          
          // Clean up the blob URL after successful upload
          if (imageBlobUrl) {
            URL.revokeObjectURL(imageBlobUrl);
            setImageBlobUrl('');
          }
          
          setUploadingImage(false);
        } catch (uploadError) {
          setUploadingImage(false);
          throw new Error('Failed to upload project image. Please try again.');
        }
      }

      // Upload proof of payment if file is selected
      if (proofOfPaymentFile) {
        try {
          const uploadResult = await api.uploadProjectImage(proofOfPaymentFile);
          proofOfPaymentUrl = uploadResult.imageUrl;
          
          // Clean up the blob URL after successful upload
          if (paymentBlobUrl) {
            URL.revokeObjectURL(paymentBlobUrl);
            setPaymentBlobUrl('');
          }
          
        } catch (uploadError) {
          throw new Error('Failed to upload proof of payment. Please try again.');
        }
      }

      const projectData = {
        ...formData,
        image: imageUrl,
        technologies: technologies,
        proofOfPaymentImage: proofOfPaymentUrl || undefined,
        clientId: clientInfo.clientId || undefined,
        serviceType: clientInfo.serviceType || undefined,
        paymentDate: clientInfo.date || undefined,
      };

      if (project) {
        await api.updateProject(project.id, projectData);
      } else {
        await api.createProject(projectData);
      }

      // Create client record with proof of payment if provided
      if (proofOfPaymentFile && clientInfo.clientId && clientInfo.serviceType && clientInfo.date) {
        const clientData = {
          serviceType: clientInfo.serviceType,
          date: clientInfo.date,
          proofOfPaymentImage: proofOfPaymentUrl
        };
        await api.createClient(clientData);
      }
      
      onSave();
      onClose();
      showSuccess('Project saved', `Project "${formData.title}" has been successfully ${project ? 'updated' : 'created'}.`);
    } catch (error) {
      console.error('Submit error:', error);
      showError('Save failed', error instanceof Error ? error.message : 'Unable to save project. Please try again.');
      setUploadingImage(false);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Project Information', 'Proof of Payment', 'Review & Save'];

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-navy-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-navy-700 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {project ? 'Edit Project' : 'Create New Project'}
              </h3>
              <p className="text-primary-100 text-sm">
                {project ? 'Update project details and settings' : 'Add a new project to your portfolio'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Enhanced Step Indicator */}
          <div className="flex items-center justify-center mt-6 gap-4">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : currentStep === index + 1 
                      ? 'bg-white text-primary-600 shadow-lg' 
                      : 'bg-white/20 text-white/60'
                }`}>
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <div className="ml-3 hidden sm:block">
                  <span className={`text-sm font-medium block ${
                    currentStep === index + 1 ? 'text-white' : 'text-white/70'
                  }`}>
                    {title}
                  </span>
                </div>
                {index < stepTitles.length - 1 && (
                  <div className={`mx-6 h-0.5 w-12 transition-all duration-300 ${
                    currentStep > index + 1 ? 'bg-green-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">

          {/* Step 1: Project Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Details</h4>
                <p className="text-gray-600 dark:text-gray-400">Enter the basic information about your project</p>
              </div>

              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter a descriptive project title"
                      className="w-full px-4 py-3 h-12 bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Project Category</label>
                    <select
                      required
                      className="w-full px-4 py-3 h-12 bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as 'web' | 'mobile' | 'desktop'})}
                    >
                      <option value="web">Web Application</option>
                      <option value="mobile">Mobile Application</option>
                      <option value="desktop">Desktop Application</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Project Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a detailed description of your project, its purpose, and key features"
                    className="w-full px-4 py-3 bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  Project Image
                </h5>
                
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="w-full">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!project}
                      />
                      <label
                        htmlFor="image-upload"
                        className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors bg-gray-100 dark:bg-navy-700/50"
                      >
                        <div className="text-center">
                          <div className="text-5xl text-gray-400 mb-3">📁</div>
                          <p className="text-gray-600 dark:text-gray-400 text-base font-medium">Click to upload project image</p>
                          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-full h-48 bg-white rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-navy-600">
                        <img
                          src={imagePreview}
                          alt="Project preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                      <div className="mt-4 text-center">
                        <input
                          id="image-upload-change"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload-change"
                          className="text-primary-500 hover:text-primary-600 cursor-pointer text-sm font-medium underline"
                        >
                          Change Image
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  Technologies Used
                </h5>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter technology name (e.g., React, Node.js, MongoDB)"
                      className="flex-1 px-4 py-3 h-12 bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTech.trim() && !technologies.includes(newTech.trim())) {
                            setTechnologies([...technologies, newTech.trim()]);
                            setNewTech('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTech.trim() && !technologies.includes(newTech.trim())) {
                          setTechnologies([...technologies, newTech.trim()]);
                          setNewTech('');
                        }
                      }}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                  
                  {technologies.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Selected Technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => setTechnologies(technologies.filter((_, i) => i !== index))}
                              className="ml-2 text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          )}

          {/* Step 2: Proof of Payment */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment & Client Information</h4>
                <p className="text-gray-600 dark:text-gray-400">Upload payment proof and configure client details</p>
              </div>

              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  Client Information
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Client ID</label>
                    <input
                      type="text"
                      required
                      disabled
                      className="w-full px-4 py-3 h-12 bg-gray-100 dark:bg-navy-600 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-600 dark:text-gray-400 cursor-not-allowed text-center font-medium"
                      value={clientInfo.clientId}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">Auto-generated unique ID</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Service Type</label>
                    <select
                      required
                      className="w-full px-4 py-3 h-12 bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={clientInfo.serviceType}
                      onChange={(e) => setClientInfo({...clientInfo, serviceType: e.target.value})}
                    >
                      <option value="">Choose service type</option>
                      {SERVICE_TYPES.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Payment Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 h-12 bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={clientInfo.date}
                      onChange={(e) => setClientInfo({...clientInfo, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Proof of Payment Modal Preview */}
              <div className="flex justify-center">
                <div className="bg-navy-900 rounded-3xl w-[432px] h-[540px] relative overflow-hidden" style={{ aspectRatio: '1080/1350' }}>
                  {/* BLUTECH Header */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex items-center">
                      <img src="/blutech.svg" alt="BluTech Logo" className="w-10 h-10 mr-3" />
                      <h1 className="text-primary-500 text-2xl font-bold tracking-wider">BLUTECH</h1>
                    </div>
                  </div>

                  {/* Payment Screenshot Container */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-72 h-80 bg-white rounded-3xl overflow-hidden shadow-2xl">
                    {proofOfPaymentPreview ? (
                      <img src={proofOfPaymentPreview} alt="Payment Screenshot" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <input
                            id="proof-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleProofOfPaymentChange}
                            className="hidden"
                            required
                          />
                          <label htmlFor="proof-upload" className="cursor-pointer">
                            <div className="text-6xl text-gray-400 mb-2">📷</div>
                            <p className="text-gray-600 text-sm">Click to upload</p>
                            <p className="text-gray-500 text-xs">Payment screenshot</p>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remove button for proof of payment */}
                  {proofOfPaymentPreview && (
                    <button
                      type="button"
                      onClick={removeProofOfPayment}
                      className="absolute top-16 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-20"
                    >
                      ✕
                    </button>
                  )}

                  {/* Hexagon Decorations */}
                  <div className="absolute top-32 right-8 w-16 h-16 border-2 border-primary-500/30 transform rotate-12" 
                       style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}></div>
                  <div className="absolute top-48 right-4 w-24 h-24 border-2 border-primary-500/20 transform -rotate-12" 
                       style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}></div>
                  <div className="absolute bottom-32 left-4 w-20 h-20 border-2 border-primary-500/20 transform rotate-45" 
                       style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}></div>

                  {/* Client Information - Below Image */}
                                      <div className="absolute bottom-11 left-1/2 transform -translate-x-1/2 text-center max-w-[320px]">
                      <div className="flex items-center justify-center mb-1 whitespace-nowrap">
                        <span className="text-white text-sm font-semibold">Client#:&nbsp;</span>
                        <span className="text-primary-500 text-sm font-bold">{clientInfo.clientId.replace('Client #', '') || '1'}</span>
                      </div>
                      <div className="flex items-center justify-center mb-1 whitespace-nowrap overflow-hidden">
                        <span className="text-white text-sm font-medium">Service:&nbsp;</span>
                        <span className="text-primary-500 text-sm font-bold truncate">{clientInfo.serviceType || 'Enter Service Type'}</span>
                      </div>
                      <div className="flex items-center justify-center whitespace-nowrap">
                        <span className="text-white text-sm font-semibold">Date:&nbsp;</span>
                        <span className="text-primary-500 text-sm font-bold">{clientInfo.date || 'Enter Date'}</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Review & Confirm</h4>
                <p className="text-gray-600 dark:text-gray-400">Verify all details before creating the project</p>
              </div>

              {/* Project Information Review */}
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  Project Information
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">Project Title</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formData.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">Category</span>
                      <span className="text-gray-900 dark:text-white font-medium capitalize">{formData.category}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">Technologies</span>
                      <div className="flex flex-wrap gap-1">
                        {technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 text-sm block">Description</span>
                    <p className="text-gray-900 dark:text-white font-medium">{formData.description}</p>
                  </div>
                </div>
                
                {(imagePreview || imageFile) && (
                  <div className="mt-6 text-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm block mb-3">Project Image</span>
                    <div className="w-40 h-32 mx-auto bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-navy-600">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Project" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Handle blob URL errors by showing file name
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const container = target.parentNode as HTMLElement;
                            container.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-2">
                              <div class="text-center">
                                <div class="text-2xl mb-1">📷</div>
                                <div class="text-xs">${imageFile?.name || 'Image Selected'}</div>
                              </div>
                            </div>`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-2">
                          <div className="text-center">
                            <div className="text-2xl mb-1">📷</div>
                            <div className="text-xs">{imageFile?.name || 'Image Selected'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Proof of Payment Review */}
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <DollarSign size={16} className="text-white" />
                  </div>
                  Payment Information
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm block">Client ID</span>
                    <span className="text-gray-900 dark:text-white font-medium">{clientInfo.clientId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm block">Service Type</span>
                    <span className="text-gray-900 dark:text-white font-medium">{clientInfo.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm block">Payment Date</span>
                    <span className="text-gray-900 dark:text-white font-medium">{clientInfo.date}</span>
                  </div>
                </div>
                
                {(proofOfPaymentPreview || proofOfPaymentFile) && (
                  <div className="mt-6 text-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm block mb-3">Payment Screenshot</span>
                    <div className="w-40 h-32 mx-auto bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-navy-600">
                      {proofOfPaymentPreview ? (
                        <img 
                          src={proofOfPaymentPreview} 
                          alt="Payment" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Handle blob URL errors by showing file name
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const container = target.parentNode as HTMLElement;
                            container.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-2">
                              <div class="text-center">
                                <div class="text-2xl mb-1">💳</div>
                                <div class="text-xs">${proofOfPaymentFile?.name || 'Payment Image'}</div>
                              </div>
                            </div>`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-2">
                          <div className="text-center">
                            <div className="text-2xl mb-1">💳</div>
                            <div className="text-xs">{proofOfPaymentFile?.name || 'Payment Image'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-navy-700 mt-8">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors font-medium"
              >
                Cancel
              </button>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-gray-200 dark:bg-navy-600 hover:bg-gray-300 dark:hover:bg-navy-500 text-gray-700 dark:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  ← Previous
                </button>
              )}
            </div>

            <div>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.description || (!imagePreview && !project) || technologies.length === 0)) ||
                    (currentStep === 2 && (!proofOfPaymentPreview || !clientInfo.clientId || !clientInfo.serviceType || !clientInfo.date))
                  }
                  className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-lg"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || uploadingImage}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-lg"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : loading ? (
                    'Creating Project...'
                  ) : (
                    <>
                      ✓ Create Project
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Inquiry Modal Component
const InquiryModal = ({ 
  inquiry, 
  onClose, 
  onUpdate
}: { 
  inquiry: ProjectInquiry | null; 
  onClose: () => void; 
  onUpdate: (inquiry: ProjectInquiry, status: string) => void;
}) => {
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed' | 'cancelled'>(inquiry?.status || 'pending');

  if (!inquiry) return null;

  const handleUpdate = () => {
    onUpdate(inquiry, status);
  };

  // Function to detect social media platform and get appropriate icon
  const getSocialMediaIcon = (url: string) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.me')) {
      return <Facebook size={16} className="text-blue-500" />;
    }
    if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
      return <Instagram size={16} className="text-pink-500" />;
    }
    if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('tiktok.app')) {
      return <Music size={16} className="text-red-500" />;
    }
    return <ExternalLink size={16} className="text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-navy-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-navy-700 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">Project Inquiry Details</h3>
              <div className="flex items-center gap-3">
                <span className="text-primary-100 text-sm">
                  Submitted {new Date(inquiry.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-primary-100 text-sm font-medium">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                >
                  <option value="pending" className="text-gray-900">Pending</option>
                  <option value="in_progress" className="text-gray-900">In Progress</option>
                  <option value="completed" className="text-gray-900">Completed</option>
                  <option value="cancelled" className="text-gray-900">Cancelled</option>
                </select>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Client Information */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  Contact Information
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">Full Name</span>
                      <span className="text-gray-900 dark:text-white font-medium">{inquiry.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">Email Address</span>
                      <a href={`mailto:${inquiry.email}`} className="text-primary-500 hover:text-primary-600 font-medium">
                        {inquiry.email}
                      </a>
                    </div>
                  </div>
                  
                  {inquiry.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">Phone Number</span>
                        <a href={`tel:${inquiry.phone}`} className="text-primary-500 hover:text-primary-600 font-medium">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {inquiry.company && (
                    <div className="flex items-center gap-3">
                      <Building size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">Company/Organization</span>
                        <span className="text-gray-900 dark:text-white font-medium">{inquiry.company}</span>
                      </div>
                    </div>
                  )}

                  {/* Social Media Links within Contact Information */}
                  {inquiry.social_media_links && Object.values(inquiry.social_media_links).some(link => link) && (
                    <div className="pt-4 border-t border-gray-200 dark:border-navy-600">
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <ExternalLink size={14} className="text-gray-400" />
                        Social Media Profiles
                      </h5>
                      <div className="space-y-3">
                        {inquiry.social_media_links.facebook && (
                          <div className="flex items-center gap-3">
                            {getSocialMediaIcon(inquiry.social_media_links.facebook)}
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-sm block">Facebook</span>
                              <a 
                                href={inquiry.social_media_links.facebook} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:text-primary-600 font-medium text-sm break-all"
                              >
                                {inquiry.social_media_links.facebook}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {inquiry.social_media_links.instagram && (
                          <div className="flex items-center gap-3">
                            {getSocialMediaIcon(inquiry.social_media_links.instagram)}
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-sm block">Instagram</span>
                              <a 
                                href={inquiry.social_media_links.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:text-primary-600 font-medium text-sm break-all"
                              >
                                {inquiry.social_media_links.instagram}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {inquiry.social_media_links.tiktok && (
                          <div className="flex items-center gap-3">
                            {getSocialMediaIcon(inquiry.social_media_links.tiktok)}
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-sm block">TikTok</span>
                              <a 
                                href={inquiry.social_media_links.tiktok} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:text-primary-600 font-medium text-sm break-all"
                              >
                                {inquiry.social_media_links.tiktok}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Project Details */}
            <div className="space-y-6">
              {/* Project Information */}
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  Project Details
                </h4>
                <div className="space-y-4">
                  {inquiry.service_type && (
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">Service Type</span>
                        <span className="text-gray-900 dark:text-white font-medium">{inquiry.service_type}</span>
                      </div>
                    </div>
                  )}
                  
                  {inquiry.project_type && (
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">Project Type</span>
                        <span className="text-gray-900 dark:text-white font-medium">{inquiry.project_type}</span>
                      </div>
                    </div>
                  )}
                  
                  {inquiry.budget_range && (
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">Budget Range</span>
                        <span className="text-gray-900 dark:text-white font-medium">{inquiry.budget_range}</span>
                      </div>
                    </div>
                  )}
                  
                  {inquiry.timeline && (
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">Timeline</span>
                        <span className="text-gray-900 dark:text-white font-medium">{inquiry.timeline}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Sections */}
          <div className="space-y-6">
            {/* Project Description - Full Width */}
            <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <FileText size={16} className="text-white" />
                </div>
                Project Description
              </h4>
              <div className="bg-white dark:bg-navy-700 rounded-lg p-6 border border-gray-200 dark:border-navy-600">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{inquiry.description}</p>
              </div>
            </div>

            {/* Requested Features - Full Width */}
            {inquiry.requested_features && inquiry.requested_features.length > 0 && (
              <div className="bg-gray-50 dark:bg-navy-800/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <Plus size={16} className="text-white" />
                  </div>
                  Requested Features
                </h4>
                <div className="bg-white dark:bg-navy-700 rounded-lg p-6 border border-gray-200 dark:border-navy-600">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inquiry.requested_features.map((feature, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-primary-600 dark:text-primary-400 text-xs font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-8 border-t border-gray-200 dark:border-navy-700 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Update Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 