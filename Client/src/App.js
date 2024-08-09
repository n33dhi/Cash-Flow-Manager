import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './Utilities/errorBoundary';
import AuthenticatedRoute from './Utilities/authenticateRoute';
import MainLayout from './Utilities/mainLayout.js';

const Register = lazy(() => import('./pages/register.js'));
const Login = lazy(() => import('./pages/login.js'));
const ForgetPassword = lazy(() => import('./pages/forgotPassword.js'));
const Home = lazy(() => import('./pages/home.js'));
const RequestForm = lazy(() => import('./pages/request.js'));
const History = lazy(() => import('./pages/history.js'));
const Dashboard = lazy(() => import('./pages/dashboard.js'));
const Users = lazy(() => import('./pages/users.js'));
const Requests = lazy(() => import('./pages/requests.js'));
const UserDetail = lazy(() => import('./pages/userDetail.js'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgetPassword" element={<ForgetPassword />} />
              <Route path="/cashQuester/home" element={<AuthenticatedRoute><MainLayout><Home /></MainLayout></AuthenticatedRoute>} />
              <Route path="/cashQuester/request" element={<AuthenticatedRoute><MainLayout><RequestForm /></MainLayout></AuthenticatedRoute>} />
              <Route path="/cashQuester/history" element={<AuthenticatedRoute><MainLayout><History /></MainLayout></AuthenticatedRoute>} />
              <Route path="/cashMaster/dashboard" element={<AuthenticatedRoute><MainLayout><Dashboard /></MainLayout></AuthenticatedRoute>} />
              <Route path="/cashMaster/users" element={<AuthenticatedRoute><MainLayout><Users /></MainLayout></AuthenticatedRoute>} />
              <Route path="/cashMaster/user/:userId" element={<AuthenticatedRoute><MainLayout><UserDetail /></MainLayout></AuthenticatedRoute>} />
              <Route path="/cashMaster/requests" element={<AuthenticatedRoute><MainLayout><Requests /></MainLayout></AuthenticatedRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
