// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.h1
          className="text-5xl font-extrabold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Empowering <span className="text-blue-600">Freelancers</span> & Clients
        </motion.h1>
        <motion.p
          className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Find the right job, hire the perfect freelancer — all in one modern platform.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            href="/jobs"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            My Profile
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-10">
        {[
          {
            icon: "/globe.svg",
            title: "Global Network",
            desc: "Work with clients and freelancers from around the world.",
          },
          {
            icon: "/shield-level-2.svg",
            title: "Secure Payments",
            desc: "Guaranteed secure transactions and escrow protection.",
          },
          {
            icon: "/window.svg",
            title: "Modern Dashboard",
            desc: "Track your jobs, proposals, and earnings in one place.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Image src={item.icon} alt={item.title} width={48} height={48} className="mb-4" />
            <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
