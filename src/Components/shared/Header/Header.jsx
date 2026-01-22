import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import caplogo from "../../../assets/CAP.png";
import { X, Menu, User, Book, BookOpen, MessageSquare, Home, HelpCircle } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Features", icon: Book, href: "#features" },
  { label: "How it works", icon: BookOpen, href: "#how-it-works" },
  { label: "Notices", icon: MessageSquare, href: "#notices" },
  { label: "FAQ", icon: HelpCircle, href: "#faq" },
];

function clampToTopOffset(value) {
  if (typeof value !== "number") return 0;
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(64, value));
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const headerClassName = useMemo(() => {
    const base =
      "sticky top-0 z-50 border-b transition-colors duration-200 supports-[backdrop-filter]:backdrop-blur";
    const home =
      scrolled
        ? "bg-white/80 border-gray-200"
        : "bg-transparent border-transparent";
    const other = "bg-white/90 border-gray-200";
    return `${base} ${isHome ? home : other}`;
  }, [isHome, scrolled]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleAnchorClick = (e, href) => {
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    setIsOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    const topOffset = clampToTopOffset(64);
    const top = el.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header className={headerClassName}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div>
              <img src={caplogo} alt="" className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-wide text-blue-900 drop-shadow-sm uppercase">CRAMS</h1>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className=" flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-900 transition-colors"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-900 text-white hover:bg-blue-800 shadow-sm hover:shadow transition-all"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Sign in
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white/80 hover:bg-white transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-gray-950/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-xl">
            <div className="container mx-auto py-4">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div>
                    <img src={caplogo} alt="" className="w-14 h-14" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-wide text-blue-900 drop-shadow-sm uppercase">CRAMS</h1>
                  </div>
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  aria-label="Close menu"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-xl text-sm font-semibold bg-blue-700 text-white hover:bg-blue-600 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
