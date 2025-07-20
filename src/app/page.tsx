
"use client";

import LoginForm from "./login/login-form";
import AnimatedBackground from "./AnimatedBackground";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <AnimatedBackground />
      <LoginForm />
    </div>
  );
}
