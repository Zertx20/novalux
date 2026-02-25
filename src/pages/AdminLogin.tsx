import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-background font-heading">NL</span>
          </div>
          <h1 className="text-2xl font-heading font-bold gold-text">{t('admin')}</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-card p-6 rounded-lg border border-border">
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('email')}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('password')}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full gold-gradient py-3 rounded-lg text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? '...' : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
