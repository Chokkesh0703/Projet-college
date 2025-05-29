import Header from "@/components/common/Header";
import LoginTabs from "@/components/auth/login/index";
import InFooter from "../../common/InFooter"

function Login() {
  return (
    <div className="w-full">
      <Header />
      <LoginTabs />
      <InFooter/>
    </div>
  );
}

export default Login;
