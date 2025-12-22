import { InvitationEmail } from "../templates/InvitationEmail";
import { MagicLinkEmail } from "../templates/MagicLinkEmail";
import { WelcomeEmail } from "../templates/WelcomeEmail";

// Define a type for mapping template names to their React components and props
export type EmailTemplates = {
  WelcomeEmail: typeof WelcomeEmail;
  InvitationEmail: typeof InvitationEmail;
  MagicLinkEmail: typeof MagicLinkEmail;
  // Add all your other email templates here
  // Example: 'OrderConfirmation': typeof OrderConfirmationEmail;
};
