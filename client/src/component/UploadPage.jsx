import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// Custom hook and SVG Icons (no changes needed here, keeping for context)
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};
const ProteinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9zM9 9l3 3m0 0l3-3m-3 3v6" /></svg>;
const CarbsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" /></svg>;
const FatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a8.001 8.001 0 00-14.856 0A8.001 8.001 0 0012 21a8.001 8.001 0 007.428-5.572zM12 9a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const FiberIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;



export default function NutritionScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foodName, setFoodName] = useState(""); // ✨ New state for the text input

  const isMobile = useMediaQuery("(max-width: 768px)");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setNutritionData(null);
      setError(null);
      setFoodName(""); // Clear text input if an image is uploaded
    }
  };
  
  // Renamed to be more specific
  const handleAnalyzeImage = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setNutritionData(null);

    const formData = new FormData();
    formData.append("meal", file);
 
    try {
      const response = await axios.post(
        // Using the new, more specific backend route
        "http://localhost:5000/api/v1/user/meal/nutrition-by-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      const cleanedString = response.data.nutritionInfo.replace(/```json\n|\n```/g, '');
      const parsedData = JSON.parse(cleanedString);
      setNutritionData(parsedData);

    } catch (err) {
      console.error("API Error:", err);
      setError("Sorry, we couldn't analyze that image. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ New handler function for text input
  const handleAnalyzeText = async () => {
    if (!foodName.trim()) return;

    setIsLoading(true);
    setError(null);
    setNutritionData(null);
    setPreview(null); // Ensure no old image preview is shown

    try {
        const response = await axios.post(
            "http://localhost:5000/api/v1/user/meal/nutrition-by-name",
            { food_name: foodName }, // Send as JSON
            { headers: { "Content-Type": "application/json" } }
        );

        const cleanedString = response.data.nutritionInfo.replace(/```json\n|\n```/g, '');
        const parsedData = JSON.parse(cleanedString);
        setNutritionData(parsedData);

    } catch (err) {
        console.error("API Error:", err);
        setError("Sorry, we couldn't find data for that food. Please be more specific.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setNutritionData(null);
    setError(null);
    setFoodName(""); // ✨ Also reset the text input
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const renderInitialState = () => (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Snap, Type & Get</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">Nutritional Insights</h2>
      <p className="text-gray-500 mb-8">Upload a photo or type a food name to get smart AI insights!</p>
      
      {/* Image Upload */}
      <input type="file" accept="image/*" capture={isMobile ? "environment" : undefined} ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button onClick={() => fileInputRef.current.click()} className="w-full max-w-xs bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-transform transform hover:scale-105">
          {isMobile ? "Snap with Camera" : "Upload an Image"}
      </button>

      {/* ✨ New UI: Divider and Text Input */}
      <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="flex gap-2">
          <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., 'A bowl of oatmeal with berries'"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <button
              onClick={handleAnalyzeText}
              disabled={!foodName.trim() || isLoading}
              className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
              Get
          </button>
      </div>
    </div>
  );

  const renderPreviewState = () => (
    <div className="w-full max-w-md text-center">
        <img src={preview} alt="Meal preview" className="rounded-lg mb-4 w-full h-auto max-h-80 object-cover shadow-lg" />
        <div className="flex gap-4">
            <button onClick={handleReset} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition">
                Cancel
            </button>
            <button onClick={handleAnalyzeImage} className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition">
                Analyze Meal
            </button>
        </div>
    </div>
  );
  
  const renderLoadingState = () => (<div className="flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Analyzing your meal...</p>
        <p className="text-gray-500">This might take a moment.</p>
    </div>);
  
  const renderResultsState = () => {
      const { item_name, nutrition_totals, allergens } = nutritionData;
         const nutritionItems = [
            { label: "Protein", value: nutrition_totals.protein_g, unit: "g", icon: <ProteinIcon /> },
            { label: "Carbs", value: nutrition_totals.carbs_g, unit: "g", icon: <CarbsIcon /> },
            { label: "Fats", value: nutrition_totals.fat_g, unit: "g", icon: <FatIcon /> },
            { label: "Fiber", value: nutrition_totals.fiber_g, unit: "g", icon: <FiberIcon /> },
        ];
      return (
          <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl animate-fade-in">
              {/* ✨ Conditional rendering: only show image if it exists */}
              {preview && (
                  <img src={preview} alt={item_name} className="rounded-lg mb-4 w-full h-48 object-cover"/>
              )}
              
             <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{item_name}</h2>
                    <p className="text-5xl font-extrabold text-teal-600">
                        {Math.round(nutrition_totals.calories_kcal)}
                        <span className="text-xl font-medium text-gray-500 ml-1">Cal</span>
                    </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
                    {nutritionItems.map(item => (
                        <div key={item.label} className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-teal-500 mx-auto mb-1">{item.icon}</div>
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="text-lg font-bold text-gray-800">{item.value}{item.unit}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Potential Allergens</h3>
                    <div className="flex flex-wrap gap-2">
                        {nutritionData.allergens.map(allergen => (
                            <span key={allergen} className="capitalize bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{allergen}</span>
                        ))}
                    </div>
                </div>
                
                <button
                    onClick={handleReset}
                    className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition"
                >
                    Scan Another Meal
                </button>
          </div>
      );
  };
  
  const renderErrorState = () => (  <div className="w-full max-w-md text-center bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold text-red-700 mb-2">Oh no!</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
                onClick={handleReset}
                className="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition"
            >
                Try Again
            </button>
        </div> );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {isLoading ? renderLoadingState() :
         error ? renderErrorState() :
         nutritionData ? renderResultsState() :
         preview ? renderPreviewState() :
         renderInitialState()}
      </div>
    </div>
  );
}