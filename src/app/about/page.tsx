"use client";

import { Card, CardContent } from "@/components/ui/card";
import MainNav from "@/components/main-nav";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container max-w-4xl py-12 px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">About Us</h1>
        
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We empower professionals and creatives to showcase their work through beautiful, 
                customizable portfolio websites. Our platform makes it easy to create and maintain 
                a professional online presence that truly represents your unique talents and achievements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Easy Portfolio Creation</h3>
                  <p className="text-muted-foreground">
                    Create professional portfolios in minutes with our intuitive interface 
                    and customizable templates.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Professional Templates</h3>
                  <p className="text-muted-foreground">
                    Choose from a variety of modern, responsive templates designed to 
                    showcase your work effectively.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Customization</h3>
                  <p className="text-muted-foreground">
                    Personalize your portfolio with custom colors, fonts, and layouts 
                    to match your personal brand.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Mobile Responsive</h3>
                  <p className="text-muted-foreground">
                    Your portfolio will look great on all devices, from desktop to mobile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We are a passionate team of developers, designers, and creators dedicated 
                to helping professionals showcase their work in the best possible way.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-muted-foreground">Founder & CEO</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-medium">Jane Smith</h3>
                  <p className="text-muted-foreground">Lead Designer</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-medium">Mike Johnson</h3>
                  <p className="text-muted-foreground">Lead Developer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
