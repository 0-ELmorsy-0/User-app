import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle, GraduationCap } from 'lucide-react';
import { Page } from '../App';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import AuthPromptModal from './AuthPromptModal';
import { supabase } from '../lib/supabase';

interface CoursesProps {
  onNavigate?: (page: Page, course?: any) => void;
  isLoggedIn?: boolean;
  userSemester?: string;
}


export default function Courses({ onNavigate, isLoggedIn, userSemester }: CoursesProps) {
  const { t } = useLanguage();
  const [semestersList, setSemestersList] = useState<string[]>([]);
  const [selectedSemester, setSelectedSemester] = useState(userSemester || "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFreeIndex, setActiveFreeIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [dbFreeCourses, setDbFreeCourses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        let allSemesters = new Set<string>();

        try {
          const { data, error } = await supabase.from('paycourses').select('*');
          if (error) {
            console.error("Error fetching from supabase:", error);
          } else if (data && data.length > 0) {
            const mappedCourses = data.map((d: any) => {
              if (d.semester) allSemesters.add(d.semester.trim());
              return {
                image: d.image_url || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
                title: d.title,
                features: Array.isArray(d.features) ? d.features : [d.description || ""],
                price: d.price ? `${d.price} ج.م` : "250 ج.م",
                semester: d.semester ? d.semester.trim() : "",
                id: d.id,
                createdAt: d.created_at,
                endDate: d.end_date
              };
            });
            setDbCourses(mappedCourses);
          }
        } catch (err) {
          console.error("Failed to fetch paycourses", err);
        }

        try {
          const { data: freeData, error: freeError } = await supabase.from('freecourses').select('*');
          if (freeError) {
            console.error("Error fetching free courses from supabase:", freeError);
          } else if (freeData && freeData.length > 0) {
            const mappedFreeCourses = freeData.map((d: any) => {
              if (d.semester) allSemesters.add(d.semester.trim());
              return {
                image: d.image_url || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
                title: d.title,
                features: Array.isArray(d.features) ? d.features : [d.description || ""],
                semester: d.semester ? d.semester.trim() : "",
                id: d.id,
                createdAt: d.created_at,
                endDate: d.end_date
              };
            });
            setDbFreeCourses(mappedFreeCourses);
          }
        } catch (err) {
          console.error("Failed to fetch freecourses", err);
        }

        const uniqueSemesters = Array.from(allSemesters);
        if (uniqueSemesters.length > 0) {
          setSemestersList(uniqueSemesters);
          if (!userSemester) {
             setSelectedSemester(uniqueSemesters[0]);
          }
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userSemester && semestersList.includes(userSemester)) {
      setSelectedSemester(userSemester);
    }
  }, [isLoggedIn, userSemester]);

  const courses = dbCourses.filter(c => c.semester === selectedSemester);
  const freeCourses = dbFreeCourses.filter(c => c.semester === selectedSemester);

  useEffect(() => {
    setActiveIndex(0);
    setActiveFreeIndex(0);
  }, [selectedSemester]);

  useEffect(() => {
    if (courses.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % courses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [courses.length]);

  const validActiveIndex = activeIndex < courses.length ? activeIndex : 0;
  const course = courses[validActiveIndex];

  const validActiveFreeIndex = activeFreeIndex < freeCourses.length ? activeFreeIndex : 0;
  const freeCourse = freeCourses[validActiveFreeIndex];

  return (
    <section className="px-4 py-16 bg-white dark:bg-[#0b121c] relative flex flex-col gap-12">
      {/* Semester Selector */}
      {!isLoggedIn && (
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="flex flex-col items-center mb-8">
             <div className="bg-sky-50 dark:bg-sky-900/20 p-2 rounded-2xl flex items-center justify-center gap-2 mb-4">
               <GraduationCap className="w-6 h-6 text-sky-500" />
               <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300">{t('chooseAcademicYear')}</h2>
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">{t('coursesCustomized')}</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {semestersList.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  selectedSemester === sem 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-24">
        {/* Premium Courses */}
        <div>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-sky-100 dark:bg-sky-900/30 px-8 py-3 rounded-full mb-8 shadow-sm border border-sky-200 dark:border-sky-800 relative inline-block">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded-full shadow-inner border border-gray-300 dark:border-slate-600"></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-400 dark:bg-slate-500"></div>
              <h3 className="text-sky-800 dark:text-sky-300 font-bold text-lg md:text-xl">{t('latestCourses')} ({selectedSemester})</h3>
            </div>
          </div>

          {courses.length === 0 && (
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl max-w-md mx-auto">
              <p className="text-slate-500 dark:text-slate-400 font-medium pb-2">{t('noCoursesAvailable')}</p>
            </div>
          )}

          {courses.length > 0 && course && (
            <div className="relative max-w-xl w-full px-12 md:px-16 mx-auto flex items-center justify-center">
              <button 
                onClick={() => setActiveIndex((prev) => (prev - 1 + courses.length) % courses.length)}
                className="absolute right-0 md:right-2 z-10 p-2 md:p-3 bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 rounded-full text-slate-500 hover:text-sky-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="w-full bg-white dark:bg-slate-800/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 dark:border-slate-700 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={course.image}
                    alt={course.title}
                    className="w-full h-56 object-cover transition-all duration-500"
                  />
                  <div className="absolute -bottom-4 right-6 bg-sky-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white">
                    {course.title}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 pt-10">
                  <ul className="space-y-4 mb-8 min-h-[140px]">
                    {course.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => !isLoggedIn ? setShowAuthModal(true) : undefined}
                      className="flex-1 bg-sky-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-600 transition-colors text-sm"
                    >
                      {t('subscribeBtnCourses')}
                    </button>
                    <button 
                      onClick={() => onNavigate && onNavigate('course-details', course)}
                      className="flex-1 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3.5 rounded-xl font-bold hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      {t('viewCourseDetails')}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl">
                    <span className="font-bold text-slate-600 dark:text-slate-400">{t('price')}:</span>
                    <span className="text-xl font-black text-sky-600">{course.price}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveIndex((prev) => (prev + 1) % courses.length)}
                className="absolute left-0 md:left-2 z-10 p-2 md:p-3 bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 rounded-full text-slate-500 hover:text-sky-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          )}

          {courses.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {courses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    activeIndex === idx 
                      ? 'bg-sky-500' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Free Courses */}
        <div>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-pink-100 dark:bg-pink-900/30 px-8 py-3 rounded-full mb-8 shadow-sm border border-pink-200 dark:border-pink-800 relative inline-block">
              <h3 className="text-pink-600 dark:text-pink-400 font-bold text-lg md:text-xl flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                الكورسات المجانية ({selectedSemester})
              </h3>
            </div>
          </div>

          {freeCourses.length === 0 && (
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl max-w-md mx-auto">
              <p className="text-slate-500 dark:text-slate-400 font-medium pb-2">لا توجد كورسات مجانية متاحة حالياً لهذا الترم.</p>
            </div>
          )}

          {freeCourses.length === 0 && (
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl max-w-md mx-auto">
              <p className="text-slate-500 dark:text-slate-400 font-medium pb-2">{t('noCoursesAvailable')}</p>
            </div>
          )}

          {freeCourses.length > 0 && freeCourse && (
            <div className="relative max-w-xl w-full px-12 md:px-16 mx-auto flex items-center justify-center">
              <button 
                onClick={() => setActiveFreeIndex((prev) => (prev - 1 + freeCourses.length) % freeCourses.length)}
                className="absolute right-0 md:right-2 z-10 p-2 md:p-3 bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 rounded-full text-slate-500 hover:text-pink-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="w-full bg-white dark:bg-slate-800/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 dark:border-slate-700 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={freeCourse.image}
                    alt={freeCourse.title}
                    className="w-full h-48 object-cover transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {t('free')}
                  </div>
                  <div className="absolute -bottom-4 right-6 bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white">
                    {freeCourse.title}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 pt-10">
                  <ul className="space-y-4 mb-8 min-h-[140px]">
                    {freeCourse.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => onNavigate && onNavigate('course-details', { ...freeCourse, price: t('free') })}
                    className="w-full bg-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5 md:w-6 md:h-6" />
                    {t('playLectureBtn')}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setActiveFreeIndex((prev) => (prev + 1) % freeCourses.length)}
                className="absolute left-0 md:left-2 z-10 p-2 md:p-3 bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 rounded-full text-slate-500 hover:text-pink-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          )}

          {freeCourses.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {freeCourses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFreeIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    activeFreeIndex === idx 
                      ? 'bg-pink-500' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <AuthPromptModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onNavigate={onNavigate} 
      />
    </section>
  );
}
