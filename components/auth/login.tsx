'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login, decodeToken } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin && username && password) {
        // Call login API
        const response = await login({
          username,
          password,
        });

        if (response.code === 1000 && response.result.authenticated) {
          // Decode JWT token to get user info
          const tokenData = decodeToken(response.result.token);
          const userId = tokenData?.sub || tokenData?.userId || '1';

          const user = {
            id: userId,
            username,
            displayName: username,
            email: email || `${username}@example.com`,
            avatar: '/user-avatar.jpg',
          };
          localStorage.setItem('current_user', JSON.stringify(user));

          toast({
            title: 'Login successful',
            description: 'Welcome back!',
          });

          router.push('/dashboard/timeline');
        }
      } else if (!isLogin && email && password && displayName && username) {
        // Sign up logic (you can implement this later)
        const user = {
          id: '1',
          email,
          displayName,
          username,
          avatar: '/user-avatar.jpg',
        };
        localStorage.setItem('current_user', JSON.stringify(user));
        router.push('/dashboard/timeline');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="h-12 w-12 mx-auto rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            SM
          </div>
          <CardTitle className="text-2xl">{isLogin ? 'Welcome Back' : 'Join Us'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting to server...
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>

            {isLoading && (
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Please wait while we authenticate your credentials...
                </p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setDisplayName('');
                setUsername('');
              }}
              disabled={isLoading}
              className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
