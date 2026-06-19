import { Facebook, Instagram, Youtube, Send, Music2, ChevronDown } from 'lucide-react';
import logoUrl from '../assets/images/eshrah_teb_logo_text_1781667127098.jpg';

export default function Footer() {
  return (
    <footer className="bg-[#40687a] dark:bg-[#080d14] text-white pt-16 pb-6 px-4 flex flex-col items-center text-center mt-auto w-full z-10 transition-colors duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="flex gap-2 mb-4">
          <span className="font-black text-5xl text-white leading-none tracking-tight">إشرحــ</span>
          <span className="font-black text-5xl text-sky-200 leading-none tracking-tight">طب</span>
        </div>
        <div className="flex items-center justify-center mb-4 bg-white/95 dark:bg-transparent p-4 dark:p-0 rounded-[2rem] shadow-xl dark:shadow-none">
          <img src={logoUrl} alt="إشرح طب" className="h-20 md:h-28 w-auto object-contain mix-blend-multiply dark:invert dark:mix-blend-screen scale-110 md:scale-100" />
        </div>
        <p className="text-white font-bold text-xl drop-shadow-md mt-2">الطب بقى أسهل</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 mt-4">
        <span className="font-bold text-lg md:text-xl">تابعنا علي مواقع التواصل :</span>
        <div className="flex gap-4">
          <a href="#" className="w-12 h-12 rounded-xl bg-[#3b5998] flex items-center justify-center hover:-translate-y-1 transition-transform shadow-md">
             <Facebook className="w-6 h-6 text-white" fill="currentColor" stroke="none" />
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 flex items-center justify-center hover:-translate-y-1 transition-transform shadow-md">
             <Instagram className="w-6 h-6 text-white" />
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-[#ff0000] flex items-center justify-center hover:-translate-y-1 transition-transform shadow-md">
             <Youtube className="w-6 h-6 text-white" />
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-black flex items-center justify-center hover:-translate-y-1 transition-transform shadow-md">
             <Music2 className="w-6 h-6 text-white" />
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-[#0088cc] flex items-center justify-center hover:-translate-y-1 transition-transform shadow-md">
             <Send className="w-6 h-6 text-white" fill="currentColor" />
          </a>
        </div>
      </div>

      <div className="w-full max-w-3xl border-t-2 border-sky-300/20 dark:border-slate-800 pt-8">
         <div className="flex flex-col items-center gap-2">
           <p className="text-lg font-bold text-sky-100 dark:text-slate-300">
              أكاديمية إشرحــ طب
           </p>
           <div className="flex items-center gap-2 mt-4 text-sm font-medium text-sky-200 dark:text-slate-400">
              <span>صنع بكل حب بواسطة</span>
              <a 
                href="https://www.facebook.com/Sh3ark/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/40 dark:bg-slate-800/80 border border-sky-400/30 dark:border-slate-700 rounded-lg hover:bg-sky-900/50 dark:hover:bg-slate-800 hover:border-sky-400/50 transition-all duration-300 text-white font-bold tracking-wide shadow-sm hover:shadow-sky-900/20"
              >
                محمد صبحي
              </a>
           </div>
         </div>
      </div>
    </footer>
  );
}
