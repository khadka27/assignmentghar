"use client";

import Link from "next/link";
import Image from "next/image";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Lock,
  Clock,
  Brain,
  MessageSquare,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  GraduationCap,
  FileCheck,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counters, setCounters] = useState({
    students: 0,
    assignments: 0,
    experts: 0,
    satisfaction: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      students: 15000,
      assignments: 25000,
      experts: 500,
      satisfaction: 98,
    };

    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        students: Math.floor(targets.students * progress),
        assignments: Math.floor(targets.assignments * progress),
        experts: Math.floor(targets.experts * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>#1 Assignment Help Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Master Your
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Academic Journey
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl">
                Get expert assignment help, connect with top consultants, and
                achieve academic excellence with our comprehensive platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-14 px-8 text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-900/20 h-14 px-8 text-lg"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                {[
                  { icon: CheckCircle, text: "24/7 Support" },
                  { icon: Lock, text: "Secure & Private" },
                  { icon: Zap, text: "Fast Delivery" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <item.icon className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block animate-float">
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                {/* Floating cards */}
                <div className="space-y-6">
                  {/* Student Card */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Expert Tutors</h3>
                        <p className="text-white/80">Available 24/7</p>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Card */}
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            Assignment Status
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            In Progress
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        85%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Success Card */}
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-4">
                      <Award className="w-12 h-12" />
                      <div>
                        <h3 className="text-2xl font-bold">A+ Grade</h3>
                        <p className="text-white/80">Achievement Unlocked!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating icons */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                count: counters.students,
                label: "Happy Students",
                suffix: "+",
              },
              {
                icon: FileCheck,
                count: counters.assignments,
                label: "Assignments Completed",
                suffix: "+",
              },
              {
                icon: Award,
                count: counters.experts,
                label: "Expert Tutors",
                suffix: "+",
              },
              {
                icon: TrendingUp,
                count: counters.satisfaction,
                label: "Satisfaction Rate",
                suffix: "%",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-3 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.count.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm px-4 py-1">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                For Academic Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive tools and expert support to help you excel in your
              studies
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Real-Time Chat",
                description:
                  "Connect instantly with expert tutors through our advanced chat system",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Brain,
                title: "Expert Guidance",
                description:
                  "Get personalized help from qualified professionals in your field",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description:
                  "Round-the-clock assistance whenever you need help with assignments",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Lock,
                title: "Secure Platform",
                description:
                  "Your data and assignments are protected with end-to-end encryption",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Target,
                title: "Quality Guarantee",
                description:
                  "100% plagiarism-free work with unlimited revisions until you're satisfied",
                color: "from-indigo-500 to-blue-500",
              },
              {
                icon: TrendingUp,
                title: "Grade Improvement",
                description:
                  "Proven track record of helping students achieve higher grades",
                color: "from-pink-500 to-purple-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm px-4 py-1">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Wide Range of{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Academic Services
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.title}
                className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <Link href="/submit">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 p-0 h-auto font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm px-4 py-1">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              How It{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in 3 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700"></div>

            {[
              {
                step: "01",
                title: "Submit Assignment",
                description:
                  "Upload your assignment details and requirements through our easy-to-use platform",
                icon: FileCheck,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Connect with Expert",
                description:
                  "Get matched with a qualified tutor who specializes in your subject area",
                icon: Users,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Receive Solution",
                description:
                  "Get your completed assignment with detailed explanations and on-time delivery",
                icon: Award,
                color: "from-green-500 to-emerald-500",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 group">
                  {/* Step Number */}
                  <div className="text-7xl font-black text-gray-100 dark:text-gray-800 absolute top-4 right-4 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div
                    className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/submit">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Redesigned */}
      <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm px-4 py-1">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              What{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Students Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real feedback from students who achieved success with our help
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {testimonials[activeTestimonial]?.initials || "S"}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonials[activeTestimonial]?.text}"
                  </p>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {testimonials[activeTestimonial]?.initials}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[activeTestimonial]?.course}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.initials}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.course}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-900/20"
              >
                View All Testimonials
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of students who have improved their grades and
            achieved academic success with our expert help.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-14 px-8 text-lg font-bold"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm h-14 px-8 text-lg"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Start Chat Now
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/20">
            {[
              "✓ 100% Plagiarism-Free",
              "✓ 24/7 Support",
              "✓ Money-Back Guarantee",
              "✓ Confidential & Secure",
            ].map((item, index) => (
              <div key={index} className="text-white/90 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
