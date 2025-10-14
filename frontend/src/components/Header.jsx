import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = ['Home', 'Services', 'Projects', 'Contact'];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
          Solvify
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hover:text-yellow-300 transition-colors duration-300"
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
          >
            Request Project
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-500 px-4 pb-4">
          <ul className="flex flex-col gap-4 text-center font-medium">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="hover:text-yellow-300 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
              >
                Request Project
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
