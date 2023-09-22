import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout } = useAuth0();
  useEffect(() => {
    const token = localStorage.getItem("token")!;
    if (!isLoading) {
      if (isAuthenticated === false && token === "") {
        navigate("/");
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <h1>
      Dashboard
      <Button onClick={() => logout()}>Logout</Button>
    </h1>
  );
};

export default Dashboard;
