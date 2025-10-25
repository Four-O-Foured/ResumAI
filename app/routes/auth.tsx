import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "ResumAI | Auth" },
  { name: "description", content: "LogIn to Start your job journey" },
];
const auth = () => {
    const{isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);
    
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover flex items-center justify-center min-h-screen">
      <div className="gradient-border shadow-lg">
        <div className="flex flex-col bg-white rounded-2xl p-10">
          <div className="flex flex-col gap-2 items-center">
            <h1>Welcome</h1>
            <h2>
              LogIn to Start your job journey
            </h2>
          </div>
          {isLoading ? (
            <button className="mt-4 auth-button animate-pulse"><p>Signing you in.....</p></button>
          ): <>
          {auth.isAuthenticated ? (
            <button className="mt-4 auth-button" onClick={auth.signOut}><p>Log Out</p></button>
          ) : (
            <button className="mt-4 auth-button" onClick={auth.signIn}><p>LogIn</p></button>
          )}
          </>}
        </div>
      </div>
    </main>
  );
};

export default auth;
