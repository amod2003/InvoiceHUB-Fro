import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';

import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { apiErrorMessage } from '../api/axiosInstance';

const schema = z.object({
  business_name: z.string().min(2, 'Business name is too short').max(100),
  full_name: z.string().min(2, 'Your name is too short').max(100),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
});

export default function Register() {
  const navigate = useNavigate();
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
      const tokens = await authApi.register(data);
      login(tokens);
      const me = await authApi.me();
      setUser(me);
      toast.success('Workspace created — welcome aboard!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="Get started in 30 seconds" heading="Create your workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Business name"
          icon={Building2}
          placeholder="Acme Studios"
          error={errors.business_name?.message}
          {...register('business_name')}
        />
        <Input
          label="Your full name"
          icon={User}
          placeholder="Jane Doe"
          autoComplete="name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Work email"
          type="email"
          icon={Mail}
          placeholder="jane@acme.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          loading={submitting}
          iconRight={ArrowRight}
          size="lg"
          className="w-full"
        >
          Create Account
        </Button>

        <p className="text-xs text-text-muted text-center">
          By creating an account you agree to our terms and privacy policy.
        </p>
      </form>

      <p className="text-sm text-text-muted text-center mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-cyan font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
