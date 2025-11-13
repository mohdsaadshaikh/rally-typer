// src/pages/admin/EditBlog.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminNav from "./AdminNav";
import { BLOGS_SERVER_URL } from "../../constants/site";

import imageCompression from "browser-image-compression";

// Import Quill
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
  blogimage: z.any().optional(), // Optional on edit
  content: z.string().min(20, "Content must be at least 20 characters."),
});

const EditBlog = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
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

  const { register, handleSubmit, setValue, watch, formState, reset } = form;
  const { errors } = formState;

  // Auto-slugify
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
        // Compress to ≤ 10KB
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.01, // 10KB
          maxWidthOrHeight: 300, // Small size
          initialQuality: 0.6,
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          const sizeKB = Math.round((base64.length * 3) / 4 / 1024);

          if (sizeKB > 10) {
            toast.error("Image too big. Try smaller one.");
            return;
          }

          quill.insertEmbed(range.index, "image", base64);
          quill.setSelection(range.index + 1);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Compression failed:", error);
        toast.error("Failed to process image");
      }
    };
  };

  // Quill modules
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BLOGS_SERVER_URL}/fetch-blog-post/${id}`
        );
        const data = response.data;

        reset({
          title: data.title || "",
          slug: data.slug || "",
          canonical_tag: data.canonical_tag || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          meta_keywords: data.meta_keywords || "",
          content: data.content || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, reset]);

  // Submit
  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // blogimage → File (only if new file selected)
      if (values.blogimage?.[0]) {
        formData.append("blogimage", values.blogimage[0]);
      }

      // All other fields
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("canonical_tag", values.canonical_tag);
      formData.append("meta_title", values.meta_title);
      formData.append("meta_description", values.meta_description);
      formData.append("meta_keywords", values.meta_keywords);
      formData.append("content", values.content);

      await axios.put(`${BLOGS_SERVER_URL}/update-blog-post/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated successfully!");
      navigate("/admin-blog-dashboard");
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Update failed. Try smaller image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="max-w-5xl mx-auto py-8 sm:px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Edit Blog Post</CardTitle>
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
                  <Label htmlFor="blogimage">
                    Featured Image (leave blank to keep current)
                  </Label>
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

              {/* Quill Editor */}
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
              <div className="flex gap-4 mt-20">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Updating..." : "Update"}
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

export default EditBlog;
