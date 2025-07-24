"use client";

import React from 'react';
import { Gamepad2, Users, Calendar, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // In a real app, you'd handle authentication here
    // For now, we'll just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="landing-hero">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gamepad2 style={{ height: '2rem', width: '2rem', color: '#9ca3af' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Game Connect</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleGetStarted}
            className="btn btn-secondary"
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid white',
              color: 'white',
              padding: '0.5rem 1.5rem'
            }}
          >
            Login
          </button>
          <button 
            onClick={handleGetStarted}
            className="btn"
            style={{ 
              backgroundColor: '#d1d5db', 
              color: 'black',
              padding: '0.5rem 1.5rem',
              fontWeight: '600'
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="hero-content">
        <h2 className="hero-title">
          Connect. Play. Compete.
        </h2>
        <p className="hero-subtitle">
          The ultimate gaming community for University of Hawaiʻi students. Find teammates, 
          join tournaments, and discover gaming events right here on campus.
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <Users style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Find Teammates</h3>
            <p style={{ color: '#d1d5db' }}>Connect with fellow UH gamers who share your interests and playstyle</p>
          </div>
          
          <div className="feature-card">
            <Calendar style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Join Events</h3>
            <p style={{ color: '#d1d5db' }}>Discover tournaments, meetups, and gaming events happening on campus</p>
          </div>
          
          <div className="feature-card">
            <Trophy style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Compete</h3>
            <p style={{ color: '#d1d5db' }}>Participate in tournaments and showcase your gaming skills</p>
          </div>
        </div>

        <button 
          onClick={handleGetStarted}
          className="btn"
          style={{ 
            marginTop: '3rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(to right, #d1d5db, #ffffff)',
            color: 'black',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            transform: 'scale(1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'linear-gradient(to right, #9ca3af, #e5e7eb)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'linear-gradient(to right, #d1d5db, #ffffff)';
          }}
        >
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
