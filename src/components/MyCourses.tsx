import { BookOpen } from 'lucide-react';
import { CourseData, Page } from '../App';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

interface MyCoursesProps {
  onNavigate: (page: Page, course?: CourseData) => void;
  userSemester: string;
}

export default function MyCourses({ onNavigate, userSemester }: MyCoursesProps) {
  const { t } = useLanguage();

  const [subscribedCourses, setSubscribedCourses] = useState<any[]>([]);

  return (
    <section className="px-4 py-16 max-w-6xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-sky-100 dark:bg-sky-900/30 px-8 py-3 rounded-full mb-6 shadow-sm border border-sky-200 dark:border-sky-800">
           <h1 className="text-sky-800 dark:text-sky-300 font-bold text-2xl flex items-center gap-3">
             <BookOpen className="w-6 h-6" />
             {t('myCourses')} ({userSemester})
           </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{t('myCoursesSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subscribedCourses.map((course, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 dark:text-white">{course.title}</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">{t('completionRate')}</span>
                  <span className="font-bold text-sky-500">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('course-details', course)}
                className="w-full py-3 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-bold rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
              >
                {t('continueLearning')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
