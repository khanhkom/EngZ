import { Loader2 } from '../icons';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';

interface SignUpFormProps {
  onSignUp: (data: { email: string; password: string; firstName: string; lastName: string }) => void;
  onLogin?: () => void;
  loading: boolean;
  error?: string | null;
}

export const SignUpForm = ({ onSignUp, onLogin, loading, error }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain an uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain a lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain a number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'Password must contain a special character';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate password
    const pwdError = validatePassword(password);
    if (pwdError) {
      setValidationError(pwdError);
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (email && password && firstName && lastName) {
      onSignUp({ email, password, firstName, lastName });
    }
  };

  const displayError = validationError || error;

  return (
    <Card className="mx-auto w-full max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create an account to sync your vocabulary across devices</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500">Min 8 chars, uppercase, lowercase, number, and special character</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {displayError && <p className="text-sm text-red-500">{displayError}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">
          Already have an account?{' '}
          <button type="button" onClick={onLogin} className="underline hover:text-gray-900" disabled={loading}>
            Login
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
