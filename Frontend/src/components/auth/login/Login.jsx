import Header from "@/components/common/Header";
import LoginTabs from "@/components/auth/login/index";
import React from "react";
import Footer from "@/components/common/Footer";

function Login() {
  return (
    <div  className="w-full">
        <Header />
        <LoginTabs />
      <Footer />
    </div>
  );
}

export default Login;
