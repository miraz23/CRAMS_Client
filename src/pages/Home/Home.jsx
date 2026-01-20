import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "../../Components/shared/Navbar/Navbar";
import caplogo from "../../assets/CAP.png";
import {
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiBell,
  FiCircle,
  FiArrowRight,
  FiTrendingUp,
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

function Home() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18 py-20">
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
                <div className="text-blue-600 font-semibold text-center bg-blue-100 w-fit px-4 py-1.5 text-sm rounded-full mb-4">
                  Streamline Your Academic Journey
                </div>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Course Registration{" "}
                <span className="text-blue-700">Made Simple</span>{" "}
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
                <button className="px-6 py-3 text-lg font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-600 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Start Registration
                </button>
                <button className="px-6 py-3 text-lg font-medium border-2 border-gray-400 rounded-lg hover:bg-gray-100 cursor-pointer transform hover:scale-105 transition-all duration-200">
                  Learn More
                </button>
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
                    { code: "CSE-3642", name: "Software Engineering Lab", status: "approved" },
                    { code: "CSE-3641", name: "Software Engineering", status: "approved" },
                    { code: "CSE-3631", name: "Database Systems", status: "pending" },
                  ].map((course, index) => (
                    <motion.div
                      key={course.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-3 rounded-lg flex justify-between items-center bg-[#EDF2F8] hover:bg-blue-50 transition-colors"
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18">
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
                className="border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18">
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
                  className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg"
                >
                  {step.step}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-300 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18">
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
                <stat.icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-4xl font-bold text-blue-700 mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-lg lg:w-2/5 md:w-2/3 mx-auto">
              Trusted by students, advisors, and administrators across universities
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Student",
                text: "CRAMS made course registration so much easier. The conflict detection saved me hours of planning!",
                rating: 5,
              },
              {
                name: "Dr. Michael Chen",
                role: "Academic Advisor",
                text: "The streamlined approval process has significantly reduced my workload. Highly recommended!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Student",
                text: "Real-time availability updates helped me secure the courses I needed. Amazing system!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.svg
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-center py-16 px-6 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="absolute inset-0 bg-white rounded-full -z-0"
              style={{ width: "200%", height: "200%", top: "-50%", left: "-50%" }}
            />
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to Transform Your Registration Experience?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto"
              >
                Join thousands of students and faculty using CRAMS for seamless
                course registration.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
              >
                Get Started Today
                <FiArrowRight className="inline" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-18">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8 mb-8"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <img src={caplogo} alt="CRAMS Logo" className="w-10 h-10" />
                <span className="text-xl font-bold">CRAMS</span>
              </div>
              <p className="text-gray-400">
                Course Registration & Advising Management System
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 pt-8 text-center text-gray-400"
          >
            <p>
              <span className="font-bold">©</span> 2025 CRAMS. All rights
              reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}

export default Home;
