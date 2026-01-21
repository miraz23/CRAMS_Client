import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/shared/Header/Header";
import Footer from "../../Components/shared/Footer/Footer";
import {
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiBell,
  FiArrowRight,
  FiTrendingUp,
  FiAlertCircle,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Reusable animation component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// FAQ Component
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I register for courses?",
      answer: "To register for courses, log in to your student account, navigate to the Course Selection page, browse available courses, add them to your cart, and submit for advisor approval. Once approved, your registration will be complete."
    },
    {
      question: "What happens if my advisor rejects my course selection?",
      answer: "If your advisor rejects your course selection, you'll receive a notification with feedback explaining the reason. You can then modify your course selection based on the feedback and resubmit for approval."
    },
    {
      question: "How does the waitlist system work?",
      answer: "When a course section reaches full capacity, you can join the waitlist. If a seat becomes available, students are automatically enrolled from the waitlist in the order they joined. You'll receive an email notification if you're enrolled from the waitlist."
    },
    {
      question: "Can I drop or add courses after registration?",
      answer: "Yes, you can add or drop courses during the add/drop period specified in the academic calendar. Changes made during this period may require advisor approval depending on your program requirements."
    },
    {
      question: "How do I know if there are schedule conflicts?",
      answer: "CRAMS automatically detects schedule conflicts when you add courses to your cart. The system will alert you immediately if there are time conflicts between selected courses, allowing you to adjust your selection before submission."
    },
    {
      question: "What are the prerequisites and how are they checked?",
      answer: "Prerequisites are courses you must complete before enrolling in certain courses. CRAMS automatically checks if you meet the prerequisites based on your academic record. If prerequisites aren't met, the system will prevent you from adding the course."
    },
    {
      question: "How do I request extra credit hours?",
      answer: "If you need to register for more credit hours than the standard limit, you can submit an extra credit request through the student dashboard. Your advisor will review your request and approve or deny it based on your academic standing."
    },
    {
      question: "How can I contact my academic advisor?",
      answer: "You can contact your advisor through the 'Contact Advisor' feature in your student dashboard. This allows you to send messages directly to your advisor and schedule appointments when needed."
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg lg:w-2/5 md:w-2/3 mx-auto">
            Find answers to common questions about CRAMS
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-8">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <FiChevronDown className="w-5 h-5 text-gray-600" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Notice Slider Component
const NoticeSlider = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const notices = [
    {
      icon: FiCalendar,
      type: "Deadline",
      date: "January 31, 2026",
      title: "Spring 2026 Registration",
      description: "Last day to register for Spring 2026 semester courses. Ensure all prerequisites are met.",
      color: "blue",
    },
    {
      icon: FiAlertCircle,
      type: "Important",
      date: "February 10, 2026",
      title: "Add/Drop Period Ends",
      description: "Final opportunity to add or drop courses without academic penalty for Spring 2026.",
      color: "orange",
    },
    {
      icon: FiInfo,
      type: "Announcement",
      date: "February 1, 2026",
      title: "System Maintenance",
      description: "CRAMS will undergo scheduled maintenance on Feb 1, 2:00 AM - 4:00 AM. Plan accordingly.",
      color: "green",
    },
    {
      icon: FiBell,
      type: "Reminder",
      date: "January 25, 2026",
      title: "Financial Aid Deadline",
      description: "Submit your financial aid applications by this date to ensure timely processing for Spring 2026.",
      color: "purple",
    },
    {
      icon: FiCalendar,
      type: "Deadline",
      date: "March 1, 2026",
      title: "Graduation Application",
      description: "Students planning to graduate in Spring 2026 must submit their graduation application by this date.",
      color: "blue",
    },
    {
      icon: FiInfo,
      type: "Announcement",
      date: "February 15, 2026",
      title: "Career Fair 2026",
      description: "Annual Career Fair will be held on campus. Meet with top employers and explore internship opportunities.",
      color: "green",
    },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(notices.length / itemsPerPage);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + newDirection;
      if (nextPage < 0) nextPage = totalPages - 1;
      if (nextPage >= totalPages) nextPage = 0;
      return nextPage;
    });
  };

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentPage]);

  const startIndex = currentPage * itemsPerPage;
  const currentNotices = notices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="notices" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Important Notices
          </h2>
          <p className="text-gray-600 text-lg lg:w-2/5 md:w-2/3 mx-auto">
            Stay informed about registration deadlines, system updates, and important announcements
          </p>
        </AnimatedSection>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Navigation Buttons */}
          <button
            onClick={() => paginate(-1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors items-center justify-center"
            aria-label="Previous notices"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors items-center justify-center"
            aria-label="Next notices"
          >
            <FiChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentNotices.map((notice, index) => (
                  <div
                    key={startIndex + index}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${
                        notice.color === "blue" ? "bg-blue-100" :
                        notice.color === "orange" ? "bg-orange-100" :
                        notice.color === "purple" ? "bg-purple-100" :
                        "bg-green-100"
                      }`}>
                        <notice.icon className={`w-6 h-6 ${
                          notice.color === "blue" ? "text-blue-600" :
                          notice.color === "orange" ? "text-orange-600" :
                          notice.color === "purple" ? "text-purple-600" :
                          "text-green-600"
                        }`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${
                          notice.color === "blue" ? "text-blue-600" :
                          notice.color === "orange" ? "text-orange-600" :
                          notice.color === "purple" ? "text-purple-600" :
                          "text-green-600"
                        }`}>{notice.type}</p>
                        <p className="text-xs text-gray-500">{notice.date}</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{notice.title}</h3>
                    <p className="text-gray-600 text-sm">{notice.description}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentPage ? 1 : -1);
                  setCurrentPage(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function Home() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-90px)] flex items-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <div className="container mx-auto">
          <div
            ref={heroRef}
            className="flex flex-col lg:flex-row items-center justify-between gap-12"
          >
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={fadeInLeft}
              className="lg:w-1/2 space-y-6"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-block"
              >
                <div className="text-blue-900 font-semibold text-center bg-blue-100 w-fit px-4 py-1.5 text-sm rounded-full">
                  Streamline Your Academic Journey
                </div>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-15"
              >
                Course Registration{" "}
                <span className="text-blue-900">Made Simple</span>{" "}
                and Efficient
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-gray-600 text-lg md:text-xl lg:w-[90%] leading-relaxed"
              >
                CRAMS eliminates registration headaches with real-time conflict
                detection, automated advisor approvals, and intelligent course
                planning tools designed for modern universities.
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link
                  to="/login"
                  className="px-6 py-3 text-lg font-semibold rounded-lg bg-blue-900 text-white hover:bg-blue-800 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse Courses
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 text-lg font-medium border-2 border-gray-400 rounded-lg hover:bg-blue-100 cursor-pointer transform hover:scale-105 transition-all duration-200"
                >
                  Learn More
                </a>
              </motion.div>
            </motion.div>

            {/* Right Content - Course Selection Card */}
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={fadeInRight}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl shadow-2xl p-6 bg-white border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Course Selection</h2>
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-green-500 font-semibold text-sm"
                  >
                    Spring 2025
                  </motion.p>
                </div>
                <hr className="w-full my-4 text-gray-300" />
                <div className="space-y-3">
                  {[
                    { code: "CSE-3641", name: "Software Engineering", status: "approved" },
                    { code: "CSE-3642", name: "Software Engineering Lab", status: "approved" },
                    { code: "CSE-3631", name: "Software Development II", status: "pending" },
                  ].map((course, index) => (
                    <motion.div
                      key={course.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-3 rounded-lg flex justify-between items-center bg-[#EDF2F8] hover:bg-blue-100 transition-colors"
                    >
                      <div>
                        <p className="text-xl font-bold">{course.code}</p>
                        <p className="text-gray-600">{course.name}</p>
                      </div>
                      {course.status === "approved" ? (
                        <FiCheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <FiClock className="h-6 w-6 text-gray-400" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-lg lg:w-2/5 md:w-2/3 mx-auto">
              Comprehensive tools for students, advisors, and administrators to
              manage course registration efficiently
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 md:grid-cols-2 gap-8"
          >
            {[
              {
                icon: FiCalendar,
                title: "Real-time Conflict Detection",
                description:
                  "Automatically identify schedule conflicts and prerequisite violations before submission",
              },
              {
                icon: FiUsers,
                title: "Streamlined Advisor Review",
                description:
                  "Efficient approval workflows with feedback mechanisms for better communication",
              },
              {
                icon: FiCheckCircle,
                title: "Seat Allocation & Waitlisting",
                description:
                  "Dynamic seat tracking with automated waitlist management and notifications",
              },
              {
                icon: FiBell,
                title: "Smart Notifications",
                description:
                  "Email and SMS updates for approvals, changes, and important deadlines",
              },
              {
                icon: LuGraduationCap,
                title: "Academic Planning Tools",
                description:
                  "Integrated tools to help students plan their academic journey effectively",
              },
              {
                icon: FiClock,
                title: "Real-time Availability",
                description:
                  "Live course availability updates to help you make informed decisions",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="border-2 border-gray-200 p-6 rounded-xl hover:border-blue-900 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <feature.icon className="h-8 w-8 text-blue-900 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-blue-50 to-gray-50 scroll-mt-24"
      >
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg lg:w-2/5 md:w-2/3 mx-auto">
              Simple steps to streamline your course registration process
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              {
                step: "01",
                title: "Browse Courses",
                description: "Explore available courses with real-time availability and detailed information",
              },
              {
                step: "02",
                title: "Select & Plan",
                description: "Add courses to your cart and check for conflicts automatically",
              },
              {
                step: "03",
                title: "Get Approval",
                description: "Submit for advisor review with instant feedback and notifications",
              },
              {
                step: "04",
                title: "Complete Registration",
                description: "Finalize your schedule and receive confirmation instantly",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg"
                >
                  {step.step}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-900 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { icon: FiTrendingUp, number: "95%", label: "Registration Success Rate" },
              { icon: FiUsers, number: "10K+", label: "Active Students" },
              { icon: FiClock, number: "50%", label: "Time Saved" },
              { icon: LuGraduationCap, number: "99.9%", label: "System Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100"
              >
                <stat.icon className="h-10 w-10 text-blue-900 mx-auto mb-4" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-4xl font-bold text-blue-900 mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notice Section - Slider */}
      <NoticeSlider />

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </>
  );
}

export default Home;
