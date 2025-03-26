// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useAuth, AuthProvider } from "../context/AuthContext";

const Dashboard = () => {
  console.log("Dashboard rendered");
  const { tasks, getTasks, loading } = useTasks();
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (!loading && tasks) {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(
        task => task.status === "Completed"
      ).length;
      const pendingTasks = totalTasks - completedTasks;

      setSummary({
        totalTasks,
        completedTasks,
        pendingTasks,
      });
    }
  }, [tasks, loading]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-primary'>
        Welcome, {user?.username}
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Task Summary Cards */}
        <div className='bg-white shadow-custom rounded-lg p-6 text-center'>
          <h2 className='text-xl font-semibold text-text-light mb-4'>
            Total Tasks
          </h2>
          <p className='text-4xl font-bold text-primary'>
            {summary.totalTasks}
          </p>
        </div>

        <div className='bg-white shadow-custom rounded-lg p-6 text-center'>
          <h2 className='text-xl font-semibold text-text-light mb-4'>
            Completed Tasks
          </h2>
          <p className='text-4xl font-bold text-green-500'>
            {summary.completedTasks}
          </p>
        </div>

        <div className='bg-white shadow-custom rounded-lg p-6 text-center'>
          <h2 className='text-xl font-semibold text-text-light mb-4'>
            Pending Tasks
          </h2>
          <p className='text-4xl font-bold text-red-500'>
            {summary.pendingTasks}
          </p>
        </div>
      </div>

      <div className='mt-8 flex justify-center space-x-4'>
        <Link
          to='/tasks/new'
          className='bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300'
        >
          Create New Task
        </Link>
        <Link
          to='/tasks'
          className='bg-secondary text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300'
        >
          View All Tasks
        </Link>
      </div>

      {/* Quick Links or Recent Tasks Section could be added here */}
    </div>
  );
};

export default Dashboard;
