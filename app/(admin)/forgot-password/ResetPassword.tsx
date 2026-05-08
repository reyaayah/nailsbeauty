// app/admin/forgot-password/ResetPassword.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertTriangle, ShieldCheck } from "lucide-react";

const theme = {
  primary: "#DBA1A2",
  dark: "#422B23",
  light: "#F7F3ED",
  muted: "#C2C6B9",
  pink: "#EF7575",
};

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  loading: boolean;
  error: string;
  onReset: (newPassword: string) => Promise<void>;
}

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["#e5e7eb", theme.pink, "#f59e0b", "#84cc16", theme.primary];

  return (
    <div className="mt-3">
      <div className="flex gap-1.5 mb-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{ backgroundColor: i < score ? colors[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      {password && (
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: colors[score] }}>
          {labels[score]}
        </p>
      )}
    </div>
  );
}

export default function ResetPasswordPage({ loading, error, onReset }: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = async ({ password }: FormValues) => {
    await onReset(password);
  };

  return (
    <div className="w-full max-w-[380px] z-10">
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: theme.primary }}>
          Step 3 of 3
        </p>
        <h3 className="text-3xl leading-tight mb-3" style={{ color: theme.dark, fontFamily: "Georgia, serif" }}>
          Set a new<br />password
        </h3>
        <p className="text-xs leading-relaxed mt-4 opacity-50" style={{ color: theme.dark }}>
          Choose a strong password for your admin account.
        </p>
        <div className="flex items-center gap-2 mt-5">
          <div className="h-[2px] w-10" style={{ backgroundColor: theme.primary }} />
          <div className="h-[2px] w-3 rounded-full opacity-30" style={{ backgroundColor: theme.primary }} />
        </div>
      </div>

      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-xs font-semibold border-l-4"
          style={{ backgroundColor: "white", borderColor: theme.pink, color: theme.pink, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
        >
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: theme.muted }}>
            New Password
          </label>
          <div
            className="flex items-center rounded-2xl px-5 py-4"
            style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            <input
              {...register("password")}
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              className="flex-1 bg-transparent outline-none text-sm font-medium"
              style={{ color: theme.dark, letterSpacing: showPwd ? "0" : "0.1em" }}
            />
            <button type="button" onClick={() => setShowPwd((v) => !v)} className="ml-2 opacity-30 hover:opacity-70 transition-opacity" tabIndex={-1}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <StrengthBar password={passwordValue} />
          {errors.password && (
            <p className="mt-1 text-[10px] font-bold" style={{ color: theme.pink }}>{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: theme.muted }}>
            Confirm Password
          </label>
          <div
            className="flex items-center rounded-2xl px-5 py-4"
            style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            <input
              {...register("confirm")}
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="flex-1 bg-transparent outline-none text-sm font-medium"
              style={{ color: theme.dark, letterSpacing: showConfirm ? "0" : "0.1em" }}
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="ml-2 opacity-30 hover:opacity-70 transition-opacity" tabIndex={-1}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm && (
            <p className="mt-2 text-[10px] font-bold" style={{ color: theme.pink }}>{errors.confirm.message}</p>
          )}
        </div>

        {/* Requirements */}
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          {[
            { label: "8+ characters", pass: passwordValue.length >= 8 },
            { label: "One uppercase letter", pass: /[A-Z]/.test(passwordValue) },
            { label: "One number", pass: /[0-9]/.test(passwordValue) },
          ].map(({ label, pass }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 shrink-0"
                style={{ backgroundColor: pass ? theme.primary : "#e5e7eb" }}
              >
                {pass && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: pass ? theme.dark : theme.muted }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="group relative w-full h-[56px] rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: theme.dark, boxShadow: `0 8px 30px ${theme.dark}30` }}
        >
          <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ backgroundColor: theme.primary }} />
          <span className="relative z-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white">
            {isSubmitting || loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating…
              </span>
            ) : (
              <>
                <ShieldCheck size={15} />
                Reset Password
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}