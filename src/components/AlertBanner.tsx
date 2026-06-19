import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AlertBannerProps {
  userSemester?: string;
  isLoggedIn: boolean;
}

export default function AlertBanner({ userSemester, isLoggedIn }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [alertData, setAlertData] = useState<{title: string, message: string} | null>(null);

  useEffect(() => {
    async function fetchAlert() {
      if (!isLoggedIn || !userSemester) {
          setAlertData(null);
          return;
      }
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .eq('academic_year', userSemester)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setAlertData({
              title: data.title,
              message: data.message
          });
          setIsVisible(true);
        } else {
            setAlertData(null);
        }
      } catch (err) {
        console.error('Error fetching alert:', err);
      }
    }

    fetchAlert();
  }, [userSemester, isLoggedIn]);

  if (!isVisible || !alertData || !isLoggedIn) return null;

  return (
    <div className="px-4 py-4 w-full max-w-5xl mx-auto z-10 relative">
      <div className="bg-[#151c28] border border-red-500/30 rounded-xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 left-3 bg-[#1e293b] hover:bg-slate-700 p-1.5 rounded-md text-gray-400 hover:text-white transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-white font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
            {alertData.title} <AlertCircle className="w-5 h-5 text-red-500" />
          </h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl">
            {alertData.message}
          </p>
        </div>
      </div>
    </div>
  );
}
