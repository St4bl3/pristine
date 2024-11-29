"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const Navbar2: React.FC = () => {
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
      style={{
        position: "fixed",
        top: showNav ? "0" : "-70px",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Translucent background
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 40px",
        zIndex: 10,
        transition: "top 0.3s ease-in-out",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderBottom: `2px solid #ffffff`, // White line for the bottom border
        backdropFilter: "blur(10px)", // Adds a subtle blur effect
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#6c69eb" }}>
        <Link href="/">Pristine</Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: "30px",
          fontSize: "1rem",
          fontWeight: "500",
        }}
      >
        <Link href="/" style={{ color: "#6c69eb", textDecoration: "none" }}>
          Back to User
        </Link>
        <Link
          href="/admin"
          style={{ color: "#6c69eb", textDecoration: "none" }}
        >
          Home
        </Link>
        <Link
          href="/admin/bid"
          style={{ color: "#6c69eb", textDecoration: "none" }}
        >
          Bids
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {isSignedIn ? (
          // Show UserButton when signed in
          <UserButton />
        ) : (
          // Show SignInButton when not signed in
          <SignInButton mode="modal">
            <button
              style={{
                background: "#8e00cc",
                border: "none",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "25px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 4px 15px rgba(0, 0, 0, 0.2)";
              }}
            >
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar2;
