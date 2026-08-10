import React, { useEffect, useState } from 'react';

const MaintenanceScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
      {/* Decorative background blobs */}
      <div style={styles.blobTopRight} />
      <div style={styles.blobBottomLeft} />

      {/* Content wrapper */}
      <div style={styles.container}>
        {/* LEFT — Illustration */}
        <div style={styles.illustrationSide}>
          <img
            src="/maintenance_illustration.png"
            alt="Workers performing site maintenance"
            style={styles.illustration}
          />
        </div>

        {/* RIGHT — Text */}
        <div style={styles.textSide}>

          <h1 style={styles.heading}>
            SITE UNDER
            <br />
            <span style={styles.headingAccent}>MAINTENANCE</span>
          </h1>

          <p style={styles.description}>
            We're upgrading our store to serve you better. Moderate's Textile
            will be back shortly with a fresh new experience — premium fabrics,
            quality combos, and faster ordering via WhatsApp.
          </p>

          {/* Animated status row */}
          <div style={styles.statusRow}>
            <div style={styles.statusDot} />
            <span style={styles.statusText}>Working on it{dots}</span>
          </div>

          {/* Notify CTA */}
          <div style={styles.ctaRow}>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
            />
            <button style={styles.button}>Notify Me</button>
          </div>


        </div>
      </div>

      {/* Inline styles for keyframes via a style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .maintenance-illus {
          animation: float 4s ease-in-out infinite;
        }
        .maintenance-status-dot {
          animation: pulse-dot 1.2s ease-in-out infinite;
        }
        .maintenance-text-side {
          animation: fade-in-up 0.7s ease forwards;
        }
        .maintenance-btn:hover {
          background: #00897b !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,150,136,0.4) !important;
        }
        .maintenance-input:focus {
          outline: none;
          border-color: #009688 !important;
          box-shadow: 0 0 0 3px rgba(0,150,136,0.2);
        }
      `}</style>
    </div>
  );
};

const TEAL = '#00BFA5';
const TEAL_DARK = '#009688';
const TEAL_BG = '#E0F7F4';
const TEXT_DARK = '#1a3c3a';

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${TEAL_BG} 0%, #b2dfdb 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },

  blobTopRight: {
    position: 'absolute',
    top: '-120px',
    right: '-120px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(0,188,165,0.18)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },

  blobBottomLeft: {
    position: 'absolute',
    bottom: '-120px',
    left: '-80px',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(0,150,136,0.12)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3rem',
    maxWidth: '980px',
    width: '100%',
  },

  illustrationSide: {
    flex: '1 1 340px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '280px',
  },

  illustration: {
    width: '100%',
    maxWidth: '440px',
    height: 'auto',
    filter: 'drop-shadow(0 24px 48px rgba(0,100,90,0.18))',
  },

  textSide: {
    flex: '1 1 300px',
    minWidth: '260px',
    animation: 'fade-in-up 0.7s ease forwards',
  },

  badge: {
    display: 'inline-block',
    background: 'rgba(0,150,136,0.15)',
    color: TEAL_DARK,
    border: `1.5px solid ${TEAL_DARK}`,
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 600,
    padding: '4px 14px',
    marginBottom: '1rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },

  heading: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    color: TEXT_DARK,
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.01em',
  },

  headingAccent: {
    color: TEAL_DARK,
  },

  description: {
    color: '#4a6b68',
    fontSize: '0.97rem',
    lineHeight: 1.7,
    margin: '1rem 0 1.4rem 0',
    maxWidth: '380px',
  },

  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1.6rem',
  },

  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: TEAL,
    animation: 'pulse-dot 1.2s ease-in-out infinite',
  },

  statusText: {
    color: TEAL_DARK,
    fontWeight: 600,
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    minWidth: '130px',
  },

  ctaRow: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },

  input: {
    flex: 1,
    minWidth: '180px',
    padding: '0.65rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #b2dfdb',
    background: 'rgba(255,255,255,0.7)',
    color: TEXT_DARK,
    fontSize: '0.9rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  button: {
    padding: '0.65rem 1.4rem',
    borderRadius: '10px',
    border: 'none',
    background: TEAL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 16px rgba(0,150,136,0.25)',
    whiteSpace: 'nowrap',
  },

  eta: {
    color: '#7a9e9b',
    fontSize: '0.82rem',
    margin: 0,
  },
};

export default MaintenanceScreen;
