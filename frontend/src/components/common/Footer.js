/*
 * File: frontend/src/components/common/Footer.js
 * Description: Modern application footer with company info, links, and social media
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({
  // Brand
  logo,
  title = 'Warehouse System',
  subtitle = 'Management',
  description = 'Hệ thống quản lý kho hiện đại với công nghệ AI và IoT, giúp tối ưu hóa quy trình xuất nhập kho.',
  
  // Links
  sections = [],
  
  // Contact
  contact = {},
  
  // Social media
  socialLinks = [],
  
  // Newsletter
  showNewsletter = false,
  onNewsletterSubmit,
  
  // Stats
  stats = [],
  
  // Legal
  copyright = '2025 Warehouse Management System. All rights reserved.',
  legalLinks = [],
  
  // Version
  version,
  
  // Styling
  variant = 'default', // default, dark, minimal
  showStats = false,
  
  // Custom content
  customContent,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Handle newsletter submission
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setNewsletterLoading(true);
    try {
      await onNewsletterSubmit?.(email);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
    } finally {
      setNewsletterLoading(false);
    }
  };

  const footerClasses = [
    'app-footer',
    variant,
    className
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses}>
      <div className={`footer-content ${variant === 'minimal' ? 'compact' : ''}`}>
        {/* Stats Section */}
        {showStats && stats.length > 0 && (
          <div className="footer-stats">
            {stats.map((stat, index) => (
              <div key={index} className="footer-stat">
                <span className="footer-stat-number">{stat.number}</span>
                <span className="footer-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        {showNewsletter && variant !== 'minimal' && (
          <div className="footer-newsletter">
            <h3 className="footer-newsletter-title">
              📧 Đăng ký nhận thông tin
            </h3>
            <p className="footer-newsletter-description">
              Nhận tin tức mới nhất về các tính năng và cập nhật hệ thống
            </p>
            <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="footer-newsletter-input"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={newsletterLoading}
              />
              <button
                type="submit"
                className="footer-newsletter-button"
                disabled={newsletterLoading}
              >
                {newsletterLoading ? '⏳' : '📤'} Đăng ký
              </button>
            </form>
          </div>
        )}

        {/* Main Footer Content */}
        <div className={`footer-main ${variant === 'minimal' ? 'minimal' : ''}`}>
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              {logo ? (
                <img src={logo} alt={title} className="footer-logo-icon" />
              ) : (
                <div className="footer-logo-icon">🏭</div>
              )}
              <div className="footer-logo-text">
                <div className="footer-logo-title">{title}</div>
                {subtitle && (
                  <div className="footer-logo-subtitle">{subtitle}</div>
                )}
              </div>
            </Link>

            {description && (
              <p className="footer-description">{description}</p>
            )}

            {/* Contact Information */}
            {Object.keys(contact).length > 0 && (
              <div className="footer-contact">
                {contact.address && (
                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">📍</span>
                    <span>{contact.address}</span>
                  </div>
                )}
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="footer-contact-item"
                  >
                    <span className="footer-contact-icon">📞</span>
                    <span>{contact.phone}</span>
                  </a>
                )}
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="footer-contact-item"
                  >
                    <span className="footer-contact-icon">📧</span>
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact.hours && (
                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">🕒</span>
                    <span>{contact.hours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`footer-social-link ${social.platform?.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label || social.platform}
                    title={social.label || social.platform}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="footer-section">
              <h4 className="footer-section-title">{section.title}</h4>
              <ul className="footer-section-list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.url}
                        className="footer-section-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="footer-section-link"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Custom Content */}
        {customContent && (
          <div className="footer-custom">
            {customContent}
          </div>
        )}

        {/* Version Information */}
        {version && (
          <div className="footer-version">
            <div className="footer-version-info">
              <div className="footer-version-number">
                Version {version.number}
              </div>
              {version.date && (
                <div className="footer-version-date">
                  Build: {version.date}
                </div>
              )}
            </div>
            {version.status && (
              <span className={`footer-version-status ${version.status}`}>
                {version.status}
              </span>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className={`footer-bottom ${variant === 'minimal' ? 'minimal' : ''}`}>
          <div className="footer-copyright">
            {copyright}
          </div>

          {legalLinks.length > 0 && (
            <div className="footer-bottom-links">
              {legalLinks.map((link, index) => (
                <React.Fragment key={index}>
                  {link.external ? (
                    <a
                      href={link.url}
                      className="footer-bottom-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.url}
                      className="footer-bottom-link"
                    >
                      {link.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

// Default warehouse footer sections
export const warehouseFooterSections = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Quản lý kho', url: '/features/warehouse' },
      { label: 'Xuất nhập hàng', url: '/features/inventory' },
      { label: 'Báo cáo phân tích', url: '/features/analytics' },
      { label: 'Tích hợp API', url: '/features/api' }
    ]
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', url: '/help' },
      { label: 'Tài liệu API', url: '/docs' },
      { label: 'Video hướng dẫn', url: '/tutorials' },
      { label: 'Liên hệ hỗ trợ', url: '/contact' }
    ]
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', url: '/about' },
      { label: 'Tin tức', url: '/news' },
      { label: 'Tuyển dụng', url: '/careers' },
      { label: 'Đối tác', url: '/partners' }
    ]
  }
];

// Default social links
export const warehouseSocialLinks = [
  {
    platform: 'Facebook',
    label: 'Facebook',
    url: 'https://facebook.com/warehouse-system',
    icon: '📘'
  },
  {
    platform: 'Twitter',
    label: 'Twitter',
    url: 'https://twitter.com/warehouse_sys',
    icon: '🐦'
  },
  {
    platform: 'LinkedIn',
    label: 'LinkedIn',
    url: 'https://linkedin.com/company/warehouse-system',
    icon: '💼'
  },
  {
    platform: 'YouTube',
    label: 'YouTube',
    url: 'https://youtube.com/warehouse-system',
    icon: '📺'
  }
];

// Default legal links
export const warehouseLegalLinks = [
  { label: 'Điều khoản sử dụng', url: '/terms' },
  { label: 'Chính sách bảo mật', url: '/privacy' },
  { label: 'Chính sách cookie', url: '/cookies' },
  { label: 'Bảo mật', url: '/security' }
];

// Default contact information
export const warehouseContact = {
  address: '123 Đường ABC, Quận 1, TP.HCM, Việt Nam',
  phone: '+84 (28) 1234 5678',
  email: 'contact@warehouse-system.com',
  hours: 'T2-T6: 8:00 - 17:00, T7: 8:00 - 12:00'
};

// Default stats
export const warehouseStats = [
  { number: '10,000+', label: 'Sản phẩm được quản lý' },
  { number: '500+', label: 'Khách hàng tin tưởng' },
  { number: '99.9%', label: 'Thời gian hoạt động' },
  { number: '24/7', label: 'Hỗ trợ khách hàng' }
];

// Minimal footer for simple pages
export const MinimalFooter = ({ className = '' }) => (
  <Footer
    variant="minimal"
    sections={[]}
    showNewsletter={false}
    copyright={`© ${new Date().getFullYear()} Warehouse Management System`}
    legalLinks={[
      { label: 'Privacy', url: '/privacy' },
      { label: 'Terms', url: '/terms' }
    ]}
    className={className}
  />
);

// Full-featured footer for main pages
export const FullFooter = ({ 
  onNewsletterSubmit,
  version,
  className = '' 
}) => (
  <Footer
    sections={warehouseFooterSections}
    socialLinks={warehouseSocialLinks}
    contact={warehouseContact}
    stats={warehouseStats}
    legalLinks={warehouseLegalLinks}
    showNewsletter={true}
    showStats={true}
    onNewsletterSubmit={onNewsletterSubmit}
    version={version}
    className={className}
  />
);

export default Footer;