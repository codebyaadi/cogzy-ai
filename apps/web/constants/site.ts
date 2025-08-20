export const siteConfig = {
  name: "Cogzy AI",
  title: "Cogzy AI: Transform Documents into Intelligent Conversations",
  description:
    "The RAG-powered platform for professionals. Chat with your data, uncover critical insights, and get accurate, cited answers from your knowledge base in seconds.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://cogzy.codebyaadi.com",
  ogImage: "/cogzy-og.png",
  twitterImage: "/cogzy-og.png",
  author: {
    name: "Aditya Rajbhar",
    url: "https://codebyaadi.com",
    username: "codebyaadi",
  },
  links: {
    twitter: "https://twitter.com/codebyaadi",
    github: "https://github.com/codebyaadi/cogzy-ai",
  },
  keywords: [
    "Cogzy AI",
    "RAG",
    "Document AI",
    "Conversational AI",
    "Financial Analysis",
    "Legal Tech",
    "Academic Research",
    "Knowledge Base Chat",
    "LLM",
    "codebyaadi",
  ],
};

export type SiteConfig = typeof siteConfig;
