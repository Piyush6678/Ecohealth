import { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios

// A simple component to display API feedback messages
const ApiFeedback = ({ message, type }) => {
  if (!message) return null;
  const baseClasses = "text-center p-2 rounded-lg my-4 text-sm font-semibold";
  const typeClasses = type === "success" 
    ? "bg-green-100 text-green-800" 
    : "bg-red-100 text-red-800";
  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default function ProfilePage({ user, setUser }) { // Destructure setUser from props
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [proteinTarget, setProteinTarget] = useState(150);
  const [carbonLimit, setCarbonLimit] = useState(5);
  
  // State to manage API call status and feedback
  const [apiStatus, setApiStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  useEffect(() => {
    // Populate state from user prop when it's available
    if (user?.goals) {
      setCalorieTarget(user.goals.calorieTarget || 2000);
      setProteinTarget(user.goals.proteinTarget || 150);
      setCarbonLimit(user.goals.carbonLimit || 5);
    }
  }, [user]);

  const handleSave = async () => {
    setApiStatus({ loading: true, error: null, success: null }); // Set loading state

    const goalsPayload = {
      calorieTarget: Number(calorieTarget),
      proteinTarget: Number(proteinTarget),
      carbonLimit: Number(carbonLimit),
    };

    try {
      // Get the auth token from localStorage (or your state management solution)
      const token = localStorage.getItem('authorization');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Make the PUT request to the new backend endpoint
      const response = await axios.put(
        'http://localhost:5000/api/v1/user/goals',
        goalsPayload,
        {
          headers: {
            'authorization': `${token}` 
          }
        } 
      );

      // On success, update the parent user state and show a success  message
      if (response.data.success) {
        setUser(response.data.user); // Update the user state in the parent component
        setApiStatus({ loading: false, error: null, success: "Goals saved successfully!" });
      }
    } catch (err) {
      // On error, show an error message
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setApiStatus({ loading: false, error: errorMessage, success: null });
      console.error("Failed to save goals:", err);
    } finally{
setUser(user);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p className="text-gray-400 mb-6">Manage your goals and preferences</p>

      {/* Personal Info (No changes here) */}
      <div className="bg-white p-4 border rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-400">Name</label>
          <input
            type="text"
            value={user?.name || ""}
            disabled
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-black border border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-black border border-gray-700"
          />
        </div>
      </div>

      {/* Nutrition Goals */}
      <div className="bg-white rounded-xl border shadow mb-6 p-4">
        <h2 className="text-xl font-semibold mb-4">Nutrition Goals</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-400">
            Daily Calorie Target (kcal)
          </label>
          <input
            type="number"
            value={calorieTarget}
            onChange={(e) => setCalorieTarget(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400">
            Daily Protein Target (g)
          </label>
          <input
            type="number"
            value={proteinTarget}
            onChange={(e) => setProteinTarget(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400">
            Daily Carbon Footprint Limit (kg CO₂e)
          </label>
          <input
            type="number"
            value={carbonLimit}
            onChange={(e) => setCarbonLimit(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Display API feedback messages */}
        <ApiFeedback message={apiStatus.success} type="success" />
        <ApiFeedback message={apiStatus.error} type="error" />

        <button
          onClick={handleSave}
          disabled={apiStatus.loading} // Disable button while loading
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {apiStatus.loading ? 'Saving...' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
}
