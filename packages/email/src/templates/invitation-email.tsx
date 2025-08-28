import * as React from "react";
import { CogzyLogo } from "../ui/cogzy-logo";

interface InvitationEmailProps {
  invitedByName?: string;
  organizationName?: string;
  inviteLink?: string;
  userName?: string;
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

export const InvitationEmail = ({
  invitedByName = "A colleague",
  organizationName = "their organization",
  inviteLink = "https://yourapp.com/invite?token=invalid",
  userName = "there",
}: InvitationEmailProps) => (
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
      You've been invited to join an organization
    </div>
    <div style={container} className="container">
      <div style={logoContainer}>
        <CogzyLogo />
      </div>
      <h1 style={heading} className="heading">
        You're Invited!
      </h1>
      <p style={text}>Hello {userName},</p>
      <p style={text}>
        <strong>{invitedByName}</strong> has invited you to join the{" "}
        <strong>{organizationName}</strong> organization on Cogzy AI.
      </p>
      <div
        style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}
      >
        <a href={inviteLink} style={button}>
          Accept Invitation
        </a>
      </div>
      <p style={text}>
        This invitation link will expire in 24 hours. If you have any questions,
        please reach out to {invitedByName}.
      </p>
      <p style={text}>
        Thanks,
        <br />
        The Cogzy AI Team
      </p>
      <hr style={hr} />
      <p style={footerText}>
        If you were not expecting this invitation, you can ignore this email.
      </p>
    </div>
  </div>
);

export default InvitationEmail;
