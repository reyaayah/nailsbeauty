"use client";
import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getClientAuth } from "@/lib/firebase/client";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Button, Card, PageHeader, Input } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Shield, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const pwdSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type PwdForm = z.infer<typeof pwdSchema>;

export default function SettingsPanel() {
  const { user } = useAdminAuth();
  const [changing, setChanging] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PwdForm>({
    resolver: zodResolver(pwdSchema),
  });

  const handleChangePassword = async (data: PwdForm) => {
    if (!user || !user.email) return;
    setChanging(true);
    try {
      const auth = getClientAuth();
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);
      toast.success("Password updated successfully!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-[700px] space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Manage your admin account and preferences"
        breadcrumb={["Admin", "Settings"]}
      />

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-[--accent]" />
          <h3 className="font-semibold text-slate-900">Account Information</h3>
        </div>
        <div className="flex items-center gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-[--accent-light] flex items-center justify-center text-[--accent] font-bold text-lg">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Verified Admin</span>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Email", value: user?.email ?? "—" },
            { label: "Role", value: "Super Admin" },
            { label: "User ID", value: (user?.uid ?? "").slice(0, 16) + "…" },
            { label: "Account Type", value: "Firebase Auth" },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[--border] rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-[--accent]" />
          <h3 className="font-semibold text-slate-900">Change Password</h3>
        </div>
        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
          <Input label="Current Password" type="password" required placeholder="••••••••" {...register("currentPassword")} error={errors.currentPassword?.message} />
          <Input label="New Password" type="password" required placeholder="••••••••" hint="Minimum 8 characters" {...register("newPassword")} error={errors.newPassword?.message} />
          <Input label="Confirm New Password" type="password" required placeholder="••••••••" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
          <Button type="submit" loading={changing} leftIcon={<Lock size={14} />}>
            Update Password
          </Button>
        </form>
      </Card>


    </div>
  );
}
