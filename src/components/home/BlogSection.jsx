import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { BLOGS_SERVER_URL } from "@/constants/site";
import Loader from "../common/Loader";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${BLOGS_SERVER_URL}/fetch-blog-posts`)
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data.slice(0, 3));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-6xl">
        <h2
          className="text-white text-4xl md:text-6xl text-center font-medium mb-16"
          style={{ fontFamily: "Anton, sans-serif" }}
        >
          Our Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
