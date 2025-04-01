"use client";

import MainNav from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    "6 Professional Templates",
    "Customizable Sections",
    "Resume Upload",
    "Social Media Integration",
    "Real-time Preview",
    "Mobile Responsive",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="px-4 py-12 md:py-20 lg:py-32 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Create Your Professional Portfolio in Minutes
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Showcase your work, skills, and achievements with our easy-to-use
                portfolio maker. Choose from beautiful templates and customize them
                to match your style.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/templates">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/templates">View Templates</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-square"
            >
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                alt="Portfolio Preview"
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-12 bg-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-background p-6 rounded-lg"
                >
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}