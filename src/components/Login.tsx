import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import GoogleIcon from "./icons/GoogleIcon";

const Login = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-extrabold text-center">
        Welcome to the Invoice/Quotation Generator App
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        onClick={signInWithGoogle}
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
