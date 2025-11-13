import { Copyright } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const companyLinks = [
    { name: "Leaderboard" },
    { name: "Maps" },
    { name: "Blog", path: "/blogs" },
  ];

  const socialMedia = [
    {
      name: "X",
      icon: "/images/x-icon.svg",
      url: "https://x.com/RallyTyper",
      color: "hover:text-white",
    },
    {
      name: "Instagram",
      icon: "/images/instagram-icon.svg",
      url: "https://www.instagram.com/rallytyper1",
      color: "hover:text-pink-500",
    },
    {
      name: "Facebook",
      icon: "/images/facebook-icon.svg",
      url: "https://www.facebook.com/people/Rally-Typer/100089588555558/?is_tour_dismissed=true",
      color: "hover:text-blue-500",
    },
  ];

  // scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // agar user kisi aur page par hai (e.g. /blogs), pehle home pe le jao
      navigate("/");
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-linear-to-r from-black to-brand">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "url('/images/bg-hero.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/images/logo.svg"
                alt="RallyTyper Logo"
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Get ready for a high-speed challenge where your typing skills
              determine your success! Compete in thrilling races, challenge
              players from around the world, and climb the global leaderboard,
              it's a free typing game online that helps you improve with every
              race!
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  {link.name === "Leaderboard" ? (
                    <button
                      onClick={() => scrollToSection("leaderboard-section")}
                      className="cursor-pointer text-white/80 hover:text-[#F25A06] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </button>
                  ) : link.name === "Maps" ? (
                    <button
                      onClick={() => scrollToSection("maps")}
                      className="cursor-pointer text-white/80 hover:text-[#F25A06] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className="cursor-pointer text-white/80 hover:text-[#F25A06] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Follow us on:</h3>
            <div className="flex gap-4 mb-6">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-lg bg-brand-dark-1 flex items-center justify-center transition-all duration-300 hover:bg-[#F25A06] hover:scale-110`}
                  aria-label={social.name}
                >
                  <img
                    src={social.icon}
                    alt={`${social.name} icon`}
                    className={`object-contain ${
                      social.name === "X" ? "invert w-6 h-6" : "w-8 h-8"
                    }`}
                  />
                </a>
              ))}
            </div>
            <p className="text-white/80 text-sm max-w-xs">
              Follow Up on X, Instagram and Facebook and share your typing
              journey with friends and family
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-500 mt-12 pt-6 text-center">
          <p className="flex items-center justify-center gap-1 text-gray-400 text-sm font-medium">
            <Copyright className="w-4 h-4 mb-0.5" />
            <span>
              {new Date().getFullYear()} Rally Typer. All rights reserved.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
