import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Star, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const CircularProgress = ({ percentage, color, title, subtitle1, subtitle2, subtitleColor }: any) => (
  <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex-1 md:flex-none min-w-[200px]">
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke={color} 
          strokeWidth="8" 
          strokeDasharray={`${2 * Math.PI * 45}`} 
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - Math.min(100, Math.max(0, percentage)) / 100)}`}
           className="transition-all duration-1000 ease-out" 
           strokeLinecap="round" 
         />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-slate-800 dark:text-white">
        <span dir="ltr">{percentage}%</span>
      </div>
    </div>
    <div className="flex flex-col items-center gap-2 w-full">
      <h3 className="text-slate-700 dark:text-slate-200 font-bold text-base text-center">{title}</h3>
      {subtitle1 && subtitle2 && (
        <div className="flex items-center justify-center gap-2 w-full mt-1">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${subtitleColor}`}>{subtitle1}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600`}>{subtitle2}</span>
        </div>
      )}
    </div>
  </div>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useLanguage();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserData({
          email: session.user.email,
          phone: session.user.phone,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        });
        
        supabase.from('students').select('*').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setUserData((prev: any) => ({
                ...prev,
                name: data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : data.full_name || prev.name,
                email: data.email || prev.email,
                phone: data.phone || prev.phone,
                parentPhone: data.parent_phone,
                academicYear: data.academic_year,
                collegeName: data.college_name,
                governorate: data.governorate,
                addressDetails: data.address_detailed,
              }));
            }
          });
      }
    });
  }, []);

  const sidebarLinks = [
    { id: 'profile', label: t('userProfile') },
    { id: 'charge', label: t('chargeCodeBtn') },
    { id: 'lectures', label: t('lecturesCodes') },
    { id: 'my-courses', label: t('myCourses') },
    { id: 'security', label: t('securityAndLogins') },
    { id: 'views', label: t('viewsDetails') },
    { id: 'invoices', label: t('invoices') },
    { id: 'subscriptions', label: t('subscriptions') },
    { id: 'exam-results', label: t('examResults') },
    { id: 'homework-results', label: t('homeworkResults') },
  ];

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-900 font-sans pb-20 transition-colors">
      {/* Top Banner Gradient */}
      <div className="h-44 md:h-64 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-90 rounded-b-[40px] md:rounded-b-[80px] absolute top-0 left-0"></div>

      <div className="relative pt-24 md:pt-32 max-w-6xl mx-auto px-4 z-10">
        
        {/* Main Profile Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row transition-colors">
          
          {/* Top Mobile Heading / Desktop hidden */}
          <div className="md:hidden flex justify-center -mt-5 mb-4 relative z-20">
             <div className="bg-blue-500 text-white dark:bg-blue-600 px-8 py-2 rounded-full font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
                <span>ملف المستخدم</span>
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 md:border-l border-slate-200 dark:border-slate-700 order-2 md:order-1 pt-4 pb-8 md:py-8 md:rounded-r-2xl rounded-b-2xl md:rounded-bl-none transition-colors">
            <div className="flex flex-col px-4 gap-1">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`text-right px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === link.id 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-10 order-1 md:order-2">
            
            {/* Desktop Heading */}
            <div className="hidden md:flex justify-center -mt-16 mb-10 relative z-20">
              <div className="bg-blue-500 dark:bg-blue-600 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
                <span>ملف المستخدم</span>
              </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'profile' ? (
              <div className="space-y-12">
                {/* User Info Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 dark:border-slate-700 pb-8 transition-colors">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-slate-400 dark:text-slate-500" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-right md:mt-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                       {userData?.name || "جاري التحميل..."}
                    </h2>
                    <div className="flex flex-col items-center md:items-start gap-4 text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center">
                           <Phone className="w-4 h-4 text-sky-500" />
                        </div>
                        <span dir="ltr">{userData?.phone || "غير مسجل"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                           <Mail className="w-4 h-4 text-amber-500" />
                         </div>
                         <span dir="ltr">{userData?.email || "غير مسجل"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Settings & Info */}
                <div className="space-y-6">
                   <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                         <User className="w-5 h-5 text-indigo-500" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                          بيانات الحساب
                      </h2>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                     <div className="flex flex-col gap-1">
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">السنة الدراسية</span>
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userData?.academicYear || "غير محدد"}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">المدرسة/الكلية</span>
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userData?.collegeName || "غير محدد"}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">المحافظة</span>
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userData?.governorate || "غير محدد"}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">رقم ولي الأمر</span>
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-200" dir="ltr">{userData?.parentPhone || "غير محدد"}</span>
                     </div>
                     <div className="flex flex-col gap-1 md:col-span-2">
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">العنوان التفصيلي</span>
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userData?.addressDetails || "غير محدد"}</span>
                     </div>
                   </div>
                </div>

                {/* Courses Statistics */}
                <div className="space-y-8">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center">
                       <Star className="w-5 h-5 text-sky-500" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                        {t('courseStats')}
                    </h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    <CircularProgress 
                      percentage={0} 
                      color="#f43f5e" 
                      title={t('videosWatched')}
                      subtitle1={`0 ${t('videoCount')}`}
                      subtitle2={`${t('from')} 0`}
                      subtitleColor="bg-pink-500"
                    />
                    <CircularProgress 
                      percentage={0} 
                      color="#0ea5e9" 
                      title={t('examsFinished')}
                      subtitle1={`0 ${t('examCount')}`}
                      subtitle2={`${t('from')} 0`}
                      subtitleColor="bg-sky-500"
                    />
                    <CircularProgress 
                      percentage={0} 
                      color="#d946ef" 
                      title={t('averageResults')}
                      subtitle1="0%"
                      subtitle2="المتوسط"
                      subtitleColor="bg-purple-500"
                    />
                  </div>
                </div>

                {/* Platform Statistics */}
                <div className="space-y-8">
                   <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                         <Star className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                          {t('platformStats')}
                      </h2>
                   </div>

                   <div className="flex flex-col gap-4 max-w-xl mx-auto bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <span className="text-slate-700 dark:text-slate-300 font-bold">{t('totalLectureTime')}</span>
                       <div className="px-4 py-1.5 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 rounded-full text-pink-600 dark:text-pink-400 text-sm font-bold">
                         0 {t('minuteCount')}
                       </div>
                     </div>
                     
                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <span className="text-slate-700 dark:text-slate-300 font-bold">{t('totalVideoViews')}</span>
                       <div className="px-4 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-bold">
                         0 {t('timeCount')}
                       </div>
                     </div>

                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <span className="text-slate-700 dark:text-slate-300 font-bold">{t('totalExamOpens')}</span>
                       <div className="px-4 py-1.5 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-full text-sky-600 dark:text-sky-400 text-sm font-bold">
                         0 {t('timeCount')}
                       </div>
                     </div>

                     <div className="flex items-center justify-between pt-2 transition-colors">
                       <span className="text-slate-700 dark:text-slate-300 font-bold">{t('totalExamCompletes')}</span>
                       <div className="px-4 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-bold">
                         0 {t('timeCount')}
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-slate-700">
                   <FileText className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('statusSoon')}</h3>
                <p className="text-sm font-medium">{t('developingMsg')}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
