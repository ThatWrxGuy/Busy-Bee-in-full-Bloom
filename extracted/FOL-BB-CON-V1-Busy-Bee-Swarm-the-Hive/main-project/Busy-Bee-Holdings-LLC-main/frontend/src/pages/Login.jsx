/**
 * Busy Bee Login - Design System Implementation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { Button, Input, Card, CardContent } from '../components';
import { signIn } from '../lib/supabase';

function Login({ onNavigate }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: loginError } = await signIn(email, password);
    
    if (loginError) {
      setError(loginError.message);
    } else {
      // Success - redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Busy Bee</h1>
          <p className="text-foreground-muted mt-2">Welcome back</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <FiArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground-muted">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate?.('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-foreground-muted mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Login;
