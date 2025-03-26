// frontend/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import { ToastContainer } from "react-toastify";

// Import components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <TasksProvider>
            <div className='min-h-screen bg-background'>
              <Navbar />
              <div className='container mx-auto px-4 py-8'>
                <Routes>
                  {/* Public Routes */}
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />

                  {/* Private Routes */}
                  <Route
                    path='/dashboard'
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/tasks'
                    element={
                      <PrivateRoute>
                        <TaskList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/tasks/new'
                    element={
                      <PrivateRoute>
                        <TaskForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/tasks/edit/:id'
                    element={
                      <PrivateRoute>
                        <TaskForm />
                      </PrivateRoute>
                    }
                  />

                  {/* Redirect */}
                  <Route
                    path='/'
                    element={<Navigate to='/dashboard' replace />}
                  />
                </Routes>
              </div>
            </div>
          </TasksProvider>
        </AuthProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
