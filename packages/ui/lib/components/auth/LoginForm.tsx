import { Loader2 } from '../icons';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSignUp?: () => void;
  onForgotPassword?: (email: string) => void;
  loading: boolean;
  error?: string | null;
}

export const LoginForm = ({ onLogin, onSignUp, onForgotPassword, loading, error }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onForgotPassword && email) {
      onForgotPassword(email);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="ml-auto inline-block text-sm underline opacity-50 hover:opacity-100 disabled:opacity-30"
                disabled={!email || loading}>
                Forgot your password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">
          Don't have an account?{' '}
          <button type="button" onClick={onSignUp} className="underline hover:text-gray-900" disabled={loading}>
            Sign up
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
