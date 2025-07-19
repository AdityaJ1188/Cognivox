import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";

export default function Resetpassword() {
  const emailRef = useRef();
  const { resetpassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    if (!email) return;

    try {
      setLoading(true);
      await resetpassword(email);
      setShowDialog(true);
    } catch (err) {
      console.error("RESET ERROR:", err.code, err.message);
      toast.error(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900 min-h-full">
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10 text-white">
        <section className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-6 sm:p-8">
          <div className="xl:mx-auto p-4 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Reset your password
            </h2>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-base font-medium">Email address</label>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  ref={emailRef}
                  required
                  className="mt-2 flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 h-10 bg-white text-black border border-gray-300 rounded-full font-semibold transition hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                >
                  Reset Password
                </button>
              </div>
            </form>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

              <AlertDialogContent className="z-50 w-full max-w-sm bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-5 sm:p-7 min-h-[230px] flex flex-col items-center justify-center">
                <AlertDialogHeader className="text-center">
                  <AlertDialogTitle className="text-xl font-bold text-white">
                    Check Your Email
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300 mt-2 text-sm">
                    A password reset link has been sent to your email.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-5 flex justify-center w-full">
                  <AlertDialogAction
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="inline-flex items-center justify-center px-5 py-2 bg-white text-black border border-gray-300 rounded-full font-semibold transition hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                  >
                    Go to Login
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </div>
  );
}
