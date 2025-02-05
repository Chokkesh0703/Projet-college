import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginPage from "../auth/login";

const StudentHomePage = () => {
    const navigate = useNavigate();

    
        // Check if the user is logged in
         useEffect(()=>{
                const unsubscride = onAuthStateChanged(auth, initializeUser);
                return unsubscride;
            }, [initializeUser])
        
            async function initializeUser(user) {
                if (!user) {
                    setCurrentUser(null);
                    setUserLoggedIn(false);
                    navigate("/LoginPage ");
                }
            }
           
           
    

    const handleRegistration = () => {
        alert("Redirecting to registration page...");
        // Add logic to navigate to the registration page
    };

    return (
        <div style={styles.container}>
            <h1>Welcome to the Home Page!</h1>
            <p>You have successfully logged in as a student.</p>
            <button onClick={handleRegistration} style={styles.button}>
                Register Now
            </button>
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
        fontFamily: "Arial, sans-serif",
    },
    button: {
        padding: "10px 20px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default StudentHomePage;

// import React from "react";

// const StudentHomePage = () => {
//   return (
//     <div>
//       <h1>Welcome to the Student Home Page!</h1>
//       <p>You are logged in as a student.</p>
//     </div>
//   );
// };

// export default StudentHomePage;

