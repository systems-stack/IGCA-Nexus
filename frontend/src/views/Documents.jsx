import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFormats, getWordDownloadUrl, postGasData } from '../api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FileText, Download, Copy, Plus, X } from 'lucide-react';
import './Documents.css';
import './GridCards.css';

const Documents = () => {
  const queryClient = useQueryClient();
  const { data: docs = [], isLoading: loading } = useQuery({ queryKey: ['documents'], queryFn: getFormats });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', googleDocLink: ''
  });

  const saveMutation = useMutation({
    mutationFn: (newDoc) => postGasData('saveDocument', newDoc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleDownload = async (docUrl, id) => {
    setDownloadingId(id);
    try {
      const downloadLink = await getWordDownloadUrl(docUrl);
      if (downloadLink) {
        window.open(downloadLink, '_blank');
        toast.success('Document opened for download!');
      } else {
        toast.error("Could not generate download link.");
      }
    } catch (error) {
      toast.error("Error generating download link.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving document...');
    try {
      await saveMutation.mutateAsync(formData);
      toast.success('Document added successfully!', { id: loadingToast });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', category: '', googleDocLink: '' });
    } catch (error) {
      toast.error("Failed to save document. Check console.", { id: loadingToast });
    }
  };

  // Utility to convert doc link to preview iframe link
  const getPreviewLink = (url) => {
    if (!url) return '';
    return url.replace(/\/edit.*$/, '/preview');
  };

  return (
    <div className="view-container animate-fade-in relative">
      <div className="view-header flex justify-between align-end dir-header">
        <div>
          <div className="flex-row">
            <FileText className="header-icon" size={28} />
            <h1>Documents Format</h1>
          </div>
          <p className="subtitle">Standardized templates for all official firm communications.</p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Document
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <motion.div 
          className="grid-container doc-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {docs.length === 0 ? <p>No documents found.</p> : null}
          
          {docs.map((doc, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-card doc-card">
              <div className="doc-preview">
                 {doc['Google Doc Link'] ? (
                   <iframe 
                     src={getPreviewLink(doc['Google Doc Link'])} 
                     title={doc.Title}
                     className="preview-iframe"
                     loading="lazy"
                   />
                 ) : (
                   <div className="gradient-placeholder flex-center"><FileText size={48} color="rgba(255,255,255,0.5)" /></div>
                 )}
              </div>
              
              <div className="sys-content">
                <span className="doc-category">{doc.Category || 'Document'}</span>
                <h3>{doc.Title}</h3>
                <p>{doc.Description}</p>
                
                <div className="doc-actions">
                  <button 
                    className="doc-btn doc-btn-outline" 
                    onClick={() => handleCopyLink(doc['Google Doc Link'])}
                  >
                    <Copy size={16} /> Copy Link
                  </button>
                  <button 
                    className="doc-btn doc-btn-primary" 
                    onClick={() => handleDownload(doc['Google Doc Link'], idx)}
                    disabled={downloadingId === idx}
                  >
                   {downloadingId === idx ? <div className="spinner-micro"></div> : <Download size={16} />}
                   {downloadingId === idx ? '...' : 'Word'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <div className="modal-header">
              <h2>Add New Document</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Google Doc View/Edit Link</label>
                <input required type="url" value={formData.googleDocLink} onChange={e => setFormData({...formData, googleDocLink: e.target.value})} placeholder="https://docs.google.com/document/d/..." />
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
