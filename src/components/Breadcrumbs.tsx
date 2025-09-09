import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center hover:text-gray-900 transition-colors"
        title="首页"
      >
        <FiHome size={16} />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FiChevronRight size={14} className="text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
