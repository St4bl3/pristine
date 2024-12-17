// components/Navbar.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const [showNav, setShowNav] = useState(true);
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  // Scroll hide/show effect
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full bg-white bg-opacity-0 backdrop-blur-md flex items-center justify-between px-8 py-4 z-50 transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      } shadow-md border-b border-white`}
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-accent1">
        <Link href="/">Pristine</Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-accent1 font-medium">
        <Link
          href="/"
          className="hover:text-accent2 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/men"
          className="hover:text-accent2 transition-colors duration-200"
        >
          Men
        </Link>
        <Link
          href="/women"
          className="hover:text-accent2 transition-colors duration-200"
        >
          Women
        </Link>
        <Link
          href="/children"
          className="hover:text-accent2 transition-colors duration-200"
        >
          Children
        </Link>
      </div>

      {/* User Authentication */}
      <div className="flex items-center space-x-4">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-accent2 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-accent1 transition-transform duration-200 transform hover:scale-105">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
