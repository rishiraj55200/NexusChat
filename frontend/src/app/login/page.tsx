"use client";
import Loading from "@/components/Loading";
import { useAppData } from "@/context/AppContext";
import axios from "axios";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

type AuthMode = "login-otp" | "login-password" | "register";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mode, setMode] = useState<AuthMode>("login-password");
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();
  const { isAuth, loading: userLoading, setUser, setIsAuth, fetchChats, fetchUsers } = useAppData();

  const handleAuthSuccess = (data: any) => {
    Cookies.set("token", data.token, {
      expires: 15,
      secure: false,
      path: "/",
    });
    setUser(data.user);
    setIsAuth(true);
    fetchChats();
    fetchUsers();
    router.push("/chat");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login-otp") {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/v1/login`, {
          email,
        });
        toast.success(data.message);
        router.push(`/verify?email=${email}`);
      } else if (mode === "login-password") {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/v1/login-password`, {
          email,
          password,
        });
        toast.success(data.message);
        handleAuthSuccess(data);
      } else if (mode === "register") {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/v1/register-password`, {
          name,
          email,
          password,
        });
        toast.success(data.message);
        handleAuthSuccess(data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) return redirect("/chat");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              {mode === "login-otp" ? (
                <Mail size={40} className="text-white" />
              ) : (
                <Lock size={40} className="text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {mode === "register" ? "Create an Account" : "Welcome To ChatApp"}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === "register" ? "Sign up to get started" : "Sign in to continue your journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== "login-otp" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === "login-otp" ? "Sending OTP..." : "Please wait..."}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>
                    {mode === "login-otp" && "Send Verification Code"}
                    {mode === "login-password" && "Sign In"}
                    {mode === "register" && "Sign Up"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col space-y-3 text-center text-sm text-gray-400">
            {mode === "login-otp" && (
              <>
                <button onClick={() => setMode("login-password")} type="button" className="text-blue-400 hover:underline">
                  Login with Password instead
                </button>
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} type="button" className="text-blue-400 hover:underline">
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {mode === "login-password" && (
              <>
                <button onClick={() => setMode("login-otp")} type="button" className="text-blue-400 hover:underline">
                  Login with OTP instead
                </button>
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} type="button" className="text-blue-400 hover:underline">
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {mode === "register" && (
              <p>
                Already have an account?{" "}
                <button onClick={() => setMode("login-password")} type="button" className="text-blue-400 hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
