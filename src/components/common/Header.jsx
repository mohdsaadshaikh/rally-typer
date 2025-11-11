import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Playnow", path: "/#game" },
    { name: "Blogs", path: "/blogs" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  const handleNavClick = (e, path) => {
    if (path.includes("#")) {
      e.preventDefault();
      const hash = path.split("#")[1];

      if (location.pathname === "/") {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(`/${hash ? `#${hash}` : ""}`);
      }
    }
  };

  return (
    <header className="relative z-50">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/header-bg.svg')" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-brand-dark-3 via-brand-dark-3/90 to-transparent opacity-90" />

      <div className="relative z-10 px-6 lg:px-14 py-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.svg"
              alt="RallyTyper Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 lg:gap-15">
            <ul className="flex items-center gap-10 lg:gap-15">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className={`font-semibold text-lg transition-colors duration-300 ${
                      isActive(link.path)
                        ? "text-[#F25A06]"
                        : "text-white hover:text-[#F25A06]"
                    }`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* Post on X */}
              <li>
                <a
                  href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#F25A06] font-semibold text-lg transition-colors duration-300"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Post on X
                </a>
              </li>
            </ul>

            {/* Go Fund Me Button */}
            <a
              href="https://gofund.me/e3d15162"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F25A06] text-white font-semibold rounded-md px-4 py-2 hover:bg-[#d94e05] transition-colors duration-300"
            >
              Go Fund Me
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#F25A06] transition-colors duration-300"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  handleNavClick(e, link.path);
                  setIsMenuOpen(false);
                }}
                className={`font-semibold text-lg ${
                  isActive(link.path)
                    ? "text-[#F25A06]"
                    : "text-white hover:text-[#F25A06]"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {link.name}
              </Link>
            ))}

            {/* Post on X */}
            <a
              href="https://twitter.com/share?ref_src=twsrc%5Etfw"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-[#F25A06] font-semibold text-lg"
            >
              Post on X
            </a>

            {/* Go Fund Me */}
            <a
              href="https://gofund.me/e3d15162"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F25A06] text-white font-semibold rounded-md px-4 py-2 text-center hover:bg-[#d94e05] transition-colors duration-300"
            >
              Go Fund Me
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
