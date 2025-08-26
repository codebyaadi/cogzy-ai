import WelcomeEmail from "../templates/welcome-email";
import InvitationEmail from "../templates/invitation-email";
import { EmailTemplates } from "../types";

// Map template names to their components
export const TEMPLATES: EmailTemplates = {
  WelcomeEmail,
  InvitationEmail,
  // Add all your other email templates here
};
