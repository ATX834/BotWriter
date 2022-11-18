import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Home from "./screens/Home";
import Login from "./screens/User/Login";
import Signup from "./screens/User/Signup";
import { useAuth } from "./hooks/useAuth";
import Logout from "./screens/User/Logout";
import MainBody from "./components/MainBody";
import Confirm from "./screens/User/Confirm";
import Reset from "./screens/User/Reset";
import Resend from "./screens/User/Resend";
import Forgot from "./screens/User/Forgot";
import CreateSampleLetter from "./screens/SampleLetter/CreateSampleLetter";
import GenerateLetter from "./screens/SampleLetter/GenerateLetter";

export default function Router(): JSX.Element {
  const { isLogged } = useAuth();

  return (
    <Box color="text.main">
      <BrowserRouter>
        <Navbar />
        <MainBody>
          <Routes>
            <Route path="/" element={isLogged ? <Dashboard /> : <Home />} />
            <Route
              path="/home"
              element={isLogged ? <Navigate to="/" replace /> : <Home />}
            />
            <Route
              path="/user/reset/:token"
              element={isLogged ? <Navigate to="/" replace /> : <Reset />}
            />
            <Route
              path="/resend"
              element={isLogged ? <Navigate to="/" replace /> : <Resend />}
            />
            <Route
              path="/user/forgot"
              element={isLogged ? <Navigate to="/" replace /> : <Forgot />}
            />
            <Route
              path="/dashboard"
              element={isLogged ? <Dashboard /> : <Navigate to="/" replace />}
            />
            <Route
              path="/sample-letter/new"
              element={
                isLogged ? <CreateSampleLetter /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/generate"
              element={
                isLogged ? <GenerateLetter /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/signup"
              element={isLogged ? <Navigate to="/" replace /> : <Signup />}
            />
            <Route
              path="/logout"
              element={isLogged ? <Logout /> : <Navigate to="/" replace />}
            />
            <Route path="/user/confirm/:token" element={<Confirm />} />
            <Route
              path="/login"
              element={isLogged ? <Navigate to="/" replace /> : <Login />}
            />
          </Routes>
        </MainBody>
      </BrowserRouter>
    </Box>
  );
}
