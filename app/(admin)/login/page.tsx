"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Sparkles, LayoutDashboard, ArrowRight, ShieldCheck } from "lucide-react";

const theme = {
  colors: {
    primary: "#DBA1A2",
    dark: "#422B23",
    light: "#F7F3ED",
    muted: "#C2C6B9",
    subtitle: "#EFD8D6",
    pink: "#EF7575",
  },
};

const schema = z.object({
  email: z.string().email("Invalid administrator email"),
  password: z.string().min(6, "Security requirement: 6+ characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [authError, setAuthError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormValues) => {
    setAuthError("");
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err: any) {
      setAuthError(err.message || "Credential verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: theme.colors.light }}>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] p-16 relative overflow-hidden shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] z-10"
        style={{ backgroundColor: theme.colors.dark }}>
        <div
          className="absolute inset-0 z-0 opacity-80 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588359953494-0c215e3cedc6?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        />
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to bottom, ${theme.colors.dark}CC 0%, ${theme.colors.dark}44 50%, ${theme.colors.dark}EE 100%)` }} />

        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-serif tracking-widest text-white uppercase">Gloss & Grace</h1>
        </div>

        <div className="relative z-20">
          <h2 className="text-5xl font-serif leading-tight mb-6" style={{ color: theme.colors.light }}>
            Precision in<br />
            <span style={{ color: theme.colors.primary }}>Every Detail.</span>
          </h2>
          <p className="text-base font-light max-w-xs leading-relaxed opacity-80" style={{ color: theme.colors.subtitle }}>
            The administrative suite for high-performance beauty management.
          </p>
        </div>

        <div className="relative z-20 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40" style={{ color: theme.colors.subtitle }}>
          Est. 2026 Admin Control
        </div>
      </div>

      {/* NEWLY DESIGNED RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 relative overflow-hidden">
        {/* Decorative subtle background shape */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: theme.colors.primary }} />

        <div className="w-full max-w-md z-10">
          <div className="mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block" style={{ color: theme.colors.primary }}>Secure Portal</span>
            <h3 className="text-4xl font-serif leading-none mb-3" style={{ color: theme.colors.dark }}>Administrator Login</h3>
            <div className="w-12 h-[2px]" style={{ backgroundColor: theme.colors.primary }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {authError && (
              <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-bold border-l-4 animate-in slide-in-from-top-2"
                style={{ backgroundColor: "white", borderColor: theme.colors.pink, color: theme.colors.pink, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <AlertTriangle size={16} />
                {authError}
              </div>
            )}

            <div className="space-y-8">
              {/* Refined Email Input */}
              <div className="relative group">
                <input
                  {...register("email")}
                  type="email"
                  required
                  className="w-full py-3 bg-transparent border-b-2 outline-none transition-all peer placeholder-transparent"
                  style={{ borderColor: theme.colors.muted, color: theme.colors.dark }}
                />
                <label className="absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs pointer-events-none"
                  style={{ color: theme.colors.muted }}>
                  Email Address
                </label>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-focus-within:w-full transition-all duration-500" style={{ backgroundColor: theme.colors.primary }} />
                {errors.email && <p className="text-[10px] font-bold mt-2" style={{ color: theme.colors.pink }}>{errors.email.message}</p>}
              </div>

              {/* Refined Password Input */}
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  required
                  className="w-full py-3 bg-transparent border-b-2 outline-none transition-all peer placeholder-transparent"
                  style={{ borderColor: theme.colors.muted, color: theme.colors.dark }}
                />
                <label className="absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs pointer-events-none"
                  style={{ color: theme.colors.muted }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-0 top-3 opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: theme.colors.dark }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-focus-within:w-full transition-all duration-500" style={{ backgroundColor: theme.colors.primary }} />
                {errors.password && <p className="text-[10px] font-bold mt-2" style={{ color: theme.colors.pink }}>{errors.password.message}</p>}
              </div>
            </div>

            {/* Premium Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-14 rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#DBA1A2]/20"
                style={{ backgroundColor: theme.colors.dark }}
              >
                <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out z-0" style={{ backgroundColor: theme.colors.primary }} />
                <span className="relative z-10 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-white group-hover:text-white">
                  {isSubmitting ? "Verifying..." : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-12 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} style={{ color: theme.colors.dark }} />
              <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: theme.colors.dark }}>Encrypted</span>
            </div>
            <a href="#" className="text-[10px] font-bold uppercase tracking-tighter hover:underline" style={{ color: theme.colors.dark }}>
              Forgot Credentials?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}