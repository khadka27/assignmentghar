import { AuthForm } from "@/components/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - AssignmentGhar",
  description: "Sign in to your AssignmentGhar account",
};

export default function LoginPage() {
  return <AuthForm />;
}
