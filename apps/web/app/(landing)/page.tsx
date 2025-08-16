"use client"; // Required for framer-motion animations

import { Button } from "@cogzy/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cogzy/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cogzy/ui/components/tabs";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

// --- Custom SVG Icon Components ---

const SecureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g clipPath="url(#clip0_4418_8302)">
      <path
        d="M18.54 4.17063L13.04 2.11062C12.47 1.90063 11.54 1.90063 10.97 2.11062L5.47005 4.17063C4.41005 4.57063 3.55005 5.81063 3.55005 6.94063V15.0406C3.55005 15.8506 4.08005 16.9206 4.73005 17.4006L10.23 21.5106C11.2 22.2406 12.79 22.2406 13.76 21.5106L19.26 17.4006C19.91 16.9106 20.4401 15.8506 20.4401 15.0406V6.94063C20.4501 5.81063 19.59 4.57063 18.54 4.17063ZM12.75 12.8706V15.5006C12.75 15.9106 12.41 16.2506 12 16.2506C11.59 16.2506 11.25 15.9106 11.25 15.5006V12.8706C10.24 12.5506 9.50005 11.6106 9.50005 10.5006C9.50005 9.12062 10.62 8.00063 12 8.00063C13.38 8.00063 14.5 9.12062 14.5 10.5006C14.5 11.6206 13.76 12.5506 12.75 12.8706Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_4418_8302">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const BlazingFastIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <g clipPath="url(#clip0_4418_8589)">
      <path
        d="M17.91 10.7209H14.82V3.52087C14.82 1.84087 13.91 1.50087 12.8 2.76087L12 3.67087L5.23001 11.3709C4.30001 12.4209 4.69001 13.2809 6.09001 13.2809H9.18001V20.4809C9.18001 22.1609 10.09 22.5009 11.2 21.2409L12 20.3309L18.77 12.6309C19.7 11.5809 19.31 10.7209 17.91 10.7209Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_4418_8589">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g clipPath="url(#clip0_4418_8491)">
      <path
        d="M15.7999 2.21048C15.3899 1.80048 14.6799 2.08048 14.6799 2.65048V6.14048C14.6799 7.60048 15.9199 8.81048 17.4299 8.81048C18.3799 8.82048 19.6999 8.82048 20.8299 8.82048C21.3999 8.82048 21.6999 8.15048 21.2999 7.75048C19.8599 6.30048 17.2799 3.69048 15.7999 2.21048Z"
        fill="currentColor"
      />
      <path
        d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19ZM11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75ZM13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_4418_8491">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g clipPath="url(#clip0_4418_8201)">
      <path
        d="M20 6.75C21.5188 6.75 22.75 5.51878 22.75 4C22.75 2.48122 21.5188 1.25 20 1.25C18.4812 1.25 17.25 2.48122 17.25 4C17.25 5.51878 18.4812 6.75 20 6.75Z"
        fill="currentColor"
      />
      <path
        d="M19.04 8.15C17.47 7.81 16.19 6.53 15.85 4.96C15.72 4.35 15.71 3.76 15.82 3.2C15.95 2.58 15.49 2 14.85 2H7C4.24 2 2 4.24 2 7V13.95C2 16.71 4.24 18.95 7 18.95H8.5C8.78 18.95 9.14 19.13 9.3 19.35L10.8 21.34C11.46 22.22 12.54 22.22 13.2 21.34L14.7 19.35C14.89 19.1 15.18 18.95 15.5 18.95H17.01C19.77 18.95 22 16.72 22 13.96V9.15C22 8.52 21.42 8.06 20.8 8.18C20.24 8.28 19.65 8.28 19.04 8.15ZM8 12C7.44 12 7 11.55 7 11C7 10.45 7.44 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.56 12 8 12ZM12 12C11.44 12 11 11.55 11 11C11 10.45 11.44 10 12 10C12.55 10 13 10.45 13 11C13 11.55 12.56 12 12 12ZM16 12C15.44 12 15 11.55 15 11C15 10.45 15.44 10 16 10C16.55 10 17 10.45 17 11C17 11.55 16.56 12 16 12Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_4418_8201">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// The main Page component for the landing page
export default function Page() {
  // Animation variants for staggered children
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for items fading in
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-slate-50">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
          {/* Background Gradient */}
          <div className="absolute top-0 left-1/2 -z-10 h-[40rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black" />

          <motion.div
            className="container mx-auto max-w-7xl px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 sm:text-6xl md:text-7xl"
              variants={itemVariants}
            >
              Transform Documents into Intelligent Conversations
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-300"
              variants={itemVariants}
            >
              COGZY AI is the RAG-powered platform that allows you to chat with
              your data, uncover critical insights, and get accurate answers in
              seconds.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-4"
              variants={itemVariants}
            >
              <Button
                size="lg"
                asChild
                className="bg-white text-slate-900 hover:bg-slate-200"
              >
                <Link href="/signup">
                  Get Started for Free{" "}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Link href="/demo">Book a Demo</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why Choose COGZY AI?
              </h2>
              <p className="mt-4 text-slate-400">
                Go beyond simple search. Our platform is built for accuracy,
                speed, and security.
              </p>
            </div>
            <motion.div
              className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              <FeatureCard
                icon={<ChatIcon />}
                title="Conversational Q&A"
                description="Ask questions in natural language and get precise, context-aware answers directly from your documents."
              />
              <FeatureCard
                icon={<DocumentIcon />}
                title="Multi-Document Synthesis"
                description="Query your entire knowledge base at once to connect information and synthesize insights from multiple sources."
              />
              <FeatureCard
                icon={<BlazingFastIcon />}
                title="Blazing Fast Indexing"
                description="Our optimized pipeline processes and indexes your documents in minutes, not hours, so you can get answers faster."
              />
              <FeatureCard
                icon={<SecureIcon />}
                title="Secure & Private"
                description="Your data is encrypted and isolated. We provide a secure, enterprise-grade environment for your most sensitive information."
              />
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="bg-slate-950 py-20 sm:py-32">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Built for Every Professional
              </h2>
              <p className="mt-4 text-slate-400">
                COGZY AI adapts to your workflow, supercharging productivity for
                any document-intensive task.
              </p>
            </div>
            <Tabs defaultValue="financial" className="mt-12 mx-auto max-w-4xl">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="financial">Financial Analysts</TabsTrigger>
                <TabsTrigger value="legal">Legal Teams</TabsTrigger>
                <TabsTrigger value="researchers">Researchers</TabsTrigger>
              </TabsList>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TabsContent
                  value="financial"
                  className="mt-6 p-6 rounded-lg border border-slate-800 min-h-[120px]"
                >
                  <p className="text-slate-300">
                    Instantly analyze 10-K filings, earnings reports, and market
                    research. Accelerate due diligence, track competitor
                    strategy, and find critical data points in minutes, not
                    days.
                  </p>
                </TabsContent>
                <TabsContent
                  value="legal"
                  className="mt-6 p-6 rounded-lg border border-slate-800 min-h-[120px]"
                >
                  <p className="text-slate-300">
                    Streamline case discovery by querying thousands of legal
                    precedents, contracts, and depositions. Find relevant
                    information, identify contradictions, and build stronger
                    cases faster.
                  </p>
                </TabsContent>
                <TabsContent
                  value="researchers"
                  className="mt-6 p-6 rounded-lg border border-slate-800 min-h-[120px]"
                >
                  <p className="text-slate-300">
                    Supercharge your literature reviews. Converse with hundreds
                    of academic papers to identify key themes, track citations,
                    and uncover novel connections and counterarguments.
                  </p>
                </TabsContent>
              </motion.div>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-20 sm:py-32">
          <div className="container mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Unlock Your Documents?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Start for free today. No credit card required. Experience the
              future of knowledge discovery.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                asChild
                className="bg-white text-slate-900 hover:bg-slate-200"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/signup"
                >
                  Sign Up and Start Building{" "}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </motion.a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50">
        <div className="container mx-auto flex max-w-7xl items-center justify-between py-6 px-6 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} COGZY AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// A reusable component for feature cards with a new minimalist design
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center p-6 text-center rounded-lg transition-colors duration-300 hover:bg-slate-900"
    >
      <div className="text-slate-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </motion.div>
  );
}
