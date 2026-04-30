import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { apiErrorMessage } from '../api/axiosInstance';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const setUser = useAuthStore((s) => s.setUser);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const tokens = await authApi.login(data);
      login(tokens);
      const me = await authApi.me();
      setUser(me);
      toast.success(`Welcome back, ${me.full_name.split(' ')[0]}`);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" heading="Sign in to InvoiceHub">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@business.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-text-muted hover:text-accent-cyan transition"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={submitting}
          iconRight={ArrowRight}
          size="lg"
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <p className="text-sm text-text-muted text-center mt-8">
        New to InvoiceHub?{' '}
        <Link to="/register" className="text-accent-cyan font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
