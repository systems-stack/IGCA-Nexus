import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, FolderOpen, Layers, Inbox } from 'lucide-react';
import './EmptyState.css';

const ICONS = {
  search: SearchX,
  folder: FolderOpen,
  layers: Layers,
  inbox: Inbox,
};

const EmptyState = ({ 
  icon = 'inbox', 
  title = "No Data Found", 
  description = "There is currently no information to display here.", 
  action 
}) => {
  const IconComponent = ICONS[icon] || Inbox;

  return (
    <motion.div 
      className="empty-state-wrapper glass-panel"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="empty-state-icon">
        <IconComponent size={48} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
