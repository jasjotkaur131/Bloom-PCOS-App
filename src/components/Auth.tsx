import React, { useState } from 'react';
import { motion } from 'motion/react';
import { logIn, signUp } from '../lib/auth';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    let result;
    if (isLogin) {
      result = await logIn(email, password);
    } else {
      result = await signUp(email, password);
    }

    if (result.error) {
      // Map firebase errors to friendlier messages if desired, or just show the error
      setError(result.error);
      setLoading(false);
    } else {
      // Success, call onSuccess
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-bloom p-8"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-rose mb-2">🌸 Bloom</h1>
          <p className="text-text-secondary">Your PCOS Companion</p>
        </div>

        {error && (
          <div className="bg-rose-light text-rose p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-border-main bg-cream-light focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-border-main bg-cream-light focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose text-white py-3 rounded-xl font-medium hover:bg-rose-dark transition-colors disabled:opacity-70"
          >
            {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-rose font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
