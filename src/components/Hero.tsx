import { Page } from '../App';
import logoUrl from '../assets/images/eshrah_teb_logo_text_1781667127098.jpg';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
}

export default function Hero({ onNavigate, isLoggedIn }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative px-4 pt-12 pb-8 overflow-hidden bg-gradient-to-b from-blue-50/80 to-white dark:from-[#0f172a] dark:to-[#0b121c] flex flex-col items-center text-center">
      <div className="absolute top-10 right-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-20 left-0 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl -z-10"></div>

      {!isLoggedIn && (
        <>
          <h1 className="text-5xl md:text-6xl font-black mb-2 text-slate-800 dark:text-white tracking-tight">
            {t('heroTitleAcademy')} <span className="text-pink-500">{t('heroTitleEshrah')}</span>
          </h1>
          <h2 className="text-6xl md:text-7xl font-black text-sky-500 mb-6 drop-shadow-sm">
            {t('heroTitleEducation')}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto font-medium text-base md:text-lg leading-relaxed px-4">
            {t('heroSubtitle')}
          </p>
        </>
      )}

      <div className="relative w-full max-w-xs md:max-w-md mx-auto flex justify-center mb-10">
        <img 
          src={logoUrl} 
          alt="إشرحــ طب" 
          className="w-full h-auto object-contain rounded-2xl mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:p-4"
        />
      </div>

      <div className="flex flex-col gap-4 mb-14 w-full max-w-[280px]">
        {isLoggedIn ? (
          <button 
            onClick={() => onNavigate('my-courses')}
            className="bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-sky-200 dark:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>🧠</span> {t('myCourses')}
          </button>
        ) : (
          <>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-sky-200 dark:shadow-none hover:-translate-y-1 transition-all"
            >
              {t('startNowBtn')}
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="bg-white hover:bg-gray-50 text-sky-600 border-2 border-sky-100 dark:bg-slate-800 dark:border-slate-700 dark:text-sky-400 dark:hover:bg-slate-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-md hover:-translate-y-1 transition-all"
            >
              {t('login')}
            </button>
          </>
        )}
      </div>

    </section>
  );
}
