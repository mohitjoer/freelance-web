'use client';

import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/backbutton';
import HelpIcon from '@mui/icons-material/Help';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const faqs = [
  {
    q: 'How do I apply for a job?',
    a: 'Open any job from the Open Jobs page and click "Make a Proposal". You can submit one proposal per job and edit or delete it anytime.',
  },
  {
    q: 'How do I hire a freelancer?',
    a: 'Post a job with your requirements and budget. Review incoming proposals from your job page and accept the one that fits best.',
  },
  {
    q: 'Where can I chat about a project?',
    a: 'Every active project has a dedicated chat room. Find it under Active Jobs in your dashboard under "Project Chat".',
  },
  {
    q: 'How do I report someone?',
    a: 'Use the Report button on any active project card in your dashboard. Our team reviews every report.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 h-16">
            <BackButton/>
            <div className="flex items-center space-x-3">
              <Image
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                alt="FreeLanceBase Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">FreeLanceBase</h1>
                <p className="text-xs text-gray-500">Professional Freelance Network</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpIcon className="text-blue-600" style={{ fontSize: 28 }} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Help & Support</h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Get answers to common questions or reach out to our team — we&apos;re here to help.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <EmailOutlinedIcon className="text-blue-600 mb-3" style={{ fontSize: 28 }} />
            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-600">support@freelancebase.example</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <ChatBubbleOutlineOutlinedIcon className="text-green-600 mb-3" style={{ fontSize: 28 }} />
            <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
            <p className="text-sm text-gray-600">Available Mon–Fri, 9am–6pm</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <BugReportOutlinedIcon className="text-purple-600 mb-3" style={{ fontSize: 28 }} />
            <h3 className="font-semibold text-gray-900 mb-1">Report an Issue</h3>
            <p className="text-sm text-gray-600">Found a bug? Let us know.</p>
          </div>
        </div>

        {/* FAQ */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3 mb-12">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm open:border-blue-200"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none p-5 font-medium text-gray-900 hover:text-blue-700 transition-colors">
                {faq.q}
                <ArrowForwardIcon
                  className="text-gray-400 transition-transform group-open:rotate-90"
                  style={{ fontSize: 18 }}
                />
              </summary>
              <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-blue-100 mb-5 text-sm max-w-md mx-auto">
            Send us a message and we&apos;ll get back to you within one business day.
          </p>
          <Link href="/notifications">
            <button className="bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Contact Support
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
