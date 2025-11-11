import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { BLOGS_SERVER_URL } from "@/constants/site";
import { formatDate } from "@/lib/utils";
import Loader from "@/components/common/Loader";

const BlogDetails = () => {
  const { slug } = useParams();
  console.log(slug);
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    fetch(`${BLOGS_SERVER_URL}/fetch-blog-post-by-slug/${slug}`)
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // return the parsed JSON
      })
      .then((data) => {
        setBlogData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  console.log(blogData);
  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="min-h-screen bg-black"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      <div className="container mx-auto max-w-4xl px-6 py-16">
        {/* Category + Back */}
        <div className="flex justify-between items-center mb-6">
          <span className="inline-block bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
            Rally Typer
          </span>

          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-white/70 hover:text-brand transition-colors duration-300 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="font-medium">Back to Blogs</span>
          </button>
        </div>

        <h1 className="text-white text-4xl md:text-5xl font-semibold mb-8 leading-tight">
          {blogData?.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-brand-dark-4">
          <div className="flex items-center gap-2 text-white/70">
            <User size={18} />
            <span className="font-medium">Rally Typer Team</span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <Calendar size={18} />
            <span>{formatDate(blogData.upload_date)}</span>
          </div>

          <button className="ml-auto flex items-center gap-2 text-white/70 hover:text-brand transition-colors duration-300">
            <Share2 size={18} />
            <span className="font-medium">Share</span>
          </button>
        </div>

        {/* ✅ Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden">
          <img
            src={blogData.blogimage}
            alt={blogData.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <article
          className="prose prose-invert max-w-none mb-20 text-white"
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        ></article>
      </div>
    </div>
  );
};

export default BlogDetails;
