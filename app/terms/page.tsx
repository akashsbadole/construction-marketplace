import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateMetadata } from "@/lib/seo/metadata";
import {
  CalendarIcon,
  ShieldCheckIcon,
  ScaleIcon,
  AlertTriangleIcon,
} from "lucide-react";

export const metadata = generateMetadata({
  title: "Terms of Service - BuildConnect",
  description:
    "Read BuildConnect's Terms of Service to understand your rights and responsibilities when using our construction marketplace platform.",
  keywords: [
    "terms of service",
    "buildconnect terms",
    "construction marketplace terms",
    "user agreement",
    "platform rules",
    "legal terms",
  ],
  canonical: "https://buildconnect.com/terms",
});

export default function TermsOfServicePage() {
  const lastUpdated = "2024-01-15";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ScaleIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>
                Last updated:{" "}
                {new Date(lastUpdated).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <Badge variant="outline">Version 2.1</Badge>
          </div>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            These Terms of Service ("Terms") govern your use of BuildConnect's
            platform and services. By accessing or using our services, you agree
            to be bound by these Terms.
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Overview */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">
                    What BuildConnect Provides:
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Marketplace platform for construction services</li>
                    <li>• Contractor and vendor verification</li>
                    <li>• Project management tools</li>
                    <li>• Payment processing services</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Your Responsibilities:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Provide accurate information</li>
                    <li>• Follow platform guidelines</li>
                    <li>• Respect other users</li>
                    <li>• Comply with applicable laws</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By creating an account, accessing, or using BuildConnect's
                services, you acknowledge that you have read, understood, and
                agree to be bound by these Terms of Service and our Privacy
                Policy.
              </p>
              <p>
                If you do not agree to these Terms, you may not access or use
                our services. We reserve the right to modify these Terms at any
                time, and such modifications will be effective immediately upon
                posting.
              </p>
            </CardContent>
          </Card>

          {/* 2. Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                BuildConnect is an online marketplace that connects customers
                with contractors, suppliers, and vendors in the construction
                industry. Our platform provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Project posting and bidding system</li>
                <li>Contractor and vendor profiles with verification</li>
                <li>Material and service listings</li>
                <li>Communication and project management tools</li>
                <li>Payment processing and escrow services</li>
                <li>Review and rating system</li>
                <li>Dispute resolution assistance</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. User Accounts and Registration */}
          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium">3.1 Account Creation</h4>
              <p>
                To use certain features of our platform, you must create an
                account. You agree to provide accurate, current, and complete
                information during registration and to update such information
                as necessary.
              </p>

              <h4 className="font-medium">3.2 Account Security</h4>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You must notify us immediately of any unauthorized use.
              </p>

              <h4 className="font-medium">3.3 User Categories</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Customers</h5>
                  <p className="text-sm text-muted-foreground">
                    Post projects and hire services
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Contractors</h5>
                  <p className="text-sm text-muted-foreground">
                    Provide construction services
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Vendors</h5>
                  <p className="text-sm text-muted-foreground">
                    Supply materials and products
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. User Conduct and Prohibited Activities */}
          <Card>
            <CardHeader>
              <CardTitle>4. User Conduct and Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-red-800">
                    Prohibited Activities
                  </h4>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>
                    • Posting false, misleading, or fraudulent information
                  </li>
                  <li>• Circumventing platform fees or payment systems</li>
                  <li>
                    • Harassing, threatening, or discriminating against other
                    users
                  </li>
                  <li>• Violating intellectual property rights</li>
                  <li>
                    • Engaging in illegal activities or promoting illegal
                    services
                  </li>
                  <li>
                    • Creating multiple accounts to manipulate reviews or
                    ratings
                  </li>
                  <li>• Spamming or sending unsolicited communications</li>
                </ul>
              </div>

              <h4 className="font-medium">4.1 Professional Standards</h4>
              <p>
                Contractors and vendors must maintain professional standards,
                hold necessary licenses and certifications, and comply with all
                applicable laws and regulations in their jurisdiction.
              </p>
            </CardContent>
          </Card>

          {/* 5. Platform Fees and Payments */}
          <Card>
            <CardHeader>
              <CardTitle>5. Platform Fees and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium">5.1 Service Fees</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">For Contractors</h5>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 3-5% commission on completed projects</li>
                    <li>• Premium listing fees (optional)</li>
                    <li>• Lead generation fees</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">For Vendors</h5>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 2-4% commission on sales</li>
                    <li>• Listing fees for premium placement</li>
                    <li>• Transaction processing fees</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-medium">5.2 Payment Processing</h4>
              <p>
                All payments are processed through our secure payment gateway.
                We may hold funds in escrow until project milestones are
                completed to protect both parties.
              </p>
            </CardContent>
          </Card>

          {/* 6. Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium">6.1 Platform Content</h4>
              <p>
                BuildConnect owns all rights to the platform, including
                software, design, logos, and proprietary content. Users are
                granted a limited license to use the platform for its intended
                purpose.
              </p>

              <h4 className="font-medium">6.2 User Content</h4>
              <p>
                You retain ownership of content you post but grant BuildConnect
                a license to use, display, and distribute such content on the
                platform. You represent that you have the right to post such
                content.
              </p>
            </CardContent>
          </Card>

          {/* 7. Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your personal information. By using
                our services, you consent to our data practices as described in
                the Privacy Policy.
              </p>

              <h4 className="font-medium">7.1 Data Security</h4>
              <p>
                We implement industry-standard security measures to protect your
                data, including encryption, secure servers, and regular security
                audits. For detailed information, please refer to our
                <a
                  href="/privacy"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </CardContent>
          </Card>

          {/* 8. Dispute Resolution */}
          <Card>
            <CardHeader>
              <CardTitle>8. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium">8.1 Platform Mediation</h4>
              <p>
                BuildConnect provides dispute resolution services to help
                resolve conflicts between users. We encourage users to first
                attempt direct communication before escalating disputes.
              </p>

              <h4 className="font-medium">8.2 Arbitration</h4>
              <p>
                For disputes that cannot be resolved through mediation, binding
                arbitration may be required as specified in your service
                agreement.
              </p>
            </CardContent>
          </Card>

          {/* 9. Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Important Notice
                </h4>
                <p className="text-sm text-yellow-700">
                  BuildConnect acts as a marketplace platform and is not
                  responsible for the quality, safety, or legality of services
                  provided by contractors and vendors. Users engage with service
                  providers at their own risk.
                </p>
              </div>

              <p>
                To the maximum extent permitted by law, BuildConnect shall not
                be liable for any indirect, incidental, special, or
                consequential damages arising from your use of the platform.
              </p>
            </CardContent>
          </Card>

          {/* 10. Termination */}
          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium">10.1 Account Termination</h4>
              <p>
                You may terminate your account at any time. We may suspend or
                terminate accounts that violate these Terms or engage in
                prohibited activities.
              </p>

              <h4 className="font-medium">10.2 Effect of Termination</h4>
              <p>
                Upon termination, your access to the platform will cease, but
                certain provisions of these Terms will survive, including
                payment obligations and intellectual property rights.
              </p>
            </CardContent>
          </Card>

          {/* 11. Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>11. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                These Terms are governed by the laws of India. Any disputes
                arising from these Terms or your use of the platform will be
                subject to the exclusive jurisdiction of the courts in New
                Delhi, India.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Legal Department</h4>
                  <p>Email: legal@buildconnect.com</p>
                  <p>Phone: +91-11-4567-8900</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mailing Address</h4>
                  <p>
                    BuildConnect Legal Team
                    <br />
                    123 Business District
                    <br />
                    New Delhi, 110001
                    <br />
                    India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing to use BuildConnect, you acknowledge that you have
            read and understood these Terms of Service.
          </p>
          <p className="mt-2">
            Last updated: {new Date(lastUpdated).toLocaleDateString("en-IN")} |
            Version 2.1
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
