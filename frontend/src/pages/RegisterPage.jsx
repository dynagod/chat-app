import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Image, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { authenticateUser } from '../features/authSlice.js';
import toast from 'react-hot-toast';


const RegisterPage = () => {
  const dispatch = useDispatch();

  const { user, error, loading } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirm: ''
  });

  const validateForm = () => {
    if (!userCredentials.fullName.trim()) return toast.error("Full name is required");
    if (!userCredentials.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(userCredentials.email)) return toast.error("Invalid email format");
    if (!userCredentials.password) return toast.error("Password is required");
    if (userCredentials.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (userCredentials.confirm !== userCredentials.password) return toast.error("Confirm password and password must be same");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const succcess = validateForm();

    if (succcess === true) dispatch(authenticateUser({route: '/api/v1/users/register', userCredentials}));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  
    if (user) {
      toast.success("User registered successfully");
      <NavLink to='/profile' />
    }
  }, [error, user]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 mb-0">
        <div className="w-full max-w-md space-y-8">

          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control mb-3">
              <label htmlFor='name' className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  id='name'
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter your name"
                  value={userCredentials.fullName}
                  onChange={(e) => setUserCredentials({ ...userCredentials, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control mb-3">
              <label htmlFor='username' className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  id='username'
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter your user name"
                  value={userCredentials.username.toLowerCase()}
                  onChange={(e) => setUserCredentials({ ...userCredentials, username: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control mb-3">
              <label htmlFor='email' className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  id='email'
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter email"
                  value={userCredentials.email.toLowerCase()}
                  onChange={(e) => setUserCredentials({ ...userCredentials, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control mb-3">
              <label htmlFor='password' className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter password"
                  value={userCredentials.password}
                  onChange={(e) => setUserCredentials({ ...userCredentials, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control mb-3">
              <label htmlFor='confirm' className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  id='confirm'
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Confirm your password"
                  value={userCredentials.confirm}
                  onChange={(e) => setUserCredentials({ ...userCredentials, confirm: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      {/* <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      /> */}
    </div>
  );
};

export default RegisterPage;