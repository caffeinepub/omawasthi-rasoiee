import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRegisteredUsers } from "@/hooks/useQueries";
import { Users } from "lucide-react";

export default function AdminPanel() {
  const { data: users, isLoading } = useGetRegisteredUsers();

  const formatDate = (ns: bigint) => {
    const ms = Number(ns / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
        </div>
        <p className="text-muted-foreground ml-13">
          Registered users ki poori list yahan milegi.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-xl"
          data-ocid="admin.empty_state"
        >
          <Users className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">
            Koi user abhi tak register nahi hua
          </p>
          <p className="text-sm mt-1 opacity-70">
            Jab koi register karega, yahan dikhega.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl border border-border overflow-hidden"
          data-ocid="admin.users.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold">#</TableHead>
                <TableHead className="font-semibold">Naam</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Mobile</TableHead>
                <TableHead className="font-semibold">
                  Registration Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow
                  key={user.principal.toString()}
                  data-ocid={`admin.users.row.${idx + 1}`}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{user.naam}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(user.registeredAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
