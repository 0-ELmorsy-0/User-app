import { useState } from 'react';
import { Menu, LogIn, UserPlus, Sun, Moon, X, Home, LogOut, User } from 'lucide-react';
import { Page } from '../App';
import logoUrl from '../assets/images/eshrah_teb_logo_text_1781667127098.jpg';
import { useLanguage } from '../context/LanguageContext';

type Props = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
};

export default function Navbar({ currentPage, onNavigate, isDark, setIsDark, isLoggedIn, onLogout }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 px-3 sm:px-4 py-2 sm:py-3 min-h-[60px] sm:min-h-[70px] md:min-h-[85px] flex items-center justify-between transition-colors duration-300 shadow-sm backdrop-blur-md ${isDark ? 'bg-[#0b121c]/95 border-b border-slate-800 text-white' : 'bg-white/95 border-b border-gray-100'}`}>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Burger */}
          <button 
            className={`p-1.5 sm:p-2 rounded-xl transition-colors md:hidden shrink-0 ${isDark ? 'text-white hover:bg-slate-800' : 'text-sky-500 hover:bg-sky-50'}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
          
        <div className="flex flex-row items-center justify-center shrink-0 cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full py-1 sm:py-2" onClick={() => onNavigate('home')}>
          <img src={logoUrl} alt="إشرح طب" className="h-full max-h-[50px] sm:max-h-[60px] md:max-h-[75px] w-auto object-contain mix-blend-multiply dark:invert dark:mix-blend-screen" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* On mobile, either show a small login icon or hide them and rely on drawer. I'll hide them via hidden md:flex */}
            {!isLoggedIn ? (
            <>
              {currentPage !== 'login' && (
                <button 
                  onClick={() => onNavigate('login')}
                  className={`hidden md:flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-lg ${isDark ? 'text-white border border-slate-700 hover:bg-slate-800 shadow-sm' : 'text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('login')}</span>
                </button>
              )}
              {currentPage !== 'register' && (
                 <button 
                   onClick={() => onNavigate('register')}
                   className={`hidden md:flex border text-sky-400 px-4 py-2 rounded-lg items-center gap-2 text-sm font-bold transition-all ${isDark ? 'border-sky-500 hover:bg-sky-500/10 shadow-[0_0_10px_rgba(14,165,233,0.2)]' : 'border-sky-400 hover:bg-sky-50'}`}
                 >
                   <UserPlus className="w-4 h-4" />
                   <span>{t('register')}</span>
                 </button>
              )}
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('profile')}
                className={`hidden md:flex bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50 px-4 py-2 rounded-lg items-center gap-2 text-sm font-bold transition-all`}
              >
                <User className="w-4 h-4" />
                <span>{t('profile')}</span>
              </button>
              <button 
                onClick={() => onLogout && onLogout()}
                className={`hidden md:flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center shrink-0 justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 font-bold text-[10px] sm:text-xs hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {language === 'ar' ? 'EN' : 'AR'}
          </button>

          {/* Mode Toggle */}
          <div className="flex items-center shrink-0 bg-gray-100 dark:bg-slate-800 rounded-full p-0.5 sm:p-1 cursor-pointer border border-gray-200 dark:border-slate-700 shadow-inner" onClick={() => setIsDark(!isDark)}>
            <div className={`p-1 sm:p-1.5 rounded-full transition-colors ${!isDark ? 'bg-white shadow-sm text-yellow-500' : 'text-slate-400'}`}><Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
            <div className={`p-1 sm:p-1.5 rounded-full transition-colors ${isDark ? 'bg-slate-600 shadow-sm text-sky-300' : 'text-gray-400'}`}><Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden font-sans dir-rtl">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={`absolute top-0 right-0 w-72 h-full shadow-2xl flex flex-col transition-colors ${isDark ? 'bg-[#0b121c] border-l border-slate-800' : 'bg-white border-l border-gray-100'}`}>
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
              <div className="flex flex-row items-center gap-1.5">
                <img src={logoUrl} alt="إشرح طب" className="h-16 w-auto object-contain mix-blend-multiply dark:invert dark:mix-blend-screen scale-110" />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
               <div className="flex flex-col gap-2 mt-4">
                 <button 
                    onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-gray-100'}`}
                 >
                   <Home className="w-5 h-5" />
                   <span className="font-bold">{t('home')}</span>
                 </button>
                 {isLoggedIn && (
                   <>
                    <button 
                       onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }}
                       className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-gray-100'}`}
                    >
                      <User className="w-5 h-5 text-sky-500" />
                      <span className="font-bold">{t('profile')}</span>
                    </button>
                    <button 
                       onClick={() => { onNavigate('my-courses'); setIsMobileMenuOpen(false); }}
                       className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-gray-100'}`}
                    >
                      <User className="w-5 h-5 text-pink-500" />
                      <span className="font-bold">{t('myCourses')}</span>
                    </button>
                   </>
                 )}
               </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
              {!isLoggedIn ? (
                <>
                  {currentPage !== 'login' && (
                    <button 
                      onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold transition-all ${isDark ? 'text-slate-200 bg-slate-800 hover:bg-slate-700' : 'text-slate-700 bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>{t('login')}</span>
                    </button>
                  )}
                  {currentPage !== 'register' && (
                     <button 
                       onClick={() => { onNavigate('register'); setIsMobileMenuOpen(false); }}
                       className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold transition-all bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30`}
                     >
                       <UserPlus className="w-5 h-5" />
                       <span>{t('register')}</span>
                     </button>
                  )}
                </>
              ) : (
                 <button 
                   onClick={() => { onLogout && onLogout(); setIsMobileMenuOpen(false); }}
                   className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold transition-all text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20`}
                 >
                   <LogOut className="w-5 h-5" />
                   <span>{t('logout')}</span>
                 </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
