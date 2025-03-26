// frontend/src/context/AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthContext from "./AuthContObj";
import { useNavigate } from "react-router-dom";

// Initial state

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// Action types
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_ERROR = "AUTH_ERROR";
const LOGOUT = "LOGOUT";
const USER_LOADED = "USER_LOADED";

// Reducer (no localStorage side effects)
const authReducer = (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Load User
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    console.log("LoadUser token", token);
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      return; // Exit early if no token
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/user`
      );
      // toast.success(
      //   `🥳🎉  ${res.data.username} has been succesfully logged`,
      //   {
      //     duration: 3000,
      //     position: "top-center",
      //   }
      // );
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        config
      );
      localStorage.setItem("token", res.data.token); // Assuming res.data.token
      navigate("/login");

      toast.success(`🥳🎉  Your Account has been succesfully created`, {
        duration: 3000,
        position: "top-center",
      });
    } catch (err) {
      console.log("ERROR IN REGISTRATION", err);
      localStorage.removeItem("token");
      dispatch({ type: AUTH_ERROR });
      if (Array.isArray(err.response.data.errors)) {
        toast.error(
          <ol>
            {err?.response?.data?.errors.map((err, index) => (
              <li key={index}>{err.msg}</li>
            ))}{" "}
          </ol>,
          { autoClose: 3000, position: "top-center" }
        );
      }
      throw err;
    }
  };

  // Login User
  const login = async formData => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        config
      );
      console.log("Response Login Data", res.data);
      console.log("Response Login Token", res.data.logintoken);

      // toast.success(
      //   `🥳🎉 Gig Titled ${response.data.msg} has been succesfull created`,
      //   {
      //     duration: 3000,
      //     position: "top-center",
      //   }
      // );

      localStorage.setItem("token", res.data.logintoken);
      dispatch({
        type: AUTH_SUCCESS,
        payload: { token: res.data.logintoken },
      });
      await loadUser();

      toast.success(` Logged In Successfully `, {
        duration: 3000,
        position: "top-center",
      });
    } catch (err) {
      localStorage.removeItem("token");
      dispatch({ type: AUTH_ERROR });
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT });
    toast.info(` Logged out Successfully `, {
      duration: 3000,
      position: "top-center",
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await loadUser();
      } else {
        dispatch({ type: AUTH_ERROR }); // Set isAuthenticated to false if no token
      }
    };
    initializeAuth();
  }, []);

  //Placed the AuthContext in separate file to resolve production issues.

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
