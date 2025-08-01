import Image from 'next/image';
import React from 'react';
import BackButton from '@/components/backbutton';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-row justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png" 
              alt="FreeLanceBase Logo" 
              className="h-10 w-10 object-contain"
              width={100}
              height={100}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FreeLanceBase</h1>
              <p className="text-sm text-gray-600">Professional Freelancing Platform</p>
            </div>
          </div>
          <div>
            <BackButton/>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using the FreeLanceBase platform. 
            By accessing our services, you agree to be bound by these conditions.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12">
          <div className="space-y-8">
            
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the FreeLanceBase Platform (&quot;Platform&quot;), you agree to comply with and be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree, do not use the Platform.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                Users must register via Clerk. You are responsible for your account and must not engage in fraud or unauthorized promotion. By registering, you accept Clerk&apos;s{' '}
                <a 
                  className="text-blue-600 hover:text-blue-800 underline transition-colors" 
                  href="https://clerk.com/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a 
                  className="text-blue-600 hover:text-blue-800 underline transition-colors" 
                  href="https://clerk.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Eligibility</h2>
              <p className="text-gray-700 leading-relaxed">
                You must be 18 years of age or have legal capacity in your jurisdiction to use this platform.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Platform Services</h2>
              <p className="text-gray-700 leading-relaxed">
                The platform allows clients to post jobs and freelancers to submit proposals and collaborate on projects.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree not to break laws, impersonate others, spread malware, or advertise without permission.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Payments & Fees</h2>
              <p className="text-gray-700 leading-relaxed">
                All payments are made directly between freelancers and clients. FreeLanceBase does not hold funds or offer payment guarantees.
              </p>
            </div>

            <div className="border-l-4 border-indigo-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All original platform content is owned by FreeLanceBase and cannot be copied or reused without written permission.
              </p>
            </div>

            <div className="border-l-4 border-pink-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate accounts that violate our policies without prior notice.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                We are not liable for indirect or consequential damages. Use the platform at your own risk.
              </p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                Users are encouraged to resolve issues directly. Mediation by us is optional and not guaranteed.
              </p>
            </div>

            <div className="border-l-4 border-lime-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Third-Party Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                Authentication is managed by Clerk. We are not liable for issues related to Clerk&apos;s services.
              </p>
            </div>

            <div className="border-l-4 border-emerald-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                Please refer to our Privacy Policy for detailed information on how we handle your personal data.
              </p>
            </div>

            <div className="border-l-4 border-rose-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                Terms may be updated at any time. Continued use of the platform constitutes acceptance of any changes.
              </p>
            </div>

            <div className="border-l-4 border-violet-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of India and any disputes will be resolved in Indian courts.
              </p>
            </div>

            <div className="border-l-4 border-slate-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms & Conditions, please contact us at{' '}
                <a 
                  className="text-blue-600 hover:text-blue-800 underline transition-colors" 
                  href="mailto:support@freelancebase.com"
                >
                  support@freelancebase.com
                </a>
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png" 
                alt="FreeLanceBase Logo" 
                className="h-8 w-8 object-contain"
                width={100}
                height={100}
              />
              <span className="text-lg font-semibold">FreeLanceBase</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 FreeLanceBase.<br></br> All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}