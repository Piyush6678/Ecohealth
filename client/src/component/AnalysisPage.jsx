import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import {
    RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

// --- Reusable Components (Slightly modified for dynamic data) ---

function ProgressCard({ value = 0, target = 1, unit, color, label }) {
    const safeValue = isNaN(value) ? 0 : value;
    const safeTarget = isNaN(target) || target === 0 ? 1 : target; // Avoid division by zero
    const percentage = Math.round((safeValue / safeTarget) * 100);
    const chartData = [{ name: label, value: safeValue }];

    return (
        <div className="bg-white border rounded-xl shadow p-4 flex flex-col items-center text-center">
             <div className="relative w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={chartData} startAngle={90} endAngle={-270}>
                        <PolarAngleAxis type="number" domain={[0, safeTarget]} angleAxisId={0} tick={false} />
                        <RadialBar minAngle={0} background={{ fill: '#eee' }} clockWise dataKey="value" fill={color} cornerRadius={5} />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold">{percentage}%</span>
                </div>
            </div>
            <p className="text-lg font-bold mt-2" style={{ color }}>
                {safeValue.toFixed(1)} <span className="text-sm font-normal text-gray-600">{unit}</span>
            </p>
            <p className="font-medium text-gray-800">{label}</p>
            <p className="text-gray-500 text-sm">Target: {safeTarget} {unit}</p>
        </div>
    );
}

function WeeklyChart({ title, data, color, onClick, isSelected }) {
    return (
        <div 
            className={`bg-white rounded-xl shadow p-4 flex-1 cursor-pointer hover:shadow-lg transition ${isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`} 
            onClick={onClick}
        >
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- NEW History Components ---

const MealHistory = ({ meals }) => (
    <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
        <h2 className="font-semibold text-2xl mb-4">Recent Meal History</h2>
        <div className="space-y-3">
            {meals.length > 0 ? meals.map(meal => (
                <div key={meal._id} className="bg-orange-50 flex justify-between items-center p-3 rounded-lg">
                    <div>
                        <h3 className="font-medium text-orange-900">{meal.items[0]?.foodName || 'Meal'}</h3>
                        <p className="text-sm text-gray-500">{format(parseISO(meal.createdAt), "MMMM d, yyyy")}</p>
                    </div>
                    <span className="text-teal-600 font-medium">{meal.items.reduce((sum, i) => sum + i.calories, 0)} kcal</span>
                </div>
            )) : <p className="text-gray-500">No meal history found. Go add a meal to see it here!</p>}
        </div>
    </div>
);

const CarbonHistory = ({ entries }) => (
    <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
        <h2 className="font-semibold text-2xl mb-4">Recent Activity History</h2>
        <div className="space-y-3">
            {entries.length > 0 ? entries.map(entry => (
                <div key={entry._id} className="bg-red-50 flex justify-between items-center p-3 rounded-lg">
                    <div>
                        <h3 className="font-medium text-red-900 capitalize">{entry.activity.replace(/_/g, ' ')}</h3>
                         <p className="text-sm text-gray-500">{format(parseISO(entry.createdAt), "MMMM d, yyyy")}</p>
                    </div>
                    <span className="text-red-600 font-medium">{entry.carbonFootprintKg.toFixed(2)} kg CO₂e</span>
                </div>
            )) : <p className="text-gray-500">No carbon footprint history found. Go calculate an activity to see it here!</p>}
        </div>
    </div>
);


// --- Main Analysis Page Component ---

export default function AnalysisPage() {
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historyView, setHistoryView] = useState('meals'); // 'meals' or 'carbon'

    useEffect(() => {
        const fetchAnalysisData = async () => {
            try {
                const token = localStorage.getItem('authorization');
                if (!token) {
                    throw new Error("No auth token found. Please log in.");
                }
                const response = await axios.get('http://localhost:5000/api/v1/user/analysis', {
                    headers: { 'authorization': `${token}` }
                });
                setAnalysisData(response.data.data);
            } catch (err) {
                setError(err.message || "Could not fetch analysis data. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalysisData();
    }, []);
    
    // Use useMemo to format data for charts, preventing recalculation on every render
    const formattedChartData = useMemo(() => {
        if (!analysisData) return { calories: [], protein: [], carbon: [] };
        
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const format = (dataArray) => days.map((day, i) => ({ day, value: dataArray[i] || 0 }));

        return {
            calories: format(analysisData.weeklyProgress.calories),
            protein: format(analysisData.weeklyProgress.protein),
            carbon: format(analysisData.weeklyProgress.carbon),
        };
    }, [analysisData]);

    const todaysProgress = useMemo(() => {
        if (!analysisData) return { calories: 0, protein: 0, carbon: 0 };
        const dayIndex = new Date().getDay(); // Sunday = 0
        return {
            calories: analysisData.weeklyProgress.calories[dayIndex] || 0,
            protein: analysisData.weeklyProgress.protein[dayIndex] || 0,
            carbon: analysisData.weeklyProgress.carbon[dayIndex] || 0,
        };
    }, [analysisData]);


    if (isLoading) return <div className="text-center p-10 font-semibold text-gray-600">Loading your analysis...</div>;
    if (error) return <div className="text-center p-10 bg-red-50 text-red-600 rounded-lg">{error}</div>;
    if (!analysisData) return <div className="text-center p-10">No analysis data available. Start by adding a meal!</div>;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold">Your Weekly Analysis</h1>
            <p className="text-gray-500">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>

            {/* Top Stats */}
            <h2 className="text-xl font-bold text-gray-700">Today's Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProgressCard value={todaysProgress.calories} target={analysisData.goals.calorieTarget} unit="kcal" color="#21808d" label="Calories"/>
                <ProgressCard value={todaysProgress.protein} target={analysisData.goals.proteinTarget} unit="g" color="#F2B418" label="Protein"/>
                <ProgressCard value={todaysProgress.carbon} target={analysisData.goals.carbonLimit} unit="kg" color="#ff5459" label="Carbon"/>
            </div>

            {/* Weekly Charts */}
             <h2 className="text-xl font-bold text-gray-700 pt-4">Weekly Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WeeklyChart title="Weekly Calorie Intake" data={formattedChartData.calories} color="#21808d" onClick={() => setHistoryView('meals')} isSelected={historyView === 'meals'} />
                <WeeklyChart title="Weekly Carbon Footprint" data={formattedChartData.carbon} color="#ff5459" onClick={() => setHistoryView('carbon')} isSelected={historyView === 'carbon'} />
            </div>
            
            {/* Conditional History View */}
            <div>
                {historyView === 'meals' && <MealHistory meals={analysisData.mealHistory} />}
                {historyView === 'carbon' && <CarbonHistory entries={analysisData.carbonHistory} />}
            </div>
        </div>
    );
}

