import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { Mail, MessageSquare, Shield, Clock, Send, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', category: 'support', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Contact Us & Grievance Redressal | DocTransfer"
        description="Get in touch with DocTransfer support, partnership leads, or our statutory IT Rules 2021 Grievance Redressal Officer. Fast 24-48 hour response time."
        keywords="Contact DocTransfer, DocTransfer support, grievance officer India, IT Rules 2021 grievance contact, customer support virtual data room"
        url="https://www.doctransfer.app/contact"
      />

      {/* Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Logo size={28} light={true} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link to="/dataroom">
              <button style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}>
                Open Deal Room
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section style={{
        padding: '4.5rem 2rem 3rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            color: '#818cf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <MessageSquare size={14} /> Quick Response SLA • 24-48 Hours
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Get in Touch
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have questions about our zero-knowledge deal rooms, legal templates, or API integrations? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Cards & Form Grid */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>

          {/* Left Column: Direct Info & Grievance Redressal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Support Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.6rem', borderRadius: '10px' }}>
                  <Mail size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>General & Billing Support</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
                For general product inquiries, bug reports, and billing support:
              </p>
              <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                roushan@doctransfer.online
              </a>
            </div>

            {/* Grievance Redressal Card (Mandatory India) */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.6rem', borderRadius: '10px' }}>
                  <Shield size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>Grievance Officer (India)</h3>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
                Under Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules 2021 & the DPDP Act 2023:
              </p>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><strong>Name:</strong> Roushan Kumar</div>
                <div><strong>Designation:</strong> Grievance & Privacy Officer</div>
                <div><strong>Email:</strong> <a href="mailto:roushan@doctransfer.online" style={{ color: '#34d399' }}>roushan@doctransfer.online</a></div>
                <div><strong>Response SLA:</strong> Acknowledged within 24h, resolved within 15 days</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2.5rem'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem' }}>
              Send Us a Message
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Fill in your details below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                color: '#d1fae5'
              }}>
                <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem', color: 'white', fontSize: '1.2rem' }}>Message Received!</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                  Thank you for reaching out. We will respond to {formData.email || 'your email'} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="rohan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Subject Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="support">General Product Support</option>
                    <option value="enterprise">Enterprise Deal Room / CA Firm Inquiry</option>
                    <option value="grievance">Statutory Grievance Redressal (IT Act / DPDP)</option>
                    <option value="partnership">Partnerships & Integrations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help your team?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
