import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import Features from './components/Features';
import Grades from './components/Grades';
import TopStudents from './components/TopStudents';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import CourseDetails from './components/CourseDetails';
import MyCourses from './components/MyCourses';
import Profile from './components/Profile';
import AlertBanner from './components/AlertBanner';

import { Toaster } from 'react-hot-toast';
import SplashScreen from './components/SplashScreen';

export type CourseData = {
  id?: string | number;
  title: string;
  image: string;
  price?: string;
  features: string[];
  createdAt?: string;
  endDate?: string;
};

export type Page = 'home' | 'login' | 'register' | 'course-details' | 'my-courses' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSemester, setUserSemester] = useState<string>("Semester 1");
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setFadeSplash(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 500); // Wait for fade out animation
    }, 2000); // 2 seconds display
    
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: Page, course?: CourseData) => {
    if (course) {
      setSelectedCourse(course);
    }
    setCurrentPage(page);
  };

  const handleAuth = (semester: string = "Semester 1") => {
    setIsLoggedIn(true);
    setUserSemester(semester);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-500`}>
      {showSplash && <SplashScreen isFadingOut={fadeSplash} />}
      <Toaster position="top-center" />
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isDark={isDark} 
        setIsDark={setIsDark} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
      />
      
      {currentPage === 'home' && (
        <div className="flex-1 flex flex-col pt-16">
          <AlertBanner userSemester={userSemester} isLoggedIn={isLoggedIn} />
          <Hero onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />
          <Courses onNavigate={handleNavigate} isLoggedIn={isLoggedIn} userSemester={userSemester} />
          {!isLoggedIn && (
            <>
              <Features />
              <Grades />
            </>
          )}
          <TopStudents />
        </div>
      )}

      {currentPage === 'course-details' && (
        <div className="flex-1 flex flex-col pt-16">
          <CourseDetails course={selectedCourse} isLoggedIn={isLoggedIn} onNavigate={handleNavigate} />
        </div>
      )}

      {currentPage === 'my-courses' && (
        <div className="flex-1 flex flex-col pt-16">
          <MyCourses onNavigate={handleNavigate} userSemester={userSemester} />
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="flex-1 flex flex-col pt-16">
          <Profile />
        </div>
      )}

      {currentPage === 'login' && (
        <div className="flex-1 flex flex-col pt-24 pb-12 px-4 max-w-[1400px] w-full mx-auto justify-center">
          <Login onNavigate={handleNavigate} onAuth={handleAuth} />
        </div>
      )}
      
      {currentPage === 'register' && (
        <div className="flex-1 flex flex-col pt-24 pb-12 px-4 max-w-[1400px] w-full mx-auto justify-center">
          <Register onNavigate={handleNavigate} onAuth={handleAuth} />
        </div>
      )}

      <Footer />
    </div>
  );
}
