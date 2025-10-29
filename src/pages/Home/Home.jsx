import React from "react";
import Navbar from "../../Components/shared/Navbar/Navbar";
import caplogo from "../../assets/CAP.png";
function Home() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <section>
        <div className="h-[90vh] flex justify-between items-center px-18 bg-gray-50">
          <div className="flex flex-col w-1/2">
            <div className="text-blue-600 font-semibold text-lg bg-blue-100 w-fit px-4 py-1 rounded-full mb-4">
              Streamline Your Academic Journey
            </div>
            <h1 className="text-4xl font-bold pt-3 mb-4 leading-tight">
              Course Registration <br />
              Made Simple <br />
              and Efficient
            </h1>
            <p className="text-gray-500 text-lg mb-6 w-[85%]">
              CRAMS eliminates registration headaches with real-time conflict
              detection, automated advisor approvals, and integlligent course
              planning tools designed for mordern universities.
            </p>
            <div className="flex gap-4">
              <button className=" px-3 py-2 text-lg font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-600 cursor-pointer">
                Start Registration
              </button>
              <button className="px-3 py-2 font-medium border-2 border-gray-400 rounded-lg hover:bg-gray-100 cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
          {/* right part */}
          <div className=" w-1/2 h-auto rounded-lg shadow-lg p-6 bg-white">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Course Selection</h2>
              <p className="text-green-500 font-semibold">Spring 2025</p>
            </div>
            <hr className="w-full my-4 text-gray-300" />
            <div>
              {/* outer div for course name */}
              <div className=" p-3 mb-4 rounded-lg flex justify-between items-center  bg-[#EDF2F8]">
                {/* inner course name div */}
                <div>
                  {/* course name */}
                  <p className="text-xl font-bold">CSE-3642</p>
                  <p className="text-gray-500 text-lg">
                    Software Engineering Lab
                  </p>
                </div>
                <div>
                  {/* icon */}
                  <i class=" fa-circle-check"></i>
                </div>
              </div>
              {/* ------ */}
              <div className=" p-3 mb-4 rounded-lg flex justify-between items-center bg-[#EDF2F8]">
                {/* inner course name div */}
                <div>
                  {/* course name */}
                  <p className="text-xl font-bold">CSE-3641</p>
                  <p className="text-gray-500 text-lg">Software Engineering</p>
                </div>
                <div>{/* icon */}</div>
              </div>
              {/* ------- */}
              <div className=" p-3 mb-4 rounded-lg flex justify-between items-center bg-[#EDF2F8]">
                {/* inner course name div */}
                <div>
                  {/* course name */}
                  <p className="text-xl font-bold">CSE-3631</p>
                  <p className="text-gray-500 text-lg">Database Systems</p>
                </div>
                <div>{/* icon */}</div>
              </div>
              {/* ----------- */}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-12">
          <div className="mt-12 text-center mb-12">
            <h1 className="text-2xl font-bold text-center">
              Everything You Need
            </h1>
            <p className="text-gray-500 mt-2 w-2/5 mx-auto">
              Comprehensive tools for students, advisors, and administrators to
              manage course registration efficiently
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 px-18 mb-20">
            <div className="mb-8 border-2 border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow">
              {/* icon */}
              <h1 className="text-xl font-bold">
                Real-time conflict Detection
              </h1>
              <p className="text-gray-500 mt-2">
                Automatically identify schedule conflicts and prerequisite
                violations before submission
              </p>
            </div>
            {/* -------- */}
            <div className="mb-8 border-2 border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow">
              {/* icon */}
              <h1 className="text-xl font-bold">Streamlined Advisor Review</h1>
              <p className="text-gray-500 mt-2">
                Efficient approval workflows with feedback mechanisms for better
                communication
              </p>
            </div>
            {/* ================ */}
            <div className="mb-8 border-2 border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow">
              {/* icon */}
              <h1 className="text-xl font-bold">
                Seat Allocation & Waitlisting
              </h1>
              <p className="text-gray-500 mt-2">
                Dynamic seat tracking with automated waitlist management and
                notifications
              </p>
            </div>
            {/* --------- */}
            <div className="mb-8 border-2 border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow">
              {/* icon */}
              <h1 className="text-xl font-bold">Smart Notifications</h1>
              <p className="text-gray-500 mt-2">
                Email and SMS updates for approvals, changes, and important
                deadlines
              </p>
            </div>
            {/* ------------ */}
            <div className="mb-8 border-2 border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow">
              {/* icon */}
              <h1 className="text-xl font-bold">Academic planning Tools</h1>
              <p className="text-gray-500 mt-2">
                Integrated tools to help students plan their academic journey
                effectively
              </p>
            </div>
            {/* --------- */}
            <div className="mb-8 border-2 border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow">
              {/* icon */}
              <h1 className="text-xl font-bold">Real-time Availability</h1>
              <p className="text-gray-500 mt-2">
                Live course availability updates to help you make informed
                decisions
              </p>
            </div>
            {/* ------------ */}
          </div>
        </div>
      </section>
      <section>
        <div className="bg-blue-700 text-white text-center py-12 px-6 rounded-lg mx-18 mt-12 mb-20">
          <h1 className="text-3xl font-bold mb-3">
            Ready to Transform Your Registration Experience?
          </h1>
          <p className="text-gray-300">
            Join thousands of students and faculty using CRAMS for seamless
            course registration.
          </p>
          <button className="bg-white text-black font-bold py-2 px-4 rounded-lg mt-4">
            Get Started Today
          </button>
        </div>
      </section>
      <footer>
        <div className="bg-gray-50 border-t border-gray-200 flex justify-between items-center mt-20">
          {/* icon */}
          <div className="flex justify-center items-center px-6 py-2">
            <img src={caplogo} alt="CRAMS Logo" className="w-12 h-12" />
            <span className="text-black font-bold">CRAMS</span>
          </div>
          <div className="text-right text-gray-500 px-6">
            <span className="font-bold text-lg">©</span> 2025 CRAMS. Course
            Registration & Advising Management System
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
