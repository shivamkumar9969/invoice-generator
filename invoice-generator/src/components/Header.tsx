import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="w-screen top-0 bg-[#fcfcfc] text-stone-800 py-4 h-8 md:h-16 relative">
            <div className="md:hidden absolute right-0 top-0 mt-4 mr-4 z-10">
                <button onClick={toggleMenu}>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center relative">
                <div className="logo mb-4 md:mb-0 z-10">
                    <Link to="/" className="text-xl font-bold">
                        Receipt Generator
                    </Link>
                </div>
                <nav className="hidden md:flex">
                    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                        {isLoggedIn && (
                            <li>
                                <button onClick={onLogout} className="hover:text-gray-400">
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
                {isMenuOpen && (
                    <nav className="absolute top-full right-0 bg-white shadow-md rounded-md mt-2 mr-4">
                        <ul className="flex flex-col space-y-2">
                            {isLoggedIn && (
                                <li>
                                    <button onClick={onLogout} className="hover:text-gray-400">
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
