import * as React from "react";
import { CogzyLogo } from "../ui/cogzy-logo";

interface WelcomeEmailProps {
  userName?: string;
  dashboardUrl?: string;
}

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: "'Outfit', sans-serif",
  color: "#f0f0f0",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const logoContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const heading = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#f0f0f0",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#cccccc",
};

const button = {
  backgroundColor: "#ffffff",
  color: "#0a0a0a",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "14px",
  boxSizing: "border-box" as const,
};

const hr = {
  borderColor: "#262626",
  margin: "20px 0",
  borderStyle: "solid",
  borderWidth: "1px 0 0 0",
};

const footerText = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "16px",
};

export const WelcomeEmail = ({
  userName = "New User",
  dashboardUrl = "https://yourapp.com/dashboard",
}: WelcomeEmailProps) => (
  <div style={main}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
      @media (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 20px 15px 48px 15px !important;
          box-sizing: border-box !important;
        }
        .heading {
          font-size: 28px !important;
        }
      }
    `}</style>
    <div
      style={{
        display: "none",
        fontSize: "1px",
        lineHeight: "1px",
        maxHeight: "0px",
        maxWidth: "0px",
        opacity: "0",
        overflow: "hidden",
      }}
    >
      Welcome to Cogzy AI - Let's Get Started
    </div>
    <div style={container} className="container">
      <div style={logoContainer}>
        <CogzyLogo />
      </div>
      <h1 style={heading} className="heading">
        Welcome to Cogzy AI
      </h1>
      <p style={text}>Hello {userName},</p>
      <p style={text}>
        Thank you for signing up! We're excited to have you on board. We're on a
        mission to build the future, and we're thrilled you're a part of it.
      </p>
      <div
        style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}
      >
        <a href={dashboardUrl} style={button}>
          Go to Your Dashboard
        </a>
      </div>
      <p style={text}>
        Best,
        <br />
        The Cogzy AI Team
      </p>
      <hr style={hr} />
      <p style={footerText}>Cogzy AI, 123 Innovation Drive, Tech City, 12345</p>
    </div>
  </div>
);

export default WelcomeEmail;
