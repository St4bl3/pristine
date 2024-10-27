"use client";
import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #f1f0f2, #d7d5da)",
        color: "#6c69eb",
        padding: "40px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Brand Logo */}
      <h2
        style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "10px" }}
      >
        Pristine
      </h2>
      <p
        style={{
          fontSize: "0.9rem",
          maxWidth: "450px",
          color: "#8e00cc",
          marginBottom: "20px",
        }}
      >
        Discover premium fashion finds at exclusive auctions. Join us to elevate
        your wardrobe with timeless pieces.
      </p>

      {/* Navigation Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          fontSize: "0.9rem",
          marginBottom: "20px",
        }}
      >
        <Link href="/" style={{ color: "#6c69eb", textDecoration: "none" }}>
          Home
        </Link>
        <Link href="/men" style={{ color: "#6c69eb", textDecoration: "none" }}>
          Men
        </Link>
        <Link
          href="/women"
          style={{ color: "#6c69eb", textDecoration: "none" }}
        >
          Women
        </Link>
        <Link
          href="/children"
          style={{ color: "#6c69eb", textDecoration: "none" }}
        >
          Children
        </Link>
        <Link
          href="/about"
          style={{ color: "#6c69eb", textDecoration: "none" }}
        >
          About
        </Link>
      </div>

      {/* Social Media Links */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "15px",
          color: "#8e00cc",
        }}
      >
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          <FaFacebookF size={18} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          <FaTwitter size={18} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          <FaInstagram size={18} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          <FaLinkedinIn size={18} />
        </a>
      </div>

      {/* Bottom Text */}
      <p style={{ fontSize: "0.75rem", color: "#6c69eb" }}>
        © {new Date().getFullYear()} Pristine. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
