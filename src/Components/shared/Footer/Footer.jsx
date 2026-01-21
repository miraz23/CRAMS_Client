import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import caplogo from "../../../assets/CAP.png";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-800">
      <div className="container mx-auto">
        <div className="py-14 grid lg:grid-cols-12 gap-10 border-b border-blue-200">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div>
                <img src={caplogo} alt="" className="w-14 h-14" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">CRAMS</h2>
                <p className="text-xs text-gray-600">Course Registration & Advising Management System</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Built for modern universities: faster registration, fewer conflicts,
              and clearer approvals — for students, advisors, and administrators.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="mailto:support@crams.edu"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-200 hover:bg-blue-300 border border-blue-300 transition-colors text-blue-900"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-200 hover:bg-blue-300 border border-blue-300 transition-colors text-blue-900"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-200 hover:bg-blue-300 border border-blue-300 transition-colors text-blue-900"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-blue-900">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a className="hover:text-blue-900 transition-colors" href="#features">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-900 transition-colors"
                    href="#how-it-works"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-900 transition-colors"
                    href="#notices"
                  >
                    Notices
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-blue-900">Account</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link className="hover:text-blue-900 transition-colors" to="/login">
                    Sign in
                  </Link>
                </li>
                <li>
                  <a className="hover:text-blue-900 transition-colors" href="#">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-blue-900">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a className="hover:text-blue-900 transition-colors" href="#">
                    Help center
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-900 transition-colors" href="#">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-900 transition-colors" href="#">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} CRAMS. All rights reserved.
          </p>
          <div className="text-sm text-gray-500">
            Designed for speed, clarity, and fewer registration conflicts.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
