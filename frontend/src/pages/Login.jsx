// frontend/src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      const errorMessages =
        err.response?.data?.errors ||
        (err.response?.data?.msg ? [{ msg: err.response.data.msg }] : []);

      const errorObj = {};
      errorMessages.forEach(error => {
        if (error.param) {
          errorObj[error.param] = error.msg;
        } else {
          errorObj.general = error.msg;
        }
      });

      setErrors(errorObj);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='bg-white p-8 rounded-xl shadow-custom w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-6 text-primary'>
          Login to Task Manager
        </h2>

        <form onSubmit={onSubmit} className='space-y-4'>
          {errors.general && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
              role='alert'
            >
              {errors.general}
            </div>
          )}

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Email Address
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              name='email'
              value={email}
              onChange={onChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Password
            </label>
            <input
              type='password'
              placeholder='Enter your password'
              name='password'
              value={password}
              onChange={onChange}
              minLength='6'
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition duration-300 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className='text-center mt-4'>
            <p className='text-text-light'>
              Don't have an account?{" "}
              <Link to='/register' className='text-primary hover:underline'>
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
