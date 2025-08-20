"use client"; // Required for framer-motion animations

import { Button } from "@cogzy/ui/components/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FeaturesSection } from "./_components/features";

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
            <FeaturesSection />
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
