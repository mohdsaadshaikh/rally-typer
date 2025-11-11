import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

const BlogCard = ({ blog }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/blogs/${blog.slug}`}>
      <div
        className="relative h-[485px] bg-brand-dark-5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        {/* Gradient Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-brand/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none`}
        />

        {/* Image */}
        <div className="relative h-64 p-4 overflow-hidden">
          <img
            src={blog.blogimage}
            alt={blog.title}
            className="w-full h-full object-cover rounded-xl "
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5 relative z-20">
          {/* Category Badge */}
          <div className="mb-3 flex items-center gap-2">
            <Tag size={14} className="text-brand" />
            <span className="text-brand text-sm font-semibold uppercase tracking-wide">
              Rally Typer
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white text-2xl font-semibold mb-4 leading-tight line-clamp-3 group-hover:text-brand transition-colors duration-300">
            {blog.title}
          </h3>

          {/* Divider Line */}
          <div className="h-0.5 w-full bg-linear-to-r from-brand via-brand/50 to-transparent mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Avatar Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-brand/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-brand/50 transition-all duration-300">
                  <img
                    src={`https://i.pravatar.cc/150?u=Elizabeth_Slavin`}
                    alt="author"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="text-white/80 font-medium text-sm group-hover:text-white transition-colors duration-300">
                Admin
              </div>
            </div>

            {/* Date with Icon */}
            <div className="flex items-center gap-1.5 text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">
              <Clock size={12} />
              <span>{formatDate(blog.upload_date)}</span>
            </div>
          </div>
        </div>

        {/* Corner Accent (appears on hover) */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-brand/20 to-transparent transform origin-top-right transition-all duration-500 ${
            isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />
      </div>
    </Link>
  );
};

export default BlogCard;
