import logoUrl from '../assets/images/eshrah_teb_logo_text_1781667127098.jpg';

interface SplashScreenProps {
  isFadingOut: boolean;
}

export default function SplashScreen({ isFadingOut }: SplashScreenProps) {
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0b121c] transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-sky-500/10 dark:bg-sky-500/5 rounded-full animate-ping duration-1000 scale-150" />
          <img 
            src={logoUrl} 
            alt="إشرح طب" 
            className="h-28 sm:h-36 w-auto object-contain relative z-10 animate-pulse mix-blend-multiply dark:invert dark:mix-blend-screen" 
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
          <span>إشرحــ</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-sm">طب</span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-2">
          المنصة الطبية الأسهل
        </p>

        <div className="mt-12 flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-[bounce_1s_infinite_0ms]" />
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-[bounce_1s_infinite_150ms]" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-[bounce_1s_infinite_300ms]" />
        </div>
      </div>
    </div>
  );
}
