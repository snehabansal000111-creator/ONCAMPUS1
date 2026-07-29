"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Compass, Mail, Lock, User } from "lucide-react";
import Button from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    // TODO: replace with Supabase auth
    // const supabase = createClient();
    // await supabase.auth.signUp(values);
    console.log("signup", values);
    window.location.href = "/onboarding";
  };

  return (
    <main className="min-h-screen bg-gradient-radiant flex items-center justify-center section-pad py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8"
      >
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg justify-center">
          <span className="grid h-8 w-8 place-items-center rounded-xl2 bg-gradient-primary text-white">
            <Compass size={18} />
          </span>
          ONCampus
        </Link>

        <h1 className="mt-6 text-2xl font-display font-semibold text-center text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted text-center">Takes about a minute. The roadmap takes three.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="name">Full name</label>
            <div className="mt-1.5 relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                id="name"
                placeholder="Riya Sharma"
                className="w-full rounded-xl2 border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-ink" htmlFor="email">Email</label>
            <div className="mt-1.5 relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                id="email"
                type="email"
                placeholder="you@college.edu"
                className="w-full rounded-xl2 border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-ink" htmlFor="password">Password</label>
            <div className="mt-1.5 relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl2 border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-600 font-medium">
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
