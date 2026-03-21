import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSystems } from '../api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import { ExternalLink, Database } from 'lucide-react';
import './GridCards.css';

const Systems = () => {
  const { data: systems = [], isLoading: loading } = useQuery({ 
    queryKey: ['systems'], 
    queryFn: getSystems 
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
          <Database className="header-icon" size={28} />
          <h1>Internal Systems</h1>
        </div>
        <p className="subtitle">Launch our dedicated enterprise modules securely.</p>
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
          {systems.length === 0 ? (
            <EmptyState 
              icon="layers" 
              title="No Systems Found" 
              description="There are currently no internal systems configured in the database."
            />
          ) : null}
          
          {systems.map((sys, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-card sys-card">
              <div className="sys-image-placeholder">
                {sys['Image URL'] ? (
                  <img src={sys['Image URL']} alt={sys.Title} loading="lazy" />
                ) : (
                  <div className="gradient-placeholder"></div>
                )}
              </div>
              <div className="sys-content">
                <h3>{sys.Title}</h3>
                <p>{sys.Description}</p>
                
                <a 
                  href={sys['Link URL'] || sys.Link || '#'} 
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

export default Systems;
