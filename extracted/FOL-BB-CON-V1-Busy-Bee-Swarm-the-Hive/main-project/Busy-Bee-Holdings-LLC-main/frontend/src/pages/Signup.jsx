/**
 * Busy Bee Signup - Design System Implementation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import { Button, Input, Card, CardContent, Checkbox } from '../components';
import { signUp } from '../lib/supabase';

function Signup({ onNavigate }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: signupError } = await signUp(email, password, name);
    
    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else if (data?.user && !data.session) {
      // Email confirmation required
      setSuccess(true);
      setLoading(false);
    } else {
      // Auto-login signup - redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Busy Bee</h1>
          <p className="text-foreground-muted mt-2">Create your account</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

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
                <label className="text-sm font-medium text-foreground">Password</label>
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
                <p className="text-xs text-foreground-muted">Must be at least 8 characters</p>
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required 
                />
                <p className="text-sm text-foreground-muted">
                  I agree to the{' '}
                  <button type="button" className="text-primary hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 font-medium mb-2">
                    <FiCheck className="w-5 h-5" />
                    Account created!
                  </div>
                  <p className="text-sm text-green-600">
                    We've sent a confirmation email to <strong>{email}</strong>. 
                    Please check your inbox and click the confirmation link to activate your account.
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <FiArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground-muted">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate?.('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
