import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getProfile } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip auth if Supabase is not configured
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Initial auth check
    checkAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await getProfile(userId);
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const login = async (email, password) => {
    if (!supabase) {
      setError('Supabase not configured. Please add environment variables.');
      return false;
    }
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setUser(data.user);
      await fetchProfile(data.user.id);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  const signup = async (email, password, fullName) => {
    if (!supabase) {
      setError('Supabase not configured. Please add environment variables.');
      return false;
    }
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: fullName?.toLowerCase().replace(/\s+/g, '_'),
          },
        },
      });
      
      if (error) throw error;
      
      // If email confirmation is required
      if (data.user && !data.session) {
        return { requiresConfirmation: true };
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Signup failed');
      return false;
    }
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (data) {
      setProfile(data);
    }
    
    return { data, error };
  };

  const value = {
    user,
    profile,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
