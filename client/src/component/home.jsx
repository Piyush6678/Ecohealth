import React from "react";

// Helper component for the icons to keep the main component cleaner.
// You can find more icons at https://lucide.dev/
const NutritionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-500 mb-4"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18v-4" />
    <path d="M9 18H7" />
    <path d="M17 18h-2" />
    <path d="m9 14-1 1" />
    <path d="m15 14 1 1" />
  </svg>
);

const CarbonFootprintIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-500 mb-4"
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 12c-3 0-6 2.5-6 6" />
    <path d="M12 18c3 0 6-2.5 6-6" />
    <path d="M12 6V2" />
    <path d="M12 22v-4" />
    <path d="m16 8 4-4" />
    <path d="m4 20 4-4" />
    <path d="m8 8-4-4" />
    <path d="m20 20-4-4" />
  </svg>
);


const ProgressIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-500 mb-4"
  >
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 4 4 5-5" />
  </svg>
);


export default function Home({ user }) {
  // NOTE: For the "Inter" font to work, make sure you import it in your main HTML file.
  // Add this to the <head> of your public/index.html:
  // <link rel="preconnect" href="https://fonts.googleapis.com">
  // <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  // <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  // Then, ensure your tailwind.config.js extends the 'sans' font family.

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Welcome, {user?.name || "Guest"}!
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-2">
          Your personal dashboard for tracking health and environmental impact.
        </p>
        <p className="text-sm text-slate-500">
          Logged in as <span className="font-medium text-slate-600">{user?.email}</span>
        </p>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Core Features</h2>
            <p className="text-slate-600 mt-2">Everything you need to build healthier habits.</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Nutrition Analysis */}
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <NutritionIcon />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Nutrition Analysis</h3>
              <p className="text-slate-600 mb-6">
                Instantly get a detailed nutritional breakdown of your meals. Just upload a photo or enter the food's name to track your calories, macros, and vitamins with ease.
              </p>
              <button className="mt-auto w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-300">
                Analyze Your Food
              </button>
            </div>

            {/* Card 2: Carbon Footprint Tracker */}
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <CarbonFootprintIcon />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Track Your Carbon Footprint</h3>
              <p className="text-slate-600 mb-6">
                Understand your environmental impact by logging daily activities like travel, energy use, and diet. Our tracker makes it simple to see where you can make a difference.
              </p>
              <button className="mt-auto w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-300">
                Start Tracking
              </button>
            </div>

            {/* Card 3: Progress & Analytics */}
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <ProgressIcon />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Visualize Your Progress</h3>
              <p className="text-slate-600 mb-6">
                Stay motivated with a personalized dashboard. See your weekly progress on both calorie and carbon goals to build healthier, more sustainable habits.
              </p>
              <button className="mt-auto w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-300">
                View Your Dashboard
              </button>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}