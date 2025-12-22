import { InvitationEmail } from "../templates/InvitationEmail";
import { MagicLinkEmail } from "../templates/MagicLinkEmail";
import { WelcomeEmail } from "../templates/WelcomeEmail";
import { EmailTemplates } from "../types";

// Map template names to their components
export const TEMPLATES: EmailTemplates = {
  WelcomeEmail,
  InvitationEmail,
  MagicLinkEmail,
  // Add all your other email templates here
};
