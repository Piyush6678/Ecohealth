import React, { useState } from "react";
import axios from"axios"
export default function LoginPage({ onBack, onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit =async (e) => {
    e.preventDefault();
try{ const response =await axios.post("http://localhost:5000/api/v1/user/login",{
    
    email,password
  })


const { token, user } = response.data;
localStorage.setItem("authorization", token);

alert("You have logged in successfully");
const name=user.username
onSuccess({ name, email: user.email });
    
    
    
    onSuccess({ name, email }); // send user data to App
  }catch(e){
    console.log("error occured in signup",e)
  }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-700">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  className="p-2 border rounded" required />
          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Login
          </button>
        </form>

        <button onClick={onSwitch} className="mt-4 text-blue-600 underline text-sm">
          Don’t have an account? Sign Up
        </button>
        <button onClick={onBack} className="mt-2 w-full py-2 bg-gray-200 rounded">
          Back
        </button>
      </div>
    </div>
  );
}