import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

interface TopStudent {
  id: string;
  name: string;
  address: string;
  emoji: string;
  score: number;
}

export default function TopStudents() {
  const { t } = useLanguage();
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('top_students')
          .select('*')
          .order('score', { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching top students:", error);
        } else {
          setTopStudents(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, []);

  const firstPlace = topStudents[0];
  const secondPlace = topStudents[1];
  const thirdPlace = topStudents[2];

  return (
    <section className="px-4 py-20 bg-gradient-to-b from-sky-50/50 to-white dark:from-[#0b121c] dark:to-[#0f172a] flex flex-col items-center">
      <div className="bg-white dark:bg-slate-800 px-10 py-3 rounded-full mb-12 shadow-sm border border-sky-100 dark:border-slate-700 relative">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300 dark:bg-slate-600"></div>
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rotate-45 w-0.5 h-8 origin-bottom bg-gray-300 dark:bg-slate-600"></div>
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 -rotate-45 w-0.5 h-8 origin-bottom bg-gray-300 dark:bg-slate-600"></div>
        <h3 className="text-slate-800 dark:text-white font-bold text-lg md:text-xl">{t('topStudentsBadge')}</h3>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-pink-500 mb-3 tracking-tight">{t('topStudentsHeader1')}</h2>
        <h2 className="text-4xl md:text-5xl font-black text-sky-500 mb-6 drop-shadow-sm">{t('topStudentsHeader2')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-sm mx-auto font-medium leading-relaxed px-4">
          {t('topStudentsDesc')}
        </p>
      </div>

      {!loading && topStudents.length > 0 && (
        <div className="flex items-end justify-center gap-1 sm:gap-4 md:gap-8 max-w-3xl w-full mx-auto h-72 md:h-80 mt-8 px-2 md:px-6">
          {/* Second Place */}
          {secondPlace && (
            <div className="w-1/3 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100 pb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center text-3xl sm:text-4xl rounded-full border-[3px] md:border-[6px] border-sky-200 dark:border-sky-900 mb-2 md:mb-3 overflow-hidden bg-white dark:bg-slate-800 shadow-xl relative z-10 transition-transform hover:scale-105">
                {secondPlace.emoji || '⭐️'}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 md:mb-3 text-center leading-tight break-words max-w-[120px] h-8 sm:h-auto flex items-center justify-center px-1">
                {secondPlace.name}
              </span>
              <div className="w-full max-w-[100px] md:max-w-[140px] bg-gradient-to-b from-sky-400 to-sky-100 h-24 sm:h-28 rounded-t-2xl flex justify-center pt-3 md:pt-4 shadow-inner relative">
                <div className="absolute inset-0 bg-white/20 rounded-t-2xl"></div>
                <span className="text-white font-black text-xl md:text-2xl drop-shadow-md z-10">2</span>
              </div>
            </div>
          )}

          {/* First Place */}
          {firstPlace && (
            <div className="w-1/3 flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center text-4xl sm:text-5xl rounded-full border-[4px] md:border-[8px] border-yellow-400 dark:border-yellow-600 mb-2 md:mb-3 overflow-hidden bg-white dark:bg-slate-800 shadow-2xl relative z-10 -top-2 sm:-top-4 md:-top-6 transition-transform hover:scale-105">
                {firstPlace.emoji || '🏆'}
              </div>
              <span className="text-[11px] sm:text-sm md:text-base font-bold text-slate-900 dark:text-white mb-2 md:mb-3 relative -top-1 sm:-top-2 md:-top-3 text-center leading-tight break-words max-w-[140px] h-8 sm:h-auto flex items-center justify-center px-1">
                {firstPlace.name}
              </span>
              <div className="w-full max-w-[120px] md:max-w-[160px] bg-gradient-to-b from-yellow-400 to-yellow-100 h-32 sm:h-40 rounded-t-2xl flex justify-center pt-3 md:pt-4 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-300 rounded-t-2xl"></div>
                <span className="text-yellow-900 font-black text-3xl md:text-4xl drop-shadow-md z-10">1</span>
              </div>
            </div>
          )}

          {/* Third Place */}
          {thirdPlace && (
            <div className="w-1/3 flex flex-col items-center animate-in slide-in-from-bottom-6 duration-700 delay-200 pb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center text-2xl sm:text-3xl rounded-full border-[3px] md:border-[6px] border-orange-200 dark:border-orange-900/50 mb-2 md:mb-3 overflow-hidden bg-white dark:bg-slate-800 shadow-xl relative z-10 transition-transform hover:scale-105">
                {thirdPlace.emoji || '🥉'}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 md:mb-3 text-center leading-tight break-words max-w-[120px] h-8 sm:h-auto flex items-center justify-center px-1">
                {thirdPlace.name}
              </span>
              <div className="w-full max-w-[100px] md:max-w-[140px] bg-gradient-to-b from-orange-400 to-orange-100 h-16 sm:h-20 rounded-t-2xl flex justify-center pt-2 md:pt-3 shadow-inner relative">
                <div className="absolute inset-0 bg-white/20 rounded-t-2xl"></div>
                <span className="text-white font-black text-lg md:text-xl drop-shadow-md z-10">3</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
