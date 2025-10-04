
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Tables } from '@/app/integrations/supabase/types';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  course?: string;
  studentId?: string;
  profilePhoto?: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  setupAdmin: () => Promise<{ success: boolean; message: string }>;
  checkAdminStatus: () => Promise<{ success: boolean; message: string }>;
}

interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  course: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.user_id || supabaseUser.id,
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone || undefined,
          course: profile.course || undefined,
          studentId: profile.student_id || undefined,
          profilePhoto: profile.profile_photo || undefined,
          role: (profile.role as 'student' | 'admin') || 'student',
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Convert username "admin" to email format for Supabase Auth
      const loginEmail = email === 'admin' ? 'admin@weekendacademy.com' : email;
      
      console.log('Attempting login with email:', loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      console.log('Login response:', { data: data?.user?.email, error });

      if (error) {
        console.error('Login error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          if (email === 'admin') {
            return { 
              success: false, 
              message: 'Admin user not found. Please use "Setup Admin User" button first.' 
            };
          }
          return { success: false, message: 'Invalid email or password' };
        }
        
        return { success: false, message: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            full_name: userData.fullName,
            phone: userData.phone,
            course: userData.course,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Create profile manually if needed (trigger should handle this)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            full_name: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            course: userData.course,
            student_id: `WA${Date.now().toString().slice(-6)}`,
            role: (userData.email === 'admin@weekendacademy.com' || userData.email === 'admin') ? 'admin' : 'student'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        return { 
          success: true, 
          message: data.user.email_confirmed_at 
            ? 'Account created successfully' 
            : 'Please check your email to verify your account' 
        };
      }

      return { success: false, message: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user || !session?.user) return false;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          phone: userData.phone,
          course: userData.course,
          profile_photo: userData.profilePhoto,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Update profile error:', error);
        return false;
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/reset-password',
      });

      if (error) {
        console.error('Forgot password error:', error);
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const setupAdmin = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      console.log('Invoking setup-admin function...');
      
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: {
          email: 'admin',
          password: 'adminiyf',
          fullName: 'Administrator'
        }
      });

      console.log('Setup admin response:', { data, error });

      if (error) {
        console.error('Setup admin error:', error);
        // Provide more detailed error information
        return { 
          success: false, 
          message: `Setup failed: ${error.message || 'Unknown error'}\n\nDetails: ${JSON.stringify(error)}` 
        };
      }

      if (data?.error) {
        console.error('Setup admin data error:', data.error);
        return { success: false, message: `Server error: ${data.error}` };
      }

      return { success: true, message: data?.message || 'Admin user setup completed successfully!' };
    } catch (error) {
      console.error('Setup admin error:', error);
      return { 
        success: false, 
        message: `Unexpected error: ${error.message}\n\nPlease check your internet connection and try again.` 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminStatus = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if admin profile exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'admin@weekendacademy.com')
        .eq('role', 'admin');

      const profileCount = profiles?.length || 0;

      // Try to login to check if auth user exists
      const { data: loginTest, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@weekendacademy.com',
        password: 'adminiyf'
      });

      // Immediately sign out if login was successful
      if (loginTest?.user) {
        await supabase.auth.signOut();
      }

      const authExists = loginTest?.user ? 'Yes' : 'No';
      const loginErrorMsg = loginError?.message || 'None';

      return {
        success: true,
        message: `Admin Status:\n- Admin profiles in DB: ${profileCount}\n- Auth user exists: ${authExists}\n- Login error: ${loginErrorMsg}\n\nProfile Error: ${profileError?.message || 'None'}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Status check failed: ${error.message}`
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    forgotPassword,
    setupAdmin,
    checkAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
