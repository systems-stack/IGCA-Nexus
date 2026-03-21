import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUpdates, getStats } from '../api';
import { motion } from 'framer-motion';
import { Briefcase, Users, LayoutList, CheckCircle2, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { data: stats = [], isLoading: statsLoading } = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const { data: updates = [], isLoading: updatesLoading } = useQuery({ queryKey: ["updates"], queryFn: getUpdates });
  
  const loading = statsLoading || updatesLoading;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="home-container animate-fade-in">
      
      <div className="home-main">
        {/* HERO SECTION */}
        <section className="hero-section glass-panel">
          <h1>Welcome to Nexus</h1>
          <p className="hero-subtitle">The private digital home base for the IGCA team.</p>
          
          <div className="hero-grid glass-panel mt-6">
            <div className="hero-grid-content">
              <h2 className="gradient-text">Quality is an Assurance</h2>
              <p>
                Since 1961, IGCA has been a trusted partner for businesses across India. 
                We are a dedicated team providing expert financial, consulting, and tax services. 
                Nexus is here to support you in delivering that excellence every single day.
              </p>
              
              <div className="stats-row">
                {loading ? (
                  <p>Loading stats...</p>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}
                  >
                    {stats.map((stat, idx) => (
                      <motion.div variants={itemVariants} key={idx} className="stat-card">
                        <h3>{stat.value}</h3>
                        <span>{stat.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* INFO CARDS */}
        <motion.section 
          className="info-cards-section mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="info-card glass-panel">
            <LayoutList className="info-icon" />
            <h3>Centralized Systems</h3>
            <p>Access all your tools, from the Work Execution System to the Help Desk, in one unified place.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="info-card glass-panel">
            <Briefcase className="info-icon" />
            <h3>Standard Formats</h3>
            <p>Quickly locate and download official firm templates and documents with ease.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="info-card glass-panel">
            <Users className="info-icon" />
            <h3>Firm Directory</h3>
            <p>Connect instantly with any IGCA member across departments and locations.</p>
          </motion.div>
        </motion.section>
      </div>

      {/* RIGHT SIDEBAR: UPDATES */}
      <aside className="updates-sidebar glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="updates-header">
          <CheckCircle2 size={18} />
          <h3>FIRM INTELLIGENCE</h3>
        </div>
        
        <div className="updates-list-wrapper">
          <div className={`updates-list ${updates.length > 2 ? 'scrolling' : ''}`}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : updates.length === 0 ? (
              <p className="no-data">No updates found.</p>
            ) : (
              (updates.length > 2 ? [...updates, ...updates] : updates).map((update, idx) => {
                const catClass = update.TagClass || 'tag-default';
                return (
                  <div key={idx} className="update-item">
                    <span className={`update-tag ${update.TagClass ? update.TagClass : catClass}`}>
                      {update.Icon && <span style={{marginRight: '6px'}}>{update.Icon}</span>}
                      {update.Tag || 'UPDATE'}
                    </span>
                    <p className="update-text">{update.Text || ''}</p>
                    <div className="update-meta">
                      <Clock size={12} />
                      <span>{update.Time || 'Recently'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;
