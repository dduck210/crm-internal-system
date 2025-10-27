import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fixed left-0 bottom-0 w-full z-50 bg-blue-600 dark:bg-gray-900 text-white shadow transition min-h-[52px] flex items-center">
      <div className="container mx-auto flex items-center justify-between min-h-[60px] px-3">
        <span className="text-2xl font-bold whitespace-nowrap">
          <Link
            to="/"
            className="hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            Internal CRM System
          </Link>
        </span>

        <span className="text-xs bg-white/30 dark:bg-gray-700/50 rounded px-2 py-1 transition">
          © 2025 Internal CRM System™. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
