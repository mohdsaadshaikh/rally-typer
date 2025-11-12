import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import Blogs from "@/pages/blogs";
import BlogDetails from "@/pages/blogs/blogDetails";
import HomePage from "@/pages/home";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import InsertBlog from "@/pages/admin/InsertBlog";
import EditBlog from "@/pages/admin/EditBlog";
import Login from "@/pages/admin/login/Login";
import Protectedroute from "@/pages/admin/Protectedroute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "blogs/:slug",
        element: <BlogDetails />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },

  {
    path: "/admin-blog-dashboard",
    element: (
      <Protectedroute>
        <Dashboard />
      </Protectedroute>
    ),
  },
  {
    path: "/admin-blog-dashboard/insertblog",
    element: <InsertBlog />,
  },
  {
    path: "/admin-blog-dashboard/editblog/:id",
    element: <EditBlog />,
  },
]);
