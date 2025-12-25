import * as React from "react";
import { CogzyLogo } from "../ui/cogzy-logo";

interface MagicLinkEmailProps {
  userName?: string;
  loginUrl?: string;
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

export const MagicLinkEmail = ({
  userName = "there",
  loginUrl = "https://yourapp.com/magic-login",
}: MagicLinkEmailProps) => (
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
      Your Magic Login Link to Cogzy AI
    </div>
    <div style={container} className="container">
      <div style={logoContainer}>
        <CogzyLogo />
      </div>
      <h1 style={heading} className="heading">
        Magic Link Login
      </h1>
      <p style={text}>Hello {userName},</p>
      <p style={text}>
        Click the button below to log in to your Cogzy AI account securely with
        your magic link.
      </p>
      <div
        style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}
      >
        <a href={loginUrl} style={button}>
          Log In to Cogzy AI
        </a>
      </div>
      <p style={text}>
        This link will expire in 15 minutes. If you didn’t request this, please
        ignore this email.
      </p>
      <p style={text}>
        Thanks,
        <br />
        The Cogzy AI Team
      </p>
      <hr style={hr} />
      <p style={footerText}>
        If you need help, please contact support at support@cogzy.ai.
      </p>
    </div>
  </div>
);

export default MagicLinkEmail;
