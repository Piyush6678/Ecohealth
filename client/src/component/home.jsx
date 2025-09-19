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
    <div className="bg-white px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-green-600 text-4xl font-bold mt-4">Meet EcoHealth.</h1>
        <h2 className="text-black text-3xl sm:text-4xl font-bold mb-2">
          Health Made Easy <br /> With AI.
        </h2>
        <p className="text-center font-semibold font-serif text-lg">
          “Eat right, live light — on your body and the planet.”
        </p>
      </div>

      {/* Cards Container */}
      <div className="space-y-8 flex flex-col items-center">
        
        {/* Smart Nutrition Analysis */}
        <div className="flex flex-col md:flex-row bg-slate-200 rounded-xl shadow-lg p-4 gap-4 transition-transform hover:scale-105 duration-300 max-w-4xl w-full">
          <div className="flex-1 bg-slate-300 text-white rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Smart Nutrition Analysis
            </h3>
            <p className="text-slate-600 mt-6 font-medium">
              📸 Upload a photo of your meal and instantly get a detailed breakdown of calories, proteins, carbs, fats, and essential vitamins — making healthy eating easier than ever.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <div className="bg-white w-full h-40 rounded-lg flex items-center justify-center overflow-hidden">
          <img
                src="analyse.jpg"
                alt="analysis"
                className="object-contain w-full h-full  rounded-lg transform transition duration-500 ease-in-out bg-slate-200 hover:scale-110"
              />
            </div>

            <button
             
              className="cursor-pointer bg-green-400 text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-500 transition duration-300"
            >
              Analyse Your Food
            </button>
          </div>
        </div>

        {/* Visualize Your Progress */}
        <div className="flex flex-col md:flex-row bg-slate-200 rounded-xl shadow-lg p-4 gap-4 transition-transform hover:scale-105 duration-300 max-w-4xl w-full">
          <div className="flex-1 bg-slate-300 text-white rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Visualize Your Progress</h3>
            <p className="text-slate-600 mb-6">
              🌱 Stay motivated with a personalized dashboard that tracks your weekly calorie and carbon goals. Visual progress charts make it easy to build healthier and more sustainable habits over time.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-2 items-center justify-center">
            <div className="w-full h-40 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="dashboard.jpg"
                alt="analysis"
                className="object-contain w-full h-full rounded-lg transform transition duration-500 ease-in-out hover:scale-110"
              />
            </div>
              <button
             
              className="cursor-pointer bg-green-400 text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-500 transition duration-300"
            >
              Visualize Your Progress
            </button>
          </div>
        </div>

        {/* Track Your Carbon Footprint */}
        <div className="flex flex-col md:flex-row bg-slate-200 rounded-xl shadow-lg p-4 gap-4 transition-transform hover:scale-105 duration-300 max-w-4xl w-full">
          <div className="flex-1 bg-slate-300 text-white rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Track Your Carbon Footprint</h3>
            <p className="text-slate-600 mb-6">
              🌍 Log your daily activities like travel, energy use, and diet to understand your environmental impact. The tracker highlights how your choices add up and shows where small changes can make a meaningful difference.
            </p>
          </div>

          <div className="flex-1 flex gap-2 flex-col items-center justify-center">
            <div className="w-full h-40 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="carbon.jpg"
                alt="carbon footprint"
                className="object-contain w-full h-full rounded-lg transform transition duration-500 ease-in-out hover:scale-110"
              />
            </div>
               <button
             
              className="cursor-pointer bg-green-400 text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-500 transition duration-300"
            >
              Calculate Your Carbon Footprint 
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}