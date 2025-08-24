'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimateWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export const ScrollAnimateWrapper: React.FC<ScrollAnimateWrapperProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  threshold = 0.1 
}) => {
  const { ref, isInView } = useScrollAnimation({ threshold });

  return (
    <div
      ref={ref}
      className={`scroll-animate ${isInView ? 'in-view' : ''} ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
