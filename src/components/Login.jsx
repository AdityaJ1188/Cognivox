import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  
  const emailRef = useRef();
  const passwordRef = useRef();
  

  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); 

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      toast.success("Sign in successfully 🎉");
      navigate("/chat", { replace: true });
    } catch {
      toast.error("Failed to Sign in ❌");
    }

    setLoading(false);
  }

  return (
     <div className="bg-zinc-900 min-h-full">
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10 text-white">
        <section className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-6 sm:p-8">
          <div className="xl:mx-auto p-4 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Log In to Cognivox
            </h2>
            {/* <p className="mt-2 text-base ">Already have an account? Sign In</p> */}


            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
             
              <div>
                <label className="text-base font-medium ">Email address</label>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  ref={emailRef}
                  className="mt-2 flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="text-base font-medium">Password</label>
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  ref={passwordRef}
                  className="mt-2 flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

             

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 h-10 bg-white text-black border border-gray-300 rounded-full font-semibold  transition hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
