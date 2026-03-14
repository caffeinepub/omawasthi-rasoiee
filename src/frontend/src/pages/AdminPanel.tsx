import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteRecipe,
  useGetFeedbackList,
  useGetJobApplications,
  useGetLocalUsers,
  useListRecipes,
} from "@/hooks/useQueries";
import {
  Briefcase,
  MessageSquare,
  Shield,
  Trash2,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPanel() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage recipes, users, job applications &amp; feedback
          </p>
        </div>
      </div>

      <Tabs defaultValue="recipes" data-ocid="admin.panel">
        <TabsList className="mb-8 flex-wrap h-auto gap-1">
          <TabsTrigger
            value="recipes"
            className="gap-2"
            data-ocid="admin.recipes.tab"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-2"
            data-ocid="admin.users.tab"
          >
            <Users className="w-4 h-4" />
            Registered Users
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="gap-2"
            data-ocid="admin.jobs.tab"
          >
            <Briefcase className="w-4 h-4" />
            Job Applications
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="gap-2"
            data-ocid="admin.feedback.tab"
          >
            <MessageSquare className="w-4 h-4" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <RecipesTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="jobs">
          <JobsTab />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RecipesTab() {
  const { data: recipes, isLoading } = useListRecipes();
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async (id: bigint, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteRecipe.mutateAsync(id);
      toast.success(`"${title}" deleted.`);
    } catch {
      toast.error("Failed to delete recipe.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.recipes.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl"
        data-ocid="admin.recipes.empty_state"
      >
        <UtensilsCrossed className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No recipes found</p>
        <p className="text-sm opacity-70">Add recipes from the Browse page.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      data-ocid="admin.recipes.table"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Prep</TableHead>
            <TableHead className="font-semibold">Cook</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe, idx) => (
            <TableRow
              key={recipe.id.toString()}
              data-ocid={`admin.recipes.row.${idx + 1}`}
              className="hover:bg-muted/20 transition-colors"
            >
              <TableCell className="text-muted-foreground font-mono text-sm">
                {idx + 1}
              </TableCell>
              <TableCell className="font-medium max-w-xs truncate">
                {recipe.title}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{recipe.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {Number(recipe.prepTime)} min
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {Number(recipe.cookTime)} min
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(recipe.id, recipe.title)}
                  disabled={deleteRecipe.isPending}
                  data-ocid={`admin.recipes.delete_button.${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useGetLocalUsers();

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.users.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl"
        data-ocid="admin.users.empty_state"
      >
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No registered users yet</p>
        <p className="text-sm opacity-70">
          When users sign up, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      data-ocid="admin.users.table"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Registered At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow
              key={`${user.email}-${idx}`}
              data-ocid={`admin.users.row.${idx + 1}`}
              className="hover:bg-muted/20 transition-colors"
            >
              <TableCell className="text-muted-foreground font-mono text-sm">
                {idx + 1}
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(user.registeredAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function JobsTab() {
  const { data: jobs, isLoading } = useGetJobApplications();

  const postColors: Record<string, string> = {
    Chef: "bg-orange-100 text-orange-700",
    Waiter: "bg-blue-100 text-blue-700",
    Manager: "bg-purple-100 text-purple-700",
    Delivery: "bg-green-100 text-green-700",
    Cashier: "bg-pink-100 text-pink-700",
  };

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.jobs.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl"
        data-ocid="admin.jobs.empty_state"
      >
        <Briefcase className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No job applications yet</p>
        <p className="text-sm opacity-70">
          Applications will appear here when submitted.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      data-ocid="admin.jobs.table"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Post</TableHead>
            <TableHead className="font-semibold">Applied</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job, idx) => (
            <TableRow
              key={job.id.toString()}
              data-ocid={`admin.jobs.row.${idx + 1}`}
              className="hover:bg-muted/20 transition-colors"
            >
              <TableCell className="text-muted-foreground font-mono text-sm">
                {idx + 1}
              </TableCell>
              <TableCell className="font-medium">{job.name}</TableCell>
              <TableCell>{job.email}</TableCell>
              <TableCell>{job.phone}</TableCell>
              <TableCell>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    postColors[job.post] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.post}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(job.submittedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FeedbackTab() {
  const { data: feedbacks, isLoading } = useGetFeedbackList();

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.feedback.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl"
        data-ocid="admin.feedback.empty_state"
      >
        <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No feedback received yet</p>
        <p className="text-sm opacity-70">User feedback will appear here.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      data-ocid="admin.feedback.table"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Message</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((fb, idx) => (
            <TableRow
              key={fb.id.toString()}
              data-ocid={`admin.feedback.row.${idx + 1}`}
              className="hover:bg-muted/20 transition-colors"
            >
              <TableCell className="text-muted-foreground font-mono text-sm">
                {idx + 1}
              </TableCell>
              <TableCell className="font-medium">{fb.name}</TableCell>
              <TableCell>{fb.email}</TableCell>
              <TableCell>{fb.phone}</TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm truncate" title={fb.message}>
                  {fb.message}
                </p>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(fb.submittedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
