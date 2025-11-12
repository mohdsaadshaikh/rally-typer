// src/pages/admin/InsertBlog.jsx
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminNav from "./AdminNav";
import { BLOGS_SERVER_URL } from "../../constants/site";
import imageCompression from "browser-image-compression";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug is required."),
  canonical_tag: z.string().min(3, "Canonical tag is required."),
  meta_title: z.string().min(3).max(60),
  meta_description: z.string().min(10).max(160),
  meta_keywords: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9, ]+$/),
  blogimage: z.any().refine((file) => file?.length === 1, "Image is required."),
  content: z.string().min(20, "Content must be at least 20 characters."),
});

const InsertBlog = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      canonical_tag: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      content: "",
    },
  });

  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  const slugify = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleTitleBlur = (title) => {
    const slug = slugify(title);
    if (!watch("slug")) setValue("slug", slug);
    if (!watch("canonical_tag")) setValue("canonical_tag", slug);
  };

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const quill = quillRef.current?.getEditor();
      const range = quill.getSelection() || { index: 0 };

      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.01,
          maxWidthOrHeight: 300,
          initialQuality: 0.6,
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          const sizeKB = Math.round((base64.length * 3) / 4 / 1024);

          if (sizeKB > 10) {
            toast.error("Image too big. Try a smaller one.");
            return;
          }

          quill.insertEmbed(range.index, "image", base64);
          quill.setSelection(range.index + 1);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error(error);
        toast.error("Image processing failed");
      }
    };
  };
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // blogimage → File object (not base64)
      if (values.blogimage?.[0]) {
        formData.append("blogimage", values.blogimage[0]); // File object
      }

      // Baaki sab string
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("canonical_tag", values.canonical_tag);
      formData.append("meta_title", values.meta_title);
      formData.append("meta_description", values.meta_description);
      formData.append("meta_keywords", values.meta_keywords);
      formData.append("content", values.content); // HTML with base64 images

      await axios.post(`${BLOGS_SERVER_URL}/insertblogpost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog inserted successfully!");
      navigate("/admin-blog-dashboard");
    } catch (error) {
      console.error("Submit error:", error.response?.data || error);
      toast.error("Image upload failed. Try smaller image (<5MB).");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Add New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter Blog Title"
                  onBlur={(e) => handleTitleBlur(e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Slug + Canonical */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="my-blog-post"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="canonical_tag">Canonical Tag</Label>
                  <Input id="canonical_tag" {...register("canonical_tag")} />
                  {errors.canonical_tag && (
                    <p className="text-red-500 text-sm">
                      {errors.canonical_tag.message}
                    </p>
                  )}
                </div>
              </div>

              {/* SEO */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input id="meta_title" {...register("meta_title")} />
                  {errors.meta_title && (
                    <p className="text-red-500 text-sm">
                      {errors.meta_title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    {...register("meta_description")}
                  />
                  {errors.meta_description && (
                    <p className="text-red-500 text-sm">
                      {errors.meta_description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Keywords + Featured Image */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    {...register("meta_keywords")}
                    placeholder="keyword1, keyword2"
                  />
                  {errors.meta_keywords && (
                    <p className="text-red-500 text-sm">
                      {errors.meta_keywords.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="blogimage">Featured Image</Label>
                  <Input
                    id="blogimage"
                    type="file"
                    accept="image/*"
                    {...register("blogimage")}
                  />
                  {errors.blogimage && (
                    <p className="text-red-500 text-sm">
                      {errors.blogimage.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Quill Editor with Default Toolbar */}
              <div className="space-y-2">
                <Label>Page Content</Label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={watch("content")}
                  onChange={(value) => setValue("content", value)}
                  modules={modules}
                  placeholder="Write from the heart"
                  className="h-64"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm -mt-10">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-16">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin-blog-dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InsertBlog;
