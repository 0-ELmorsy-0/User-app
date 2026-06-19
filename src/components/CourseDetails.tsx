import React, { useState, useEffect } from 'react';
import { Calendar, ChevronUp, ChevronDown, LayoutGrid, MonitorPlay, FileText, ClipboardList } from 'lucide-react';
import { CourseData, Page } from '../App';
import AuthPromptModal from './AuthPromptModal';
import { supabase } from '../lib/supabase';

interface CourseDetailsProps {
  course?: CourseData | null;
  isLoggedIn?: boolean;
  onNavigate?: (page: Page) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-8 h-8 text-sky-500" />,
  LayoutGrid: <LayoutGrid className="w-8 h-8 text-sky-500" />,
  MonitorPlay: <MonitorPlay className="w-8 h-8 text-sky-500" />,
  ClipboardList: <ClipboardList className="w-8 h-8 text-sky-500" />
};

export default function CourseDetails({ course, isLoggedIn, onNavigate }: CourseDetailsProps) {
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [dbSubjects, setDbSubjects] = useState<any[]>([]);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  
  // Exam state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examFinished, setExamFinished] = useState(false);

  useEffect(() => {
    let timer: any;
    if (activeExam && !examFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeExam && !examFinished) {
      setExamFinished(true);
    }
    return () => clearInterval(timer);
  }, [activeExam, timeLeft, examFinished]);

  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setTimeLeft(120 * 60); // 120 minutes dummy
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setExamFinished(false);
  };

  const handleFinishExam = () => {
    setExamFinished(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    async function fetchContent() {
      if (course?.id && import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        try {
          const { data: subsData, error: subsError } = await supabase
            .from('course_subjects')
            .select('*')
            .eq('course_id', course.id);
            
          if (!subsError && subsData && subsData.length > 0) {
            const { data: modsData, error: modsError } = await supabase
              .from('course_modules')
              .select('*');
            
            // Fetch exams, assignments, and schedules
            const { data: examsData } = await supabase
              .from('exams')
              .select('*')
              .eq('course_id', course.id)
              .eq('is_active', true);
              
            const { data: assignmentsData } = await supabase
              .from('assignments')
              .select('*')
              .eq('course_id', course.id)
              .eq('is_active', true);
              
            const { data: schedulesData } = await supabase
              .from('schedules')
              .select('*')
              .eq('course_id', course.id)
              .eq('is_active', true);

            if (!modsError && modsData) {
              const mapped = subsData.map((s: any) => {
                // Regular modules
                const subjectModules = modsData
                  .filter((m: any) => m.subject_id === s.id)
                  .map((m: any) => ({
                    title: m.title,
                    subtitle: m.subtitle,
                    icon: <LayoutGrid className="w-6 h-6 text-sky-500" />,
                    iconOpen: <LayoutGrid className="w-6 h-6 text-white" />,
                    content: m.content,
                    items: Array.isArray(m.items) ? m.items.map((i: any) => ({
                      title: i.title,
                      url: i.url,
                      icon: i.icon === 'MonitorPlay' ? <MonitorPlay className="w-5 h-5 text-sky-500" /> :
                            i.icon === 'FileText' ? <FileText className="w-5 h-5 text-red-500" /> :
                            <ClipboardList className="w-5 h-5 text-amber-500" />,
                      isExam: false
                    })) : []
                  }));

                // Subject Exams and Assignments
                const subjectExams = examsData?.filter((e: any) => e.subject_id === s.id) || [];
                const subjectAssignments = assignmentsData?.filter((a: any) => a.subject_id === s.id) || [];
                
                if (subjectExams.length > 0 || subjectAssignments.length > 0) {
                   const defaultItems: any[] = [];
                   
                   subjectExams.forEach((exam: any) => {
                      defaultItems.push({
                        title: exam.title,
                        url: '#', // Exams have their own modal
                        icon: <ClipboardList className="w-5 h-5 text-amber-500" />,
                        isExam: true,
                        examData: exam // store full exam data
                      });
                   });
                   
                   subjectAssignments.forEach((assignment: any) => {
                      defaultItems.push({
                        title: `واجب: ${assignment.title}`,
                        url: assignment.file_url || '#', // Could be PDF or external link
                        icon: <FileText className="w-5 h-5 text-rose-500" />,
                        isExam: false
                      });
                   });

                   subjectModules.push({
                      title: 'الامتحانات والواجبات',
                      subtitle: 'اختبر نفسك وحل الواجبات',
                      icon: <ClipboardList className="w-6 h-6 text-sky-500" />,
                      iconOpen: <ClipboardList className="w-6 h-6 text-white" />,
                      content: 'جميع الامتحانات والواجبات المتاحة.',
                      items: defaultItems
                   });
                }
                
                // Subject Schedules
                const subjectSchedules = schedulesData?.filter((sch: any) => sch.subject_id === s.id) || [];
                if (subjectSchedules.length > 0) {
                   subjectModules.push({
                      title: 'الجداول ومواعيد الحصص',
                      subtitle: 'جداول المحاضرات والمراجعات',
                      icon: <Calendar className="w-6 h-6 text-sky-500" />,
                      iconOpen: <Calendar className="w-6 h-6 text-white" />,
                      content: 'تعرف على مواعيد الحصص والجداول المتاحة.',
                      items: subjectSchedules.map((sch: any) => ({
                        title: sch.title,
                        url: sch.file_url || '#',
                        icon: <FileText className="w-5 h-5 text-red-500" />,
                        isExam: false
                      }))
                   });
                }

                return {
                  id: s.id,
                  name: s.name,
                  icon: iconMap[s.icon_name || 'FileText'] || iconMap.FileText,
                  modules: subjectModules
                };
              });
              setDbSubjects(mapped);
            }
          }
        } catch (err) {
          console.error("Failed to fetch course content", err);
        }
      }
    }
    fetchContent();
  }, [course]);

  const staticSubjects = [
    {
      id: 1,
      name: 'اللغة العربية',
      icon: <FileText className="w-8 h-8 text-sky-500" />,
      modules: [
        {
          title: 'الوحدة الأولى: المفاهيم الأساسية',
          subtitle: 'مقدمة شاملة للتعرف على المادة ومصطلحاتها',
          icon: <LayoutGrid className="w-6 h-6 text-sky-500" />,
          iconOpen: <LayoutGrid className="w-6 h-6 text-white" />,
          content: 'في هذه الوحدة سنبدأ بوضع حجر الأساس لفهم المادة العلمية وتناول أبرز المفاهيم التي سنعتمد عليها في باقي الكورس.',
          items: [
            { title: 'الدرس الأول: مقدمة عامة', icon: <MonitorPlay className="w-5 h-5 text-sky-500" /> },
            { title: 'ملخص الدرس الأول (PDF)', icon: <FileText className="w-5 h-5 text-red-500" /> },
            { title: 'اختبار تجريبي على الدرس الأول', icon: <ClipboardList className="w-5 h-5 text-amber-500" /> },
          ]
        },
        {
          title: 'الوحدة الثانية: التطبيقات العملية',
          subtitle: 'تطبيق عملي للمفاهيم وحل المسائل',
          icon: <LayoutGrid className="w-6 h-6 text-sky-500" />,
          iconOpen: <LayoutGrid className="w-6 h-6 text-white" />,
          content: 'سنتطرق هنا إلى الجانب التطبيقي وكيفية استخدام المفاهيم الأساسية في حل نماذج وتدريبات حقيقية.',
          items: [
            { title: 'الدرس الثاني: طرق الحل المتقدمة', icon: <MonitorPlay className="w-5 h-5 text-sky-500" /> },
            { title: 'ملف التدريبات العملي (PDF)', icon: <FileText className="w-5 h-5 text-red-500" /> },
            { title: 'اختبار الوحدة الثانية', icon: <ClipboardList className="w-5 h-5 text-amber-500" /> },
          ]
        },
        {
          title: 'المراجعات الشاملة',
          subtitle: 'مراجعة نهائية لجميع أجزاء المقرر',
          icon: <LayoutGrid className="w-6 h-6 text-sky-500" />,
          iconOpen: <LayoutGrid className="w-6 h-6 text-white" />,
          content: 'خلاصة القول وأهم النقاط التي ستحتاجها لاجتياز الامتحان بنجاح مع حل نماذج امتحانات سابقة.',
          items: [
            { title: 'فيديو المراجعة النهائية', icon: <MonitorPlay className="w-5 h-5 text-sky-500" /> },
            { title: 'بنك الأسئلة المتوقعة (PDF)', icon: <FileText className="w-5 h-5 text-red-500" /> },
            { title: 'الامتحان الشامل', icon: <ClipboardList className="w-5 h-5 text-amber-500" /> },
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'الرياضيات',
      icon: <LayoutGrid className="w-8 h-8 text-sky-500" />,
      modules: [
        {
          title: 'الوحدة الأولى: الجبر والهندسة',
          subtitle: 'مقدمة للرياضيات المتقدمة',
          icon: <LayoutGrid className="w-6 h-6 text-sky-500" />,
          iconOpen: <LayoutGrid className="w-6 h-6 text-white" />,
          content: 'خلاصة القواعد الرياضية والمسائل الهامة.',
          items: [
            { title: 'الدرس الأول: الجبر', icon: <MonitorPlay className="w-5 h-5 text-sky-500" /> },
            { title: 'ملف القوانين (PDF)', icon: <FileText className="w-5 h-5 text-red-500" /> },
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'العلوم / الفيزياء',
      icon: <MonitorPlay className="w-8 h-8 text-sky-500" />,
      modules: [
        {
          title: 'الوحدة الأولى: الحركة والقوة',
          subtitle: 'مقدمة في الفيزياء',
          icon: <LayoutGrid className="w-6 h-6 text-sky-500" />,
          iconOpen: <LayoutGrid className="w-6 h-6 text-white" />,
          content: 'أساسيات الحركة والقوة.',
          items: [
            { title: 'الدرس الأول', icon: <MonitorPlay className="w-5 h-5 text-sky-500" /> },
          ]
        }
      ]
    }
  ];

  const subjects = dbSubjects.length > 0 ? dbSubjects : staticSubjects;

  return (
    <div className="bg-slate-50 dark:bg-[#0b121c] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-sky-500 relative pb-32 pt-16 rounded-bl-[4rem]">
        <div className="absolute inset-0 bg-blue-600/30 dark:bg-[#0b121c]/50 rounded-bl-[4rem]"></div>
        
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-4">{course?.title || 'تفاصيل الكورس'}</h1>
              <p className="mb-4 text-sky-100">
                في هذا الكورس ستتعلم الكثير:
              </p>
              <ul className="space-y-2 mb-8">
                {course?.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">👨‍🏫 {feature}</li>
                )) || (
                  <li className="flex items-center gap-2">لا توجد تفاصيل إضافية لهذا الكورس.</li>
                )}
              </ul>

              <div className="flex flex-wrap gap-4 text-xs md:text-sm font-medium">
                {course?.createdAt && (
                  <div className="flex items-center gap-2 bg-[#d97757] text-white px-4 py-2 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ إنشاء الكورس: {new Date(course.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                )}
                {course?.endDate && (
                  <div className="flex items-center gap-2 bg-[#a11c34] text-white px-4 py-2 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ انتهاء الكورس: {new Date(course.endDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                )}
                {(!course?.createdAt && !course?.endDate) && (
                  <div className="flex items-center gap-2 bg-[#d97757] text-white px-4 py-2 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ إنشاء الكورس : قريباً</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar space reservation */}
            <div className="w-full lg:w-[350px]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-20 flex flex-col lg:flex-row gap-8 items-start pb-16">
        <div className="flex-1 w-full space-y-6 mt-8">
          {activeExam && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 relative mb-12">
                <div className="absolute top-0 right-0 left-0 h-2 bg-[#fbb33d] rounded-t-2xl"></div>
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-[#ee4e5f] text-white px-6 py-2 rounded-xl font-bold mb-6 flex flex-col items-center gap-1 shadow-md">
                     <span className="text-sm border-b border-white/30 pb-1 w-full text-center">باقي من الزمن :</span>
                     <span className="text-xl tracking-wider">{formatTime(timeLeft)}</span>
                  </div>
                  
                  <div className="flex flex-col w-full max-w-sm gap-3">
                     <button onClick={() => setExamFinished(true)} className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white py-3 rounded-xl font-bold transition-colors">
                        إنهاء الاختبار
                     </button>
                     <button onClick={() => setActiveExam(null)} className="w-full bg-[#fbb33d] hover:bg-[#e6a235] text-white py-3 rounded-xl font-bold transition-colors">
                        استكمال الاختبار لاحقاً
                     </button>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 w-full max-w-sm mt-6 p-4 rounded-xl text-sm border border-slate-100 dark:border-slate-700/50 space-y-3">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>إجمالي درجات الامتحان :</span>
                      <span>45</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>عدد الأسئلة :</span>
                      <span>45</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>عدد الأسئلة التي تم فتحها :</span>
                      <span className="bg-[#fbb33d] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md">1</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>عدد الأسئلة غير المحلولة :</span>
                      <span className="bg-[#ee4e5f] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md">0</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>عدد الأسئلة المحلولة :</span>
                      <span className="bg-[#4285f4] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md">1</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-bold mb-3 border-r-2 border-[#fbb33d] pr-2">السؤال الحالي : {currentQuestionIdx + 1}</span>
                    
                    <div className="grid grid-cols-8 md:grid-cols-10 gap-2 place-content-center">
                       {Array.from({length: 45}).map((_, i) => (
                         <button 
                           key={i}
                           onClick={() => setCurrentQuestionIdx(i)}
                           className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white transition-all
                            ${i === currentQuestionIdx ? 'bg-[#ee4e5f] scale-110 shadow-lg' : selectedAnswers[i] ? 'bg-[#4285f4]' : 'bg-[#9ba9bd] hover:bg-[#8394ab]'}
                           `}
                         >
                           {i + 1}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                      className="bg-[#24d0b1] hover:bg-[#1db89b] text-white px-8 py-2 rounded-xl font-bold transition-colors shadow-sm"
                    >
                      التالي
                    </button>
                    <button 
                      onClick={() => setCurrentQuestionIdx(Math.min(44, currentQuestionIdx + 1))}
                      className="bg-[#24d0b1] hover:bg-[#1db89b] text-white px-8 py-2 rounded-xl font-bold transition-colors shadow-sm"
                    >
                      السابق
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-10 relative mt-8">
                  <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-[#fbb33d] text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                    درجة واحدة
                  </div>

                  {examFinished ? (
                    <div className="text-center py-10">
                      <h3 className="text-2xl font-bold text-[#ee4e5f] mb-4">تم إنهاء الاختبار</h3>
                      <button onClick={() => setActiveExam(null)} className="px-6 py-2 bg-[#4285f4] text-white rounded-lg hover:bg-blue-600">العودة لمحتوى الكورس</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed mt-4">
                        في دراسة علمية تم قياس كل من مستوى هرمون الأنسولين في الدم ومستقبلاته في الأنسجة الهدف ،
                        في حالات مختلفة والشكل أمامك يبين النتائج التي تم الحصول عليها ، أي من الأفراد يعاني من
                        البول السكري رغم سلامة خلايا بيتا بالبنكرياس ؟
                      </p>

                      <div className="flex flex-col items-center mb-8">
                         <div className="w-full max-w-lg bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 overflow-hidden relative group">
                            <img src={activeExam?.imageUrl || "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop"} alt="Question Diagram" className="w-full object-contain rounded-lg mix-blend-multiply dark:mix-blend-normal" />
                            <div className="absolute inset-x-0 bottom-0 top-0 hidden group-hover:flex items-center justify-center bg-black/50 transition-all text-white font-bold cursor-pointer">
                                انقر لتكبير الصورة
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col gap-3 max-w-sm mr-auto ml-auto md:ml-0 md:mr-auto mt-8">
                        {[1, 2, 3, 4].map((opt) => (
                           <label key={opt} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                             <input 
                               type="radio" 
                               name={`q-${currentQuestionIdx}`} 
                               checked={selectedAnswers[currentQuestionIdx] === opt}
                               onChange={() => setSelectedAnswers(prev => ({...prev, [currentQuestionIdx]: opt}))}
                               className="w-5 h-5 text-[#4285f4] focus:ring-[#4285f4] border-gray-300"
                             />
                             <span className="text-slate-700 dark:text-slate-300 font-bold">({opt})</span>
                           </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#151b23] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#202936] mb-6 flex items-center justify-center relative">
            <div className="absolute right-0 left-0 top-1/2 h-px bg-slate-200 dark:bg-slate-700 -z-10"></div>
            <div className="bg-white dark:bg-[#151b23] px-6 py-2">
              <h2 className="text-2xl md:text-3xl font-black text-[#ee4e5f]">
                محتوى <span className="text-slate-800 dark:text-white">الكورس</span>
              </h2>
            </div>
          </div>
          
          {/* Course Content Header */}
          <div className="bg-white dark:bg-[#151b23] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#202936] flex items-center justify-between">
             <div className="flex items-center gap-3">
               <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white px-4">
                 {selectedSubject ? (
                   <>
                     محتوى <span className="text-red-500">{subjects.find(s => s.id === selectedSubject)?.name}</span>
                   </>
                 ) : (
                   <>
                     مواد <span className="text-red-500">الكورس</span>
                   </>
                 )}
               </h2>
             </div>
             {selectedSubject && (
               <button 
                 onClick={() => {
                   setSelectedSubject(null);
                   setOpenModule(null);
                 }} 
                 className="text-sm md:text-base text-slate-500 hover:text-sky-500 font-medium px-4 transition-colors"
               >
                 الرجوع للمواد &larr;
               </button>
             )}
          </div>

          <div className="space-y-4">
            {!selectedSubject ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setOpenModule(0);
                    }}
                    className="flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#151b23] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#202936] hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md transition-all group"
                  >
                    <div className="p-4 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-full group-hover:scale-110 transition-transform">
                      {subject.icon}
                    </div>
                    <span className="font-bold text-lg text-slate-800 dark:text-gray-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {subject.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              subjects.find(s => s.id === selectedSubject)?.modules.map((module, idx) => (
                 <div key={idx} className={`border rounded-xl overflow-hidden transition-all duration-300 ${openModule === idx ? 'border-[#a11c34] shadow-lg shadow-red-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                   <button 
                    onClick={() => setOpenModule(openModule === idx ? null : idx)}
                    className={`w-full flex items-center justify-between p-4 md:p-6 transition-all duration-300 ${
                      openModule === idx 
                        ? 'bg-[#a11c34] text-white' 
                        : 'bg-white dark:bg-[#151b23] hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg transition-colors ${openModule === idx ? 'bg-white/10' : 'bg-red-50 dark:bg-[#a11c34]/10'}`}>
                         {openModule === idx ? module.iconOpen : module.icon}
                       </div>
                       <div className="text-right transition-colors">
                         <h3 className={`font-bold text-lg md:text-xl ${openModule === idx ? 'text-white' : 'text-slate-800 dark:text-gray-200'}`}>{module.title}</h3>
                         {module.subtitle && (
                           <p className={`text-sm mt-1 ${openModule === idx ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>{module.subtitle}</p>
                         )}
                       </div>
                     </div>
                     {openModule === idx ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronUp className="w-6 h-6 text-slate-400 dark:text-slate-500" />}
                   </button>

                   {openModule === idx && (
                     <div className="p-4 md:p-6 bg-slate-50 dark:bg-[#1f2937]/30 border-t border-slate-200 dark:border-slate-800 transition-all duration-300">
                       {module.content && (
                         <div className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6 font-medium">
                           {module.content}
                         </div>
                       )}
                       
                       {isLoggedIn && module.items && module.items.length > 0 && (
                         <div className="space-y-3">
                           {module.items.map((item: any, i: number) => {
                             const content = (
                               <>
                                 <div className="flex items-center gap-3">
                                   {item.icon}
                                   <span className="font-bold text-slate-700 dark:text-gray-200 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{item.title}</span>
                                 </div>
                                 <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                               </>
                             );

                             if (item.url && item.url !== '#') {
                               return (
                                 <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full text-left bg-white dark:bg-[#151b23] p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 transition-colors cursor-pointer group">
                                   {content}
                                 </a>
                               );
                             }

                             return (
                               <div key={i} onClick={(e) => {
                                  e.preventDefault();
                                  if (item.isExam || item.title.includes('اختبار') || item.title.includes('امتحان')) {
                                    handleStartExam(item.examData || item);
                                  }
                               }} className="flex items-center justify-between bg-white dark:bg-[#151b23] p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 transition-colors cursor-pointer group">
                                 {content}
                               </div>
                             );
                           })}
                         </div>
                       )}

                       {!isLoggedIn && module.items && module.items.length > 0 && (
                         <div className="text-center py-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg text-sky-600 dark:text-sky-400 font-medium text-sm">
                           قم بالاشتراك في الكورس لعرض المحتوى
                         </div>
                       )}
                     </div>
                   )}
                 </div>
               ))
            )}
             </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] shrink-0 sticky top-24 -mt-8 lg:-mt-56">
          <div className="bg-white dark:bg-[#151b23] rounded-2xl shadow-xl border border-gray-100 dark:border-[#202936] overflow-hidden">
            <div className="relative p-2 pb-0">
              <img 
                src={course?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"} 
                alt={course?.title || "كورس"} 
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute top-6 right-6 lg:-bottom-4 lg:top-auto bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white dark:border-[#151b23] z-10 transition-transform hover:scale-105">
                {course?.title || "معلومات الكورس"}
              </div>
            </div>
            
            <div className="p-6 pt-10">
              <div className="flex justify-center mb-6">
                <div className="bg-slate-100 dark:bg-[#1f2937] px-6 py-2 rounded-full inline-flex items-center gap-2">
                  <div className="text-3xl font-black text-sky-500">{course?.price || "مجانًا"}</div>
                </div>
              </div>
              
              <button 
                onClick={() => !isLoggedIn ? setShowAuthModal(true) : undefined}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-colors"
              >
                اشترك الآن!
              </button>
            </div>
          </div>
        </div>
        
      </div>
      <AuthPromptModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onNavigate={onNavigate} 
      />
    </div>
  );
}
