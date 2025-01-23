import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { FaGoogle, FaUserNinja } from "react-icons/fa6";
import { Button } from "flowbite-react";

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
        Welcome to the Quotation PDF Generator App
      </h1>
      <div className="flex flex-col gap-2">
        <Button color="blue" onClick={signInWithGoogle}>
          <FaGoogle className="me-2 h-4 w-4" />
          <span className="font-bold">Sign in with Google</span>
        </Button>
        <Button gradientDuoTone={"greenToBlue"} onClick={console.log}>
          <FaUserNinja className="me-2 h-4 w-4" />
          <span className="font-bold">Guest Mode</span>
        </Button>
      </div>
    </div>
  );
};

export default Login;
