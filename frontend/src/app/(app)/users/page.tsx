"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useUsers, useUserMutations } from "@/hooks/queries/use-users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { Role, User } from "@/lib/api/types";
import { Plus, Pencil, KeyRound, UserX } from "lucide-react";

function UserAvatar({ user }: { user: User }) {
  const initials = (
    (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "") || user.email[0]
  ).toUpperCase();
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const { create, update, resetPassword, remove } = useUserMutations();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "INVENTORY" as Role,
  });
  const [adminPassword, setAdminPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminPasswordVerified, setAdminPasswordVerified] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState("");

  const handleCreate = () => {
    create.mutate(form, {
      onSuccess: () => {
        setCreateOpen(false);
        setForm({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "INVENTORY",
        });
      },
    });
  };

  const handleUpdate = () => {
    if (!editUser) return;
    update.mutate(
      {
        id: editUser.id,
        data: {
          email: form.email || undefined,
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          role: form.role,
          isActive: editUser.isActive,
        },
      },
      { onSuccess: () => setEditUser(null) },
    );
  };

  const handleVerifyAdminPassword = () => {
    if (!adminPassword) {
      setAdminPasswordError("Please enter your password");
      return;
    }
    setAdminPasswordVerified(true);
    setAdminPasswordError("");
  };

  const handleResetPassword = () => {
    if (!resetUser || !adminPassword || !newPassword) {
      return;
    }
    resetPassword.mutate(
      { id: resetUser.id, adminPassword, newPassword },
      {
        onSuccess: () => {
          setResetUser(null);
          setAdminPassword("");
          setNewPassword("");
          setAdminPasswordVerified(false);
        },
        onError: () => {
          setAdminPasswordError("Incorrect administrator password.");
          setAdminPasswordVerified(false);
        },
      },
    );
  };

  return (
    <AppShell title="User Management" allowedRoles={["ADMIN"]}>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Last Login</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar user={user} />
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.isActive !== false ? "success" : "danger"}
                    >
                      {user.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.createdAt ? formatDate(user.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditUser(user);
                              setForm({
                                email: user.email,
                                password: "",
                                firstName: user.firstName ?? "",
                                lastName: user.lastName ?? "",
                                role: user.role,
                              });
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit User</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setResetUser(user)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Password</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (user.isActive !== false) {
                                setDeactivateUser(user);
                              } else {
                                update.mutate({
                                  id: user.id,
                                  data: { isActive: true },
                                });
                              }
                            }}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {user.isActive !== false
                              ? "Deactivate"
                              : "Activate"}{" "}
                            User
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="INVENTORY">Inventory</SelectItem>
                  <SelectItem value="PROCUREMENT">Procurement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={create.isPending}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="INVENTORY">Inventory</SelectItem>
                  <SelectItem value="PROCUREMENT">Procurement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deactivateUser}
        onOpenChange={() => setDeactivateUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate user?</DialogTitle>
          </DialogHeader>
          {deactivateUser && (
            <div className="space-y-2 text-sm">
              <p>Are you sure you want to deactivate this user?</p>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {[deactivateUser.firstName, deactivateUser.lastName]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </p>
              <p>
                <span className="font-medium">Role:</span> {deactivateUser.role}
              </p>
              <p className="text-muted-foreground">
                This user will no longer be able to access the system.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={update.isPending}
              onClick={() => {
                if (!deactivateUser) return;
                update.mutate(
                  { id: deactivateUser.id, data: { isActive: false } },
                  { onSuccess: () => setDeactivateUser(null) },
                );
              }}
            >
              Deactivate User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!resetUser}
        onOpenChange={() => {
          setResetUser(null);
          setAdminPassword("");
          setNewPassword("");
          setAdminPasswordVerified(false);
          setAdminPasswordError("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {!adminPasswordVerified && (
              <>
                <div>
                  <Label className="font-medium text-sm mb-1 block">
                    Admin Authentication Required
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Please verify your administrator password to reset this
                    user's password.
                  </p>
                  <Label>Admin Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminPasswordError("");
                    }}
                    disabled={resetPassword.isPending}
                  />
                  {adminPasswordError && (
                    <p className="text-xs text-destructive mt-1">
                      {adminPasswordError}
                    </p>
                  )}
                </div>
              </>
            )}

            {adminPasswordVerified && (
              <>
                <div className="p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                  <span className="text-xs font-medium text-green-900">
                    ✓ Verified
                  </span>
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={resetPassword.isPending}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {!adminPasswordVerified ? (
              <Button
                onClick={handleVerifyAdminPassword}
                disabled={resetPassword.isPending || !adminPassword}
              >
                Verify
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdminPasswordVerified(false);
                    setAdminPassword("");
                    setNewPassword("");
                    setAdminPasswordError("");
                  }}
                  disabled={resetPassword.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleResetPassword}
                  disabled={resetPassword.isPending || !newPassword}
                >
                  Reset
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
