import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Grades() {
  const { t } = useLanguage();
  const [semesters, setSemesters] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSemesters() {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        try {
          const { data, error } = await supabase.from('study_levels').select('*').order('created_at', { ascending: true });
          if (!error && data && data.length > 0) {
            const mapped = data.map(d => ({
              title: d.name,
              image: d.image_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
              description: d.description,
              price: d.price
            }));
            setSemesters(mapped);
          }
        } catch (err) {
          console.error("Failed to fetch semesters", err);
        }
      }
    }
    fetchSemesters();
  }, []);

  return (
    <section className="px-4 py-20 bg-white dark:bg-[#0b121c] flex flex-col items-center">
      <div className="bg-white dark:bg-slate-800 px-10 py-3 rounded-2xl mb-16 shadow-sm border border-sky-100 dark:border-slate-700 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-700 shadow-md border border-gray-100 dark:border-slate-600 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
        </div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300 dark:bg-slate-600"></div>
        <h3 className="text-slate-800 dark:text-white font-bold text-lg md:text-xl">{t('studyLevels')}</h3>
      </div>

      <div className="flex gap-4 mb-16 opacity-60">
         {[...Array(7)].map((_, i) => (
           <div key={i} className={`flex flex-col gap-2 items-center ${i % 2 === 0 ? 'translate-y-2' : '-translate-y-2'}`}>
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              <div className="w-0.5 h-16 bg-gradient-to-b from-pink-200 dark:from-pink-900 via-gray-300 dark:via-slate-600 to-sky-200 dark:to-sky-900"></div>
              <div className="w-2 h-2 rounded-full bg-sky-400"></div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-[1400px]">
        {semesters.map((sem, index) => (
          <div key={index} className="w-full relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] group cursor-pointer border border-gray-100 dark:border-slate-800">
            <img 
              src={sem.image} 
              alt={sem.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-[#1e3a8a]/40 to-transparent flex flex-col justify-end p-6">
               <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl text-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform border border-white/20 dark:border-slate-700 flex flex-col items-center justify-center gap-2">
                 <h4 className="font-bold text-xl text-[#1e3a8a] dark:text-sky-400 m-0">{sem.title}</h4>
                 {sem.description && <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{sem.description}</p>}
                 {sem.price && <span className="text-pink-500 font-bold text-sm px-3 py-1 bg-pink-50 dark:bg-pink-900/30 rounded-lg mt-1">{sem.price} {t('egp', { defaultValue: 'ج.م' })}</span>}
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
