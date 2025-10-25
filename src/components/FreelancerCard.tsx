"use client";

import Link from "next/link";
import { MapPin, Star, Briefcase } from "lucide-react";
import { Freelancer } from "@/types/freelancer";

interface FreelancerCardProps {
  freelancer: Freelancer;
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const availabilityColors = {
    available:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    unavailable: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <Link href={`/profile/${freelancer._id}`}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {freelancer.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {freelancer.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {freelancer.category}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {freelancer.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{freelancer.completedJobs} jobs</span>
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              availabilityColors[freelancer.availability]
            } transition-colors`}
          >
            {freelancer.availability}
          </span>
        </div>

        {/* Bio */}
        {freelancer.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {freelancer.bio}
          </p>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {freelancer.skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs transition-colors"
            >
              {skill}
            </span>
          ))}
          {freelancer.skills.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
              +{freelancer.skills.length - 5} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{freelancer.location}</span>
          </div>
          {freelancer.hourlyRate && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${freelancer.hourlyRate}/hr
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

