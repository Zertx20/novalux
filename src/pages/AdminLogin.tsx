import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/Prime_Sport_Store_logo_design_202605081633.jpeg';
import AnimatedBackground from '@/components/AnimatedBackground';

const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 10, 30, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '24px',
          padding: '40px 36px',
          textAlign: 'center',
          margin: '20px'
        }}>
          {/* Logo */}
          <img 
            src={logo} 
            alt="Nova Lux Logo" 
            style={{
              width: '72px',
              height: '72px',
              marginBottom: '16px',
              borderRadius: '50%',
              filter: 'drop-shadow(0 0 16px rgba(139,92,246,0.7))'
            }} 
          />

          {/* Title */}
          <h1 style={{
            color: '#F1F0FF',
            fontSize: '24px',
            fontWeight: 800,
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Cairo'
          }}>لوحة التحكم</h1>

          <form onSubmit={handleLogin}>
            {/* Email input */}
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
              <label style={{
                color: '#9B99B8',
                fontSize: '13px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
                fontFamily: 'Cairo'
              }}>البريد الإلكتروني</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(26, 26, 38, 0.8)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '12px',
                  color: '#F1F0FF',
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontFamily: 'Cairo',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#8B5CF6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password input */}
            <div style={{ marginBottom: '24px', textAlign: 'right' }}>
              <label style={{
                color: '#9B99B8',
                fontSize: '13px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
                fontFamily: 'Cairo'
              }}>كلمة المرور</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(26, 26, 38, 0.8)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '12px',
                  color: '#F1F0FF',
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontFamily: 'Cairo',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#8B5CF6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Login button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'Cairo',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
                transition: 'all 0.25s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,92,246,0.7)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? '...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
