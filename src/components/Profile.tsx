import React, { useState } from 'react';
import { User, Phone, Mail, Star, PlayCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useLanguage();

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

  const CircularProgress = ({ percentage, color, title, subtitle1, subtitle2, subtitleColor }: any) => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800/50" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color} 
            strokeWidth="10" 
            strokeDasharray={`${2 * Math.PI * 45}`} 
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
             className="transition-all duration-1000 ease-out" 
             strokeLinecap="round" 
           />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-800 dark:text-white">
          <span dir="ltr">% {percentage}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-slate-700 dark:text-white font-medium text-sm text-center">{title}</h3>
        {subtitle1 && subtitle2 && (
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${subtitleColor}`}>{subtitle1}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-white bg-slate-100 dark:bg-[#1a2536] border border-slate-200 dark:border-slate-700`}>{subtitle2}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans pb-20 transition-colors">
      {/* Top Banner Gradient */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-90 rounded-b-[40px] md:rounded-b-[80px] absolute top-0 left-0"></div>

      <div className="relative pt-24 md:pt-32 max-w-6xl mx-auto px-4 z-10">
        
        {/* Main Profile Container */}
        <div className="bg-white dark:bg-[#131d2e] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mt-8 flex flex-col md:flex-row transition-colors">
          
          {/* Top Mobile Heading / Desktop hidden */}
          <div className="md:hidden flex justify-center -mt-5 mb-4 relative z-20">
            <div className="bg-blue-500 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              <User className="w-5 h-5" />
              <span>ملف المستخدم</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 md:border-l border-slate-200 dark:border-slate-700 order-2 md:order-1 hidden md:block transition-colors">
            <div className="flex flex-col p-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`text-right px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === link.id 
                    ? 'bg-blue-500 text-white rounded-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a2536] rounded-md border-b-0 border-slate-200 dark:border-slate-800'
                  } ${activeTab !== link.id ? 'border-b border-slate-200 dark:border-slate-800 last:border-0' : ''}`}
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
              <div className="bg-blue-500 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                <User className="w-5 h-5" />
                <span>ملف المستخدم</span>
              </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'profile' ? (
              <>
                {/* User Info Header */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-200 dark:border-slate-700 pb-8 transition-colors">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">محمد صبحي</h2>
                    <div className="flex flex-col gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      <div className="flex items-center justify-start gap-2 text-right">
                        <Phone className="w-4 h-4 text-sky-500" />
                        <span dir="ltr">01023533560</span>
                      </div>
                      <div className="flex items-center justify-start gap-2 text-right">
                         <Mail className="w-4 h-4 text-yellow-500" />
                         <span dir="ltr">sameh-ahmed.com@1023533560</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 dark:bg-[#0b121c] border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <User className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                  </div>
                </div>

                {/* Courses Statistics */}
                <div className="mb-14">
                  <div className="flex items-center justify-center gap-3 mb-10">
                    <Star className="w-8 h-8 text-sky-600" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {t('courseStats')}
                    </h2>
                    <Star className="w-8 h-8 text-sky-600" />
                  </div>

                  <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20">
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
                      subtitle1=""
                      subtitle2=""
                      subtitleColor=""
                    />
                  </div>
                </div>

                {/* Platform Statistics */}
                <div>
                   <div className="flex items-center justify-center gap-3 mb-10">
                      <Star className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                          {t('platformStats')}
                      </h2>
                      <Star className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                   </div>

                   <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <div className="px-4 py-1.5 bg-pink-50 dark:bg-[#1a2536] border border-pink-200 dark:border-pink-500/50 rounded-full text-pink-600 dark:text-pink-500 text-sm font-bold">
                         0 {t('minuteCount')}
                       </div>
                       <span className="text-slate-700 dark:text-slate-300 font-medium">{t('totalLectureTime')}</span>
                     </div>
                     
                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <div className="px-4 py-1.5 bg-yellow-50 dark:bg-[#1a2536] border border-yellow-200 dark:border-yellow-500/50 rounded-full text-yellow-600 dark:text-yellow-500 text-sm font-bold">
                         0 {t('timeCount')}
                       </div>
                       <span className="text-slate-700 dark:text-slate-300 font-medium">{t('totalVideoViews')}</span>
                     </div>

                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <div className="px-4 py-1.5 bg-sky-50 dark:bg-[#1a2536] border border-sky-200 dark:border-sky-500/50 rounded-full text-sky-600 dark:text-sky-500 text-sm font-bold">
                         0 {t('timeCount')}
                       </div>
                       <span className="text-slate-700 dark:text-slate-300 font-medium">{t('totalExamOpens')}</span>
                     </div>

                     <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
                       <div className="px-4 py-1.5 bg-purple-50 dark:bg-[#1a2536] border border-purple-200 dark:border-purple-500/50 rounded-full text-purple-600 dark:text-purple-500 text-sm font-bold">
                         0 {t('timeCount')}
                       </div>
                       <span className="text-slate-700 dark:text-slate-300 font-medium">{t('totalExamCompletes')}</span>
                     </div>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">{t('statusSoon')}</h3>
                <p>{t('developingMsg')}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
