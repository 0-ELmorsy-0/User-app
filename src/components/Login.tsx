import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Page } from '../App';
import React, { useState } from 'react';
import medicalAuthUrl from '../assets/images/medical_auth_vertical_text_1781667535732.jpg';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Login({ onNavigate, onAuth }: { onNavigate: (p: Page) => void, onAuth: (semester?: string) => void }) {
  const [useCode, setUseCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const fakeEmail = `${phone}@student-app.com`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      });

      if (error) throw error;
      
      let userSemester = undefined;
      // Try fetching student profile
      if (data?.user) {
        const { data: profile } = await supabase.from('students').select('academic_year').eq('id', data.user.id).single();
        if (profile?.academic_year) {
           userSemester = profile.academic_year;
        }
      }
      
      toast.success("تم تسجيل الدخول بنجاح!");
      onAuth(userSemester);
    } catch (err: any) {
      toast.error(err.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      imageTitle={t('login')} 
      imageUrl={medicalAuthUrl}
    >
      <div className="mb-10 text-center md:text-right">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
          <span>{t('loginHeader')}</span>
          <span className="text-2xl">👋</span>
        </h2>
        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
          {t('loginDescLabel')}
        </p>
      </div>

      <form className="space-y-8 max-w-md" onSubmit={handleSubmit}>
        <div className="relative group">
            <Phone className="absolute right-0 top-3 w-5 h-5 text-sky-500 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('loginPhoneLabel')} 
              className="w-full bg-transparent border-b border-gray-300 dark:border-slate-700 py-3 pr-8 pl-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-colors" 
            />
        </div>

        <div className="relative group">
            <Lock className="absolute right-0 top-3 w-5 h-5 text-sky-500 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type={showPassword && !useCode ? "text" : (useCode ? "text" : "password")} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={useCode ? t('loginCodeLabel') : t('loginPasswordLabel')} 
              className="w-full bg-transparent border-b border-gray-300 dark:border-slate-700 py-3 pr-8 pl-8 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-colors" 
            />
            {!useCode && (
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-3 text-slate-500 hover:text-slate-300 transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
        </div>

        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-gray-200 dark:border-slate-800/50">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{t('loginWithCode')}</span>
            <button 
              type="button" 
              onClick={() => setUseCode(!useCode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useCode ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useCode ? '-translate-x-6' : '-translate-x-1'}`} />
            </button>
        </div>

        <button disabled={loading} type="submit" className="w-full md:w-auto md:min-w-[200px] mx-auto block bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-yellow-400/20 mt-8 transition-all hover:-translate-y-0.5 disabled:opacity-50">
          {loading ? '...' : t('login')}
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
          {t('noAccountLabel')}{' '}
          <button type="button" onClick={() => onNavigate('register')} className="text-sky-400 hover:text-sky-300 hover:underline font-bold transition-colors">
            {t('registerNowLink')}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
