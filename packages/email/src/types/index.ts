import InvitationEmail from "../templates/invitation-email";
import type WelcomeEmail from "../templates/welcome-email";

// Define a type for mapping template names to their React components and props
export type EmailTemplates = {
  WelcomeEmail: typeof WelcomeEmail;
  InvitationEmail: typeof InvitationEmail;
  // Add all your other email templates here
  // Example: 'OrderConfirmation': typeof OrderConfirmationEmail;
};
