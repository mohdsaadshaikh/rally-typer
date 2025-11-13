import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BLOGS_SERVER_URL } from "../../constants/site";
import AdminNav from "./AdminNav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BLOGS_SERVER_URL}/fetch-blog-posts`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (id) => {
    navigate(`/admin-blog-dashboard/editblog/${id}`);
  };

  const handleDeleteBlog = async (id) => {
    try {
      const response = await fetch(
        `${BLOGS_SERVER_URL}/delete-blog-post/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete blog post");

      setPosts(posts.filter((post) => post.post_id !== id));
      toast.success("Blog post deleted successfully");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="py-8 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No blog posts found. Create your first blog post!
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post, index) => (
                  <TableRow key={post.post_id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      /blog/{post.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(post.upload_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBlog(post.post_id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-red-600 text-white">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Do you really want
                                to delete this blog post?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white"
                                onClick={() => handleDeleteBlog(post.post_id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
