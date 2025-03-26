// frontend/src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const { username, email, password, confirmPassword } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Client-side validation
    const newErrors = {};
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await register({ username, email, password });
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
          Create an Account
        </h2>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Username
            </label>
            <input
              type='text'
              placeholder='Choose a username'
              name='username'
              value={username}
              onChange={onChange}
              required
              minLength='3'
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {errors.username && (
              <p className='text-red-500 text-xs mt-1'>{errors.username}</p>
            )}
          </div>

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
              placeholder='Create a password'
              name='password'
              value={password}
              onChange={onChange}
              required
              minLength='6'
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

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Confirm Password
            </label>
            <input
              type='password'
              placeholder='Confirm your password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={onChange}
              required
              minLength='6'
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.confirmPassword}
              </p>
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
            {loading ? "Creating Account..." : "Register"}
          </button>

          <div className='text-center mt-4'>
            <p className='text-text-light'>
              Already have an account?{" "}
              <Link to='/login' className='text-primary hover:underline'>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
