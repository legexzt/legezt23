
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { user, signUp, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect them away from login page
  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error('Please enter your name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signUp(email, password, name);
        setMessage({ type: 'success', text: 'Account created! Please sign in.' });
        setIsSignUp(false);
        setName('');
        setPassword('');
      } else {
        await signIn(email, password);
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = 'An error occurred';
      if (typeof error.message === 'string') {
        errorMessage = error.message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.$/, '');
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google') => {
    try {
        await signInWithGoogle();
        router.push('/home');
    } catch (error: any) {
        console.error('Social login error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            setMessage({ type: 'error', text: 'Login cancelled. Please try again.'});
            return;
        }
        let errorMessage = 'An error occurred with social login.';
        if (typeof error.message === 'string') {
            errorMessage = error.message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.$/, '');
        }
        setMessage({ type: 'error', text: errorMessage});
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full max-w-md">
      <Card className="shadow-2xl border-2 border-[#00ffe7]/30 bg-black/60 backdrop-blur-lg text-white relative overflow-hidden">
        
        <CardHeader className="space-y-1 text-center pb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <CardTitle className="text-5xl font-extrabold tracking-widest" style={{ textShadow: '0 0 10px #00ffe7, 0 0 20px #00ffe7' }}>
              LEGEZT
            </CardTitle>
            <CardDescription className="text-gray-300 pt-2">
              {isSignUp ? 'Create a new account' : 'Welcome back! Sign in to continue'}
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className={`p-3 rounded-lg text-sm border ${
                  message.type === 'success' 
                    ? 'bg-green-900/50 text-green-300 border-green-500/50' 
                    : 'bg-red-900/50 text-red-300 border-red-500/50'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input id="name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-black/40 border-[#00ffe7]/50 focus:border-[#00ffe7]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-black/40 border-[#00ffe7]/50 focus:border-[#00ffe7]" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10 bg-black/40 border-[#00ffe7]/50 focus:border-[#00ffe7]" />
                <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </motion.div>
            </div>
            
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.02 }}>
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} className="border-gray-400 data-[state=checked]:bg-[#00ffe7] data-[state=checked]:text-black" />
                  <Label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">Remember me</Label>
                </motion.div>
              </div>
            )}
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full bg-[#00ffe7] hover:bg-[#00bfff] text-black font-bold shadow-lg shadow-[#00ffe7]/20 hover:shadow-xl hover:shadow-[#00bfff]/30 transition-all duration-300" disabled={isLoading}>
                {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign in')}
              </Button>
            </motion.div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/60 px-2 text-gray-400">Or</span></div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="w-full bg-transparent border-gray-600 hover:bg-white/10" type="button" onClick={() => handleSocialLogin('google')}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor"d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </Button>
            </motion.div>
          </div>
          
          <div className="text-center text-sm text-gray-300">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
              <Button variant="link" className="px-0 text-[#00ffe7] hover:text-[#00bfff]" onClick={() => { setIsSignUp(!isSignUp); setMessage(null); setPassword(''); setName(''); }}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
