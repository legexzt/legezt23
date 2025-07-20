
"use client";

import LoginForm from "./login/login-form";
import AnimatedBackground from "./AnimatedBackground";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="absolute inset-0 z-0 opacity-30">
        <AnimatedBackground />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-background via-background/80 to-background"></div>
      <div className="relative z-20">
        <LoginForm />
      </div>
    </div>
  );
}
