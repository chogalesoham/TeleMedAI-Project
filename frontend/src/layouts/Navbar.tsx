import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Types
interface NavLink {
  label: string;
  href: string;
}

interface UserType {
  label: string;
  value: 'patient' | 'doctor';
}

// Constants
const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Patients', href: '#for-patients' },
  { label: 'For Doctors', href: '#for-doctors' },
  { label: 'Contact', href: '#contact' },
];

const USER_TYPES: UserType[] = [
  { label: 'Patient', value: 'patient' },
  { label: 'Doctor', value: 'doctor' },
];

// Motion Variants
const mobileMenuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    },
  },
};

const mobileMenuItemVariants = {
  closed: { x: 50, opacity: 0 },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  }),
};

const dropdownVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 30,
    },
  },
};

const underlineVariants = {
  initial: { width: 0 },
  hover: { width: '100%' },
};

// Components
interface DropdownMenuProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (type: 'patient' | 'doctor') => void;
  className?: string;
}

const DropdownMenu = ({ label, isOpen, onToggle, onSelect, className = '' }: DropdownMenuProps) => {
  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        variant={label === 'Login' ? 'ghost' : 'default'}
        className={`flex items-center gap-1 ${className}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${label} menu`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
            role="menu"
            aria-orientation="vertical"
          >
            {USER_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => onSelect(type.value)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors focus:bg-gray-100 focus:outline-none"
                role="menuitem"
                tabIndex={0}
              >
                {label} as {type.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface NavLinkItemProps {
  link: NavLink;
  onClick?: () => void;
  onNavigate: (href: string) => void;
  isMobile?: boolean;
  index?: number;
}

const NavLinkItem = ({ link, onClick, onNavigate, isMobile = false, index = 0 }: NavLinkItemProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate(link.href);
    onClick?.();
  };

  if (isMobile) {
    return (
      <motion.a
        href={link.href}
        custom={index}
        variants={mobileMenuItemVariants}
        onClick={handleClick}
        className="block px-6 py-3 text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
        tabIndex={0}
      >
        {link.label}
      </motion.a>
    );
  }

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
      tabIndex={0}
    >
      {link.label}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-blue-600"
        variants={underlineVariants}
        initial="initial"
        whileHover="hover"
        transition={{ duration: 0.3 }}
      />
    </a>
  );
};

// Main Navbar Component
export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Smooth scroll to section
  const smoothScrollToSection = (elementId: string) => {
    const element = document.querySelector(elementId);
    if (element) {
      const headerOffset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Handle navigation with smooth scroll
  const handleNavigation = (href: string) => {
    // If it's a hash link (section on current page)
    if (href.startsWith('#')) {
      // If we're not on the home page, navigate to home first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          smoothScrollToSection(href);
        }, 100);
      } else {
        smoothScrollToSection(href);
      }
    } else {
      // Regular page navigation
      navigate(href);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsLoginOpen(false);
        setIsSignupOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[role="menu"]') && !target.closest('[aria-haspopup="true"]')) {
        setIsLoginOpen(false);
        setIsSignupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthSelect = (action: 'login' | 'signup', userType: 'patient' | 'doctor') => {
    // Close all dropdowns
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    
    // Build the route path
    const route = `/${userType}-${action}`;
    
    // Navigate to the appropriate auth page
    navigate(route);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleNavigation('#home');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={handleLogoClick}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              tabIndex={0}
              aria-label="TeleMedAI Home"
            >
              <img
                src="/favicon.png"
                alt="TeleMedAI Logo"
                className="h-10 w-10 lg:h-14 lg:w-14 object-contain"
              />
              <span className="text-xl lg:text-2xl font-bold text-gray-900">
                TeleMed<span className="text-blue-600">AI</span>
              </span>
            </motion.a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <NavLinkItem key={link.href} link={link} onNavigate={handleNavigation} />
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <DropdownMenu
                label="Login"
                isOpen={isLoginOpen}
                onToggle={() => {
                  setIsLoginOpen(!isLoginOpen);
                  setIsSignupOpen(false);
                }}
                onSelect={(type) => handleAuthSelect('login', type)}
              />
              <DropdownMenu
                label="Sign Up"
                isOpen={isSignupOpen}
                onToggle={() => {
                  setIsSignupOpen(!isSignupOpen);
                  setIsLoginOpen(false);
                }}
                onSelect={(type) => handleAuthSelect('signup', type)}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/logo.png"
                      alt="TeleMedAI Logo"
                      className="h-8 w-8 object-contain"
                    />
                    <span className="text-xl font-bold text-gray-900">
                      TeleMed<span className="text-blue-600">AI</span>
                    </span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 py-6" aria-label="Mobile navigation">
                  {NAV_LINKS.map((link, index) => (
                    <NavLinkItem
                      key={link.href}
                      link={link}
                      onClick={closeMobileMenu}
                      onNavigate={handleNavigation}
                      isMobile
                      index={index}
                    />
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <motion.div
                  className="p-6 border-t border-gray-200 space-y-3"
                  custom={NAV_LINKS.length}
                  variants={mobileMenuItemVariants}
                  initial="closed"
                  animate="open"
                >
                  <DropdownMenu
                    label="Login"
                    isOpen={isLoginOpen}
                    onToggle={() => {
                      setIsLoginOpen(!isLoginOpen);
                      setIsSignupOpen(false);
                    }}
                    onSelect={(type) => {
                      handleAuthSelect('login', type);
                      closeMobileMenu();
                    }}
                    className="w-full"
                  />
                  <DropdownMenu
                    label="Sign Up"
                    isOpen={isSignupOpen}
                    onToggle={() => {
                      setIsSignupOpen(!isSignupOpen);
                      setIsLoginOpen(false);
                    }}
                    onSelect={(type) => {
                      handleAuthSelect('signup', type);
                      closeMobileMenu();
                    }}
                    className="w-full"
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
