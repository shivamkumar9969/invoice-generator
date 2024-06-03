import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetPasswordMessage, setResetPasswordMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false); // Track if "Forgot Password?" link is clicked
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/forget-password`, { email });
            setResetPasswordMessage('Password reset email sent. Please check your inbox.');
        } catch (error) {
            console.error('Password reset error:', error);
            setError('Failed to send password reset email. Please try again. Check email is valid or register.');
        }
    };
    const handleClick = () => {

        navigate('/add-product');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/login`, { email, password });

            const token = response.data.token;
            localStorage.setItem('token', token);
            handleClick()
            onLogin()

        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        }
    };

    return (
        <>
            <div className="flex justify-center items-center md:items-start  h-screen  bg-[#fcfcfc] ">
                <div className="w-full h-2/3 md:h-2/2 lg:h-1/2 max-w-md bg-opacity-70 bg-white md:mt-28 rounded-2xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
                    {error && <p className="text-red-900 mb-4 text-sm">{error}</p>}
                    {resetPasswordMessage && <p className="text-black mb-4 text-sm">{resetPasswordMessage}</p>}
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-gray-800 font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="w-full bg-transparent bg-opacity-50 border-b-2 border-stone-600 focus:outline-none transition duration-300 px-4 py-2 rounded-lg"
                                required
                            />
                        </div>
                        {!showForgotPassword && (
                            <div className='' >
                                <label htmlFor="password" className="block text-gray-800 font-semibold  mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    className="w-full bg-transparent bg-opacity-50 border-b-2 border-stone-600 focus:outline-none transition duration-300 px-4 py-2 rounded-lg"
                                    required
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            {showForgotPassword ? (
                                <button
                                    type="submit"
                                    onClick={handleResetPassword}
                                    className="bg-stone-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-stone-800 focus:outline-none  transition duration-300"
                                >
                                    Reset Password
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    onClick={handleLogin}
                                    className="mt-2 bg-stone-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-stone-800 focus:outline-none transition duration-300"
                                >
                                    Login
                                </button>
                            )}
                            {!showForgotPassword && (
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className=" text-stone-800 font-semibold hover:underline focus:outline-none focus:underline transition duration-300"
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                    </form>
                    {!showForgotPassword && (
                        <div className="text-center flex flex-col mt-2 lg:xl:2xl:mt-14">
                            <p className="text-gray-900">Don't have an account? <Link to="/register" className="text-neutral-800 font-semibold    transition duration-300">Register</Link></p>
                        </div>
                    )}
                    {showForgotPassword && (
                        <div className="text-center flex flex-col lg:mt-12 lg:xl:2xl:mt-14">
                            <p className="text-gray-900">Remembered your password? <button onClick={() => setShowForgotPassword(false)} className="text-stone-800 font-semibold hover:underline focus:outline-none focus:underline transition duration-300">Login</button></p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginForm;