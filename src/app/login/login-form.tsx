"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, CheckCircle, Sparkles, Shield, Star, Home } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
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

  const { user, signUp, signIn, signOut, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error('Please enter your name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signUp(email, password, name);
        setMessage({ type: 'success', text: 'Account created successfully! You can now sign in.' });
        setIsSignUp(false); // Switch to sign in view
        setName('');
        setPassword('');
      } else {
        await signIn(email, password);
        setMessage({ type: 'success', text: 'Signed in successfully!' });
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
        setMessage({ type: 'success', text: 'Signed in successfully!' });
        router.push('/home');
    } catch (error: any) {
        console.error('Social login error:', error);
        let errorMessage = 'An error occurred with social login.';
        if (typeof error.message === 'string') {
            errorMessage = error.message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.$/, '');
        }
        setMessage({ type: 'error', text: errorMessage});
    }
  }

  // If user is already logged in, redirect them away from login page
  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);


  return (
    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} whileHover={{ y: -5 }}>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-800/95 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
            animate={{ y: [0, -10, 0], opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
          </motion.div>
        ))}

        <CardHeader className="space-y-1 text-center pb-6 relative z-10">
          <motion.div className="flex items-center justify-center mb-4" animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl relative">
              <Lock className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-2">
              Legezt Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? 'Create a new account' : 'Enter your credentials to access your account'}
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
                className={`p-4 rounded-xl text-sm border-2 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-200/50 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50' 
                    : 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50'
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
                    <Input id="name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10" />
                <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </motion.div>
            </div>
            
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.02 }}>
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
                </motion.div>
              </div>
            )}
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden" disabled={isLoading}>
                {isLoading && <motion.div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1, repeat: Infinity }} />}
                {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign in')}
              </Button>
            </motion.div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">Or continue with</span></div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="w-full" type="button" onClick={() => handleSocialLogin('google')}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </Button>
            </motion.div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
              <Button variant="link" className="px-0 text-primary hover:text-primary/80" onClick={() => { setIsSignUp(!isSignUp); setMessage(null); setPassword(''); setName(''); }}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
