import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CheckCircle,
  Bell,
  BarChart3,
  Shield,
  Plus,
  Mail,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const features = [
    {
      icon: CheckCircle,
      title: "Centralized Subscription Management",
      description:
        "Track all your SaaS subscriptions, streaming services, and recurring payments in one intuitive dashboard. From Netflix to Spotify, Adobe to Microsoft 365.",
    },
    {
      icon: Bell,
      title: "Smart Payment Reminders",
      description:
        "Never miss a billing date again. Receive email notifications 3 days before your subscription renewals to avoid surprise charges.",
    },
    {
      icon: BarChart3,
      title: "Spending Analytics & Insights",
      description:
        "Visualize your monthly and yearly subscription costs with detailed charts. Identify unused subscriptions and save money on services you don't need.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Your subscription data is encrypted and protected with Firebase security. We never store your payment information.",
    },
  ];

  const steps = [
    {
      icon: Plus,
      number: "1",
      title: "Add Your Subscriptions",
      description:
        "Quickly add all your subscription services with billing dates and costs",
    },
    {
      icon: Mail,
      number: "2",
      title: "Get Reminders",
      description:
        "Receive email notifications before each payment to avoid surprises",
    },
    {
      icon: TrendingDown,
      number: "3",
      title: "Analyze & Save",
      description:
        "View spending analytics and cancel unused subscriptions to save money",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Manage Your SaaS Subscriptions
              <br />
              <span className="text-primary-600">Smartly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take control of your recurring payments with SmartManager. Track
              all your subscription services in one place, get automatic payment
              reminders, and analyze your spending to save money every month.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button className="btn-hover" variant="outline" size="lg">
                  Start for free
                </Button>
              </Link>
              <Link href="/login">
                <Button className="btn-hover" variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section with Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/subscriptions.jpg"
                alt="Multiple subscription services scattered across devices"
                fill
                className="object-cover"
              />
            </div>

            {/* Right: Content */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Losing Track of Your Subscriptions?
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  The average person spends over{" "}
                  <span className="font-bold text-primary-600">
                    $200 per month
                  </span>{" "}
                  on subscriptions they don&apos;t fully use. From streaming
                  services like Netflix and Disney+ to SaaS tools like Adobe
                  Creative Cloud and Microsoft 365, it&apos;s easy to lose track
                  of recurring payments.
                </p>
                <p>
                  SmartManager is a{" "}
                  <strong>subscription management tool</strong> designed to help
                  you monitor all your subscriptions in one centralized
                  dashboard. Track payment dates, analyze your spending habits,
                  and discover which services you&apos;re actually using.
                </p>
                <p>
                  With automatic payment reminders, you&apos;ll never face
                  surprise charges again. Our spending analytics show you
                  exactly where your money goes each month, helping you identify
                  subscriptions you can cancel to{" "}
                  <strong>save hundreds of dollars per year</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose SmartManager?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The smartest way to manage your subscription tracker and recurring
              payments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <div className="inline-flex p-4 bg-primary-50 rounded-xl mb-4">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              How SmartManager Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-shadow relative"
              >
                <div className="text-center">
                  <div className="inline-flex p-4 bg-primary-50 rounded-xl mb-4">
                    <step.icon className="w-8 h-8 text-primary-600" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Start Managing Your Subscriptions Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users saving money with SmartManager. Sign up for
            free and take control of your recurring payments.
          </p>
          <Link href="/signup">
            <Button
              variant="secondary"
              size="lg"
              className="btn-hover text-lg px-8 py-6"
            >
              Start for Free - No Credit Card Required
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg">
              &copy; 2025 SmartManager. All rights reserved.
            </p>
            <p className="text-sm mt-3 text-gray-500">
              Subscription management tool | Track recurring payments | Save
              money on subscriptions
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
