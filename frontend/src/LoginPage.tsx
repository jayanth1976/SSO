import styled from "@emotion/styled";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getToken } from "./services";
import { useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import { useAuth0 } from "@auth0/auth0-react";

const StyledWrapper = styled(Paper)(`
    margin:5rem auto;
    text-align:center;
    padding:30px;
    width:30vw;
    .MuiTextField-root{
        margin-top:20px;
    }
    .MuiButton-root{
        margin-top:15px;
        text-transform:capitalize;
    }
`);

const ImageContainer = styled(Paper)(`
    position:relative;
    cursor:pointer;
    transform:translateX(-50%);
    left:50%;
    border-radius:.5rem;
    padding:12px;
    display:inline-block;
    img{
      width:50px;
    }
`);

interface LoginDetails {
  username: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isMyTokenExpired = isExpired(token!);
    if (!isMyTokenExpired) navigate("/dashboard");
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const [err, setErr] = useState<boolean>(false);

  return (
    <>
      <StyledWrapper elevation={24}>
        <Typography variant="h4">Login</Typography>
        <Box>
          <TextField
            label="Username"
            name="username"
            fullWidth
            value={loginDetails.username}
            onChange={(e) =>
              setLoginDetails((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
            required
          />
          <TextField
            label="Password"
            fullWidth
            name="password"
            type="password"
            onChange={(e) =>
              setLoginDetails((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          />
          <Button
            variant="contained"
            disabled={!(loginDetails.username && loginDetails.password)}
            onClick={() => {
              getToken({
                email: loginDetails.username,
                password: loginDetails.password,
              })
                .then((res) => {
                  navigate("/dashboard");
                  localStorage.setItem("token", res.token);
                })
                .catch(() => {
                  setErr(true);
                });
            }}
          >
            Login
          </Button>
          {err && (
            <Typography variant="h5" color={"red"}>
              Invalid credentials
            </Typography>
          )}
        </Box>
      </StyledWrapper>
      <ImageContainer
        elevation={12}
        onClick={() =>
          loginWithRedirect({
            authorizationParams: {
              connection: "google-oauth2",
              redirect_uri: window.location.origin + "/dashboard",
            },
            appState: {
              returnTo: "/dashboard",
            },
          })
        }
      >
        <img src="/assets/images/google.svg" />
      </ImageContainer>
    </>
  );
};

export default LoginPage;
