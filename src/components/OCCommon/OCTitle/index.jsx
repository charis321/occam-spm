import React from 'react';
import './index.css';

export default function OCTitle({ title, description, className = '', ...props }) {
  return (
    <div className={`oc-title-wrapper ${className}`} {...props}>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
    </div>
  );
}
