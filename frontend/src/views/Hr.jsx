import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHrLinks } from '../api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import { ExternalLink, Users } from 'lucide-react';
import './GridCards.css';

const Hr = () => {
  const { data: links = [], isLoading: loading } = useQuery({ 
    queryKey: ['hrLinks'], 
    queryFn: getHrLinks 
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div className="flex-row">
          <Users className="header-icon" size={28} />
          <h1>Human Resources</h1>
        </div>
        <p className="subtitle">Manage payroll, KPIs, attendance, and HR policies.</p>
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <motion.div 
          className="grid-container"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {links.length === 0 ? (
            <EmptyState 
              icon="folder" 
              title="No HR Modules" 
              description="There are currently no HR links or portals configured."
            />
          ) : null}
          
          {links.map((link, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-card sys-card">
              <div className="sys-image-placeholder">
                {link['Image URL'] ? (
                  <img src={link['Image URL']} alt={link.Title} loading="lazy" />
                ) : (
                  <div className="gradient-placeholder-hr"></div>
                )}
              </div>
              <div className="sys-content">
                <h3>{link.Title}</h3>
                <p>{link.Description}</p>
                
                <a 
                  href={link['Link URL'] || link.Link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                >
                  Open Module <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Hr;
