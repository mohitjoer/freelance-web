import type { Metadata } from "next";
import { Page, PageHeader, SidePanel } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of FreelanceBase to understand how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  const lastUpdated = "May 18, 2026";
  const projectName = "Freelance Web Platform";
  const platformName = "FreeLanceBase";
  const contactEmail = "mohitjoe.r@gmail.com";

  return (
    <Page
      aside={<SidePanel active="/privacy" />}
      back={{ href: "/", label: "home" }}
    >
      <PageHeader title="Privacy Policy" body={`Last updated ${lastUpdated}`} />

      <div className="legal">
        <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-ink font-medium mb-2">Important Notice</p>
          <p className="text-sm">
            This Privacy Policy governs your use of {platformName}, an educational/demonstration project. 
            By using our platform, you consent to the practices described in this policy. This is a 
            personal project provided &quot;as is&quot; without warranties or guarantees.
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="text-amber-800 font-medium mb-2">Disclaimer</p>
          <p className="text-sm text-amber-800">
            This platform is a personal project and not operated by a registered company. 
            We provide this service on a best-effort basis with no liability for data loss, 
            service interruptions, or other issues. Use at your own discretion.
          </p>
        </div>

        <section>
          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Account Information</h3>
          <p>When you create an account on FreeLanceBase, we collect:</p>
          <ul>
            <li>Full name and email address</li>
            <li>Profile photograph (if provided)</li>
            <li>Phone number (if provided for two-factor authentication)</li>
            <li>Authentication credentials and security tokens</li>
            <li>Account preferences and settings</li>
          </ul>

          <h3>1.2 Profile and Professional Information</h3>
          <ul>
            <li>Professional skills, experience, and portfolio items</li>
            <li>Work history and educational background</li>
            <li>Rates, availability, and service offerings</li>
            <li>Reviews, ratings, and feedback from other users</li>
            <li>Verification documents and certifications</li>
          </ul>

          <h3>1.3 Communication and Project Data</h3>
          <ul>
            <li>Messages, files, and documents shared through our platform</li>
            <li>Project proposals, contracts, and work deliverables</li>
            <li>Project status updates and milestone tracking</li>
          </ul>

          <h3>1.4 Technical Information</h3>
          <ul>
            <li>IP address, browser type, and device information</li>
            <li>Usage analytics and interaction patterns</li>
            <li>Cookies, session tokens, and tracking pixels</li>
            <li>Error logs and performance metrics</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          
          <h3>2.1 Platform Operations</h3>
          <ul>
            <li>Authenticate users and maintain account security</li>
            <li>Facilitate connections between freelancers and clients</li>
            <li>Enable project collaboration and communication</li>
            <li>Provide customer support and resolve disputes</li>
            <li>Send important platform notifications and updates</li>
          </ul>

          <h3>2.2 Service Improvement</h3>
          <ul>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Develop new features and improve existing functionality</li>
            <li>Conduct A/B testing and performance optimization</li>
            <li>Generate anonymized analytics and insights</li>
          </ul>

          <h3>2.3 Safety and Compliance</h3>
          <ul>
            <li>Detect and prevent fraud, abuse, and policy violations</li>
            <li>Verify user identities and professional credentials</li>
            <li>Comply with legal obligations and regulatory requirements</li>
            <li>Enforce our Terms of Service and community guidelines</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Storage and Security</h2>
          
          <h3>3.1 Data Storage Infrastructure</h3>
          <p>Your data is stored securely using:</p>
          <ul>
            <li><strong>MongoDB Atlas:</strong> Enterprise-grade cloud database with built-in security features</li>
            <li><strong>Better Auth:</strong> Self-hosted, encrypted session-based authentication</li>
          </ul>

          <h3>3.2 Security Measures</h3>
          <ul>
            <li>Multi-factor authentication for enhanced account security</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and role-based permissions</li>
            <li>Automated backup and disaster recovery procedures</li>
            <li>Continuous monitoring for suspicious activities</li>
          </ul>

          <h3>3.3 Data Retention and Limitations</h3>
          <p>
            As a personal project, we make reasonable efforts to maintain your data but cannot 
            guarantee permanent storage or backup. We recommend keeping your own copies of important data.
          </p>
          <p>
            Account data may be retained while the project is active. If the project is discontinued, 
            reasonable notice will be provided where possible, but we cannot guarantee data preservation 
            or migration assistance.
          </p>
        </section>

        <section>
          <h2>4. Information Sharing and Disclosure</h2>
          
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-foreground">We do not sell, rent, or trade your personal information.</p>
          </div>

          <h3>4.1 Authorized Sharing</h3>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>Platform Users:</strong> Profile information visible to facilitate professional connections</li>
            <li><strong>Service Providers:</strong> Trusted third parties who assist in platform operations (email services, analytics)</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect rights and safety</li>
          </ul>

          <h3>4.2 Third-Party Integrations</h3>
          <ul>
            <li><strong>Better Auth:</strong> Self-hosted authentication and user management (better-auth.com)</li>
            <li><strong>Communication Services:</strong> Email delivery and notifications</li>
            <li><strong>Analytics:</strong> Usage analytics and performance monitoring</li>
          </ul>
        </section>

        <section>
          <h2>5. Your Privacy Rights</h2>
          
          <h3>5.1 Access and Control</h3>
          <ul>
            <li><strong>Access:</strong> View and download your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
            <li><strong>Restriction:</strong> Limit how we process your information</li>
          </ul>

          <h3>5.2 Communication Preferences</h3>
          <ul>
            <li>Opt-out of marketing communications</li>
            <li>Customize notification settings</li>
            <li>Manage cookie preferences</li>
            <li>Control profile visibility settings</li>
          </ul>

          <h3>5.3 Exercising Your Rights (Best Effort)</h3>
          <p>
            To exercise any of these rights, please contact us at {contactEmail} with your request. 
            As a personal project, we will make reasonable efforts to accommodate your requests within 
            our technical capabilities, but cannot guarantee the same response times or processes 
            as commercial entities.
          </p>
        </section>

        <section>
          <h2>6. Cookies and Tracking Technologies</h2>
          
          <h3>6.1 Types of Cookies</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
            <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with your consent)</li>
          </ul>

          <h3>6.2 Cookie Management</h3>
          <p>
            You can control cookies through your browser settings or our cookie preference center. 
            Note that disabling essential cookies may impact platform functionality.
          </p>
        </section>

        <section>
          <h2>7. Service Limitations</h2>
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5">
            <p className="mb-2 font-semibold text-destructive">No Liability Disclaimer</p>
            <p className="text-sm">
              This platform is provided &quot;as is&quot; for educational and demonstration purposes. 
              We accept no liability for data loss, service interruptions, security breaches, 
              or any damages arising from the use of this platform.
            </p>
          </div>
          <p>
            Your data may be processed in countries other than your residence through our 
            third-party service providers (MongoDB Atlas). We rely on their security 
            measures and compliance certifications but cannot provide additional guarantees.
          </p>
        </section>

        <section>
          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our platform is not intended for users under 18 years old. We do not knowingly collect 
            personal information from children. If we become aware of such collection, we will 
            make reasonable efforts to delete the information and terminate the account.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this page 
            with an updated date. As a personal project, we cannot guarantee advance notice 
            of all changes, so please check this policy regularly.
          </p>
        </section>

        <section>
          <h2>10. Best Effort Compliance</h2>
          <p>As a personal project, we make reasonable efforts to follow privacy best practices inspired by:</p>
          <ul>
            <li>General Data Protection Regulation (GDPR) principles</li>
            <li>California Consumer Privacy Act (CCPA) guidelines</li>
            <li>Other applicable regional privacy laws</li>
          </ul>
          <p>
            However, we cannot guarantee full compliance and users should not rely on this platform 
            for handling sensitive or critical data that requires strict regulatory compliance.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>
            For questions about this Privacy Policy or to exercise your privacy rights, contact us:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a></p>
            <p><strong>Project:</strong> {projectName}</p>
          </div>
          <p className="text-sm">
            As a personal project, we will make reasonable efforts to respond to privacy concerns, 
            but cannot guarantee professional-level support or response times.
          </p>
        </section>
      </div>
    </Page>
  );
}