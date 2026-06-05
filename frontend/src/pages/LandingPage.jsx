import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Globe, ArrowRight, CheckCircle, CreditCard, PieChart, Users, Landmark } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page animate-fade-in" style={{ 
      color: 'var(--text-primary)',
      background: 'var(--bg-color)',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        background: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid var(--surface-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Outfit' }}>
          <Landmark color="var(--primary-color)" size={32} />
          Banking App
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Features</a>
          <a href="#stats" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Network</a>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Join Now</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '12rem 2rem 8rem',
        textAlign: 'center',
        backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.6), rgba(10, 10, 10, 1)), url('/C:/Users/RUSSELL/.gemini/antigravity/brain/6af5411d-27a0-41ee-bc80-d8e9ea7d1752/hero_banking_bg_1777114958659.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="animate-slide-up">
          <div style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1.5rem', 
            background: 'rgba(212, 175, 55, 0.1)', 
            color: 'var(--primary-color)', 
            borderRadius: '100px', 
            fontSize: '0.85rem', 
            fontWeight: '600', 
            letterSpacing: '0.1em',
            marginBottom: '2rem',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            THE NEXT GENERATION OF WEALTH
          </div>
          <h1 style={{ 
            fontSize: 'max(3.5rem, 6vw)', 
            fontWeight: '800', 
            marginBottom: '1.5rem', 
            fontFamily: 'Outfit, sans-serif',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(to bottom, #ffffff, #a1a1aa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Digital Banking for the <span style={{ color: 'var(--primary-color)' }}>Modern Era</span>
          </h1>
          <p style={{ 
            fontSize: '1.4rem', 
            color: 'var(--text-secondary)', 
            maxWidth: '750px', 
            margin: '0 auto 3.5rem',
            lineHeight: '1.6'
          }}>
            Experience the future of finance with our secure, high-yield, and user-centric banking platform. Designed for excellence, built for you.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.15rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Get Started <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 2rem', background: '#0D0D0D' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Financial Empowerment</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Sophisticated tools for your financial growth and security.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <FeatureCard 
              icon={<Shield color="var(--primary-color)" size={36} />}
              title="Secure Infrastructure"
              description="Your security is our priority. We use advanced encryption and PIN verification for every critical action."
            />
            <FeatureCard 
              icon={<CreditCard color="var(--primary-color)" size={36} />}
              title="Multi-account Management"
              description="Create and manage multiple accounts effortlessly. Track your spending and savings in real-time."
            />
            <FeatureCard 
              icon={<PieChart color="var(--primary-color)" size={36} />}
              title="Yield-focused Deposits"
              description="Invest in fixed deposits with industry-leading interest rates and flexible tenures from 6 to 60 months."
            />
            <FeatureCard 
              icon={<Smartphone color="var(--primary-color)" size={36} />}
              title="Personalized Loans"
              description="Access quick liquidity with our transparent loan application process and competitive 10.5% interest rate."
            />
            <FeatureCard 
              icon={<Globe color="var(--primary-color)" size={36} />}
              title="Global Accessibility"
              description="Access your dashboard and perform transactions from anywhere in the world, securely and instantly."
            />
            <FeatureCard 
              icon={<Users color="var(--primary-color)" size={36} />}
              title="Inclusive Banking"
              description="Dedicated features for senior citizens including priority rates and simplified interface options."
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '3rem' }}>
          <StatItem value="1M+" label="Active Users" />
          <StatItem value="₹500Cr+" label="Assets Managed" />
          <StatItem value="99.9%" label="Security Uptime" />
          <StatItem value="24/7" label="Customer Support" />
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div className="glass-panel" style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '4rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(76, 29, 149, 0.1) 100%)',
          borderRadius: '32px'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Take Control?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Join thousands of users who have already switched to the most advanced digital banking platform.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '12px' }}>
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a>
        </div>
        <p>© 2026 Banking App. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel card-hover" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }}>
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
  </div>
);

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>{value}</div>
    <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>{label}</div>
  </div>
);

export default LandingPage;
