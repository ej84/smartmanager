import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckCircle, Bell, BarChart3, Shield } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: CheckCircle,
      title: "Easy Subscription Management",
      description: "Manage all your SaaS subscriptions in one place",
    },
    {
      icon: Bell,
      title: "Automatic Payment Reminders",
      description: "Get email notifications before your payment dates",
    },
    {
      icon: BarChart3,
      title: "Spending Analytics",
      description:
        "View your monthly and yearly subscription costs at a glance",
    },
    {
      icon: Shield,
      title: "Secure Data",
      description: "Your data is protected with Firebase security",
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
              Track all your subscription services in one place,{" "}
              <strong>never</strong> miss a payment. Analyze your spending and
              save money.
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

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SmartManager?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <div className="text-center">
                  <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-4">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Managing Your Subscriptions Today
          </h2>
          <p className="text-primary-100 mb-8 text-lg font-bold">
            Sign up for free and start tracking your subscriptions today!
          </p>
          <Link href="/signup" className="outline-2 outline-black rounded-xl">
            <Button variant="secondary" size="lg" className="btn-hover">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 SmartManager. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
