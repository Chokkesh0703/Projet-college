import React, { useState } from "react";
import { googleProvider } from "../../../firebase/firebase";
import { auth } from "../../../firebase/firebase"
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../../firebase/auth";



const LoginPage = () => {
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [email, setEmail ] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  
  const onSubmit = async (e) => {
    e.preventDefault()
    if(!isSigningIn) {
        setIsSigningIn(true)
        await doSignInWithEmailAndPassword(email, password )
    }
  }

  const onGoogleSignIn = (e) =>{
    e.preventDefault();
    if(!isSigningIn) {
        setIsSigningIn(true);
        doSignInWithGoogle().catch(err => {
            setIsSigningIn(false)
        })
    }
  }

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminId === "admin" && adminPassword === "admin123") {
      alert("Admin login successful!");
      // Redirect or set admin state here
    } else {
      alert("Invalid admin credentials!");
    }
  };

  // Student login handler (Google Sign-In)
  const handleStudentLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert(`Student login successful! Welcome, ${user.displayName}`);
      navigate("/StudentHomePage");
      // Redirect or set student state here
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login Page</h1>

      {/* Admin Login Form */}
      <div style={styles.formContainer}>
        <h2>Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="text"
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Admin Login
          </button>
        </form>
      </div>

      {/* Student Login (Google Sign-In) */}
      <div style={styles.formContainer}>
        <h2>Student Login</h2>
        <button onClick={handleStudentLogin} style={styles.button}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width:"100vw",
    fontFamily: "Arial, sans-serif",
  },
  formContainer: {
    margin: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
    
    
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default LoginPage;