import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDirectory } from '../api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { motion } from 'framer-motion';
import { Contact, Mail, MessageCircle, Phone } from 'lucide-react';
import './Directory.css';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: members = [], isLoading: loading } = useQuery({ 
    queryKey: ['directory'], 
    queryFn: getDirectory 
  });

  const filteredMembers = members.filter(member => {
    const name = member['Employee Name'];
    // Completely exclude members without a valid Employee Name
    if (!name || typeof name !== 'string' || name.trim() === '') return false;

    const term = debouncedSearchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) || 
      (member.City && member.City.toLowerCase().includes(term)) ||
      (member.Designation && member.Designation.toLowerCase().includes(term))
    );
  }).sort((a, b) => a['Employee Name'].localeCompare(b['Employee Name']));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header dir-header">
        <div>
          <div className="flex-row">
            <Contact className="header-icon" size={28} />
            <h1>Member Directory</h1>
          </div>
          <p className="subtitle">Search and connect with team members.</p>
        </div>
        
        <input 
          type="text" 
          placeholder="Search by name, role or department..." 
          className="dir-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <SkeletonLoader count={8} />
      ) : (
        <motion.div 
          className="grid-container dir-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredMembers.length === 0 ? (
            <EmptyState 
              icon="search" 
              title="No Members Found" 
              description={searchTerm ? `We couldn't find anyone matching "${searchTerm}". Try a different name or designation.` : "The directory is currently empty."}
            />
          ) : null}
          
          {filteredMembers.map((member, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-card member-card">
              <div className="member-top">
                <div className="avatar">
                  {member['Profile Picture'] ? (
                    <img src={member['Profile Picture']} alt={member['Employee Name']} loading="lazy" />
                  ) : (
                    <span>{member['Employee Name']?.charAt(0) || '?'}</span>
                  )}
                </div>
                <div className="member-info">
                  <h3>{member['Employee Name']}</h3>
                  <span className="role-tag">{member.Designation}</span>
                </div>
              </div>
              
              <div className="member-details">
                <p><strong>City:</strong> {member.City || 'N/A'}</p>
                <p><strong>Manager:</strong> {member['Reporting Manager'] || 'N/A'}</p>
                <p><strong>ID:</strong> {member['Employee Id'] || 'N/A'}</p>
              </div>
              
              <div className="member-actions">
                <a href={`mailto:${member['Email Id']}`} className="action-btn email" title="Email">
                  <Mail size={18} />
                </a>
                <a href={`https://wa.me/${member['Mobile No.']?.replace(/\D/g, '') || ''}`} target="_blank" rel="noreferrer" className="action-btn wa" title="WhatsApp">
                  <MessageCircle size={18} />
                </a>
                <a href={`tel:${member['Mobile No.']}`} className="action-btn phone" title="Call">
                  <Phone size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Directory;
