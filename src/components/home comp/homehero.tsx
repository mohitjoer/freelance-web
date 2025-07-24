import { Button } from "../ui/button";
import { Star, Users, CheckCircle, ArrowRight, Play } from "lucide-react";


function HomeHero() {
  return (
    <main className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 w-fit">
             <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
              <span className="text-sm font-medium text-gray-700">Trusted by clients & freelancers worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Where
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> talent </span>
                meets
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> opportunity</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Whether you&apos;re hiring top talent or showcasing your skills, FreeLancBase connects the right people for every project. Join millions of freelancers and clients worldwide.
              </p>
            </div>

           

            {/* Popular Searches */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-medium">Popular for clients:</p>
              <div className="flex flex-wrap gap-2">
                {["Web Development", "Logo Design", "Content Writing", "Mobile Apps", "SEO"].map((tag) => (
                  <button key={tag} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-blue-600 rounded-full text-sm font-medium transition-colors duration-200 border border-blue-200 hover:border-blue-300">
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-4">Popular for freelancers:</p>
              <div className="flex flex-wrap gap-2">
                {["Remote Jobs", "Part-time Work", "Project Based", "Long-term", "Entry Level"].map((tag) => (
                  <button key={tag} className="px-4 py-2 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 text-purple-600 rounded-full text-sm font-medium transition-colors duration-200 border border-purple-200 hover:border-purple-300">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-lg group">
                Start as Client
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-lg group">
                Join as Freelancer
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-colors duration-200 text-lg group">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Connect & Collaborate</h3>
                  <p className="text-blue-100">Join thousands of successful projects</p>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Verified</p>
                  <p className="text-sm text-gray-600">Talent Profiles</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Based on</p>
                  <p className="text-sm text-gray-600">Reviews & Ratings</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-8 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">2K+</p>
                  <p className="text-sm text-gray-600">Active Community Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "Community User's", value: "2K+" },
              { label: "Active User's", value: "10K+" },
              { label: "Happy Clients", value: "50K+" },
              { label: "Countries", value: "150+" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeHero;