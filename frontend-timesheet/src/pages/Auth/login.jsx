import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/timesheetService';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [user_email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const responseData = await loginUser(user_email, password);
        console.log('responseData', responseData)
        
        setIsLoading(false);

        if (responseData && responseData.data) {
                login(responseData.data);
                navigate('/');
            } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Sign in to TimeApp</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Welcome back! Please enter your details.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label htmlFor="user_email" className="text-sm font-medium text-gray-700">Email address</label>
                    <input
                        id="user_email"
                        name="user_email"
                        type="user_email"
                        autoComplete="user_email"
                        required
                        value={user_email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your Password"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;