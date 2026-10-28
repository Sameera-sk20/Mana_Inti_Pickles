import React, { useState } from 'react';
import { User, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { X, ShieldCheck, LogOut, Mail, Lock, AlertCircle, CheckCircle2, User as UserIcon } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccess?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase Auth is not initialized. Please check your Firebase settings.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      setSuccessMsg('Successfully signed in with Google!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase Auth is not initialized.');
      return;
    }
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        setSuccessMsg('Admin account created and signed in successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setSuccessMsg('Signed in successfully!');
      }
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
      setSuccessMsg('Signed out successfully.');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign out.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#F4ECE0] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF6EE] px-6 py-5 border-b border-[#F4ECE0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#9E1A17]/10 flex items-center justify-center text-[#9E1A17]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Owner / Admin Portal
              </h2>
              <p className="text-xs text-gray-600">
                Secure Authentication for Catalog Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {currentUser ? (
            /* Signed In State */
            <div className="space-y-4">
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EADBCA] flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#1B4D3E] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Authenticated Administrator
                  </div>
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {currentUser.displayName || currentUser.email || 'Admin'}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    UID: {currentUser.uid}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                You now have full permission to add new products, edit pricing and descriptions, and delete products in Cloud Firestore.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-[#9E1A17] hover:bg-[#7B1311] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                Sign in to manage the live Cloud Firestore products collection. Public visitors can only view products; only authenticated store administrators can write or modify data.
              </p>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-3 shadow-sm transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  or with email
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@manaintipickles.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9E1A17] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9E1A17] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 bg-[#9E1A17] hover:bg-[#7B1311] text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : isSignUp ? 'Create Admin Account' : 'Sign In to Portal'}
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-xs text-[#9E1A17] hover:underline font-semibold"
                >
                  {isSignUp
                    ? 'Already have an admin account? Sign in'
                    : 'First time admin? Register new admin login'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
