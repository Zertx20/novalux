import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/Prime_Sport_Store_logo_design_202605081633.jpeg';

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
          <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="Nova Lux Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-heading font-bold purple-text">{t('admin')}</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-black p-6 rounded-lg border-2 border-purple-500/50">
          <div>
            <label className="text-sm font-medium text-white">{t('email')}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-white">{t('password')}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full purple-gradient py-3 rounded-lg text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? '...' : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
