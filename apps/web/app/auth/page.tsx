'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const signupSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [serverError, setServerError] = useState<string | null>(null);
  const { login, signup } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function handleLogin(data: LoginFormData): Promise<void> {
    setServerError(null);
    try {
      await login(data.email, data.password);
      router.push('/');
    } catch {
      setServerError('Email ou mot de passe incorrect.');
    }
  }

  async function handleSignup(data: SignupFormData): Promise<void> {
    setServerError(null);
    try {
      await signup(data.firstName, data.lastName, data.email, data.password);
      router.push('/');
    } catch {
      setServerError('Impossible de créer le compte. Cet email est peut-être déjà utilisé.');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-cream text-center mb-2">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          {mode === 'login' ? 'Bienvenue sur Oreli.' : 'Rejoignez Oreli pour commander.'}
        </p>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <input
                {...loginForm.register('email')}
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
              />
              {loginForm.formState.errors.email && (
                <p className="text-danger text-xs mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...loginForm.register('password')}
                type="password"
                placeholder="Mot de passe"
                autoComplete="current-password"
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
              />
              {loginForm.formState.errors.password && (
                <p className="text-danger text-xs mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              className="w-full bg-gold text-obsidian font-semibold py-3 rounded-2xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {loginForm.formState.isSubmitting ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  {...signupForm.register('firstName')}
                  placeholder="Prénom"
                  className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
                />
                {signupForm.formState.errors.firstName && (
                  <p className="text-danger text-xs mt-1">{signupForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <input
                  {...signupForm.register('lastName')}
                  placeholder="Nom"
                  className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
                />
                {signupForm.formState.errors.lastName && (
                  <p className="text-danger text-xs mt-1">{signupForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <input
                {...signupForm.register('email')}
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
              />
              {signupForm.formState.errors.email && (
                <p className="text-danger text-xs mt-1">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...signupForm.register('password')}
                type="password"
                placeholder="Mot de passe (min. 8 caractères)"
                autoComplete="new-password"
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
              />
              {signupForm.formState.errors.password && (
                <p className="text-danger text-xs mt-1">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={signupForm.formState.isSubmitting}
              className="w-full bg-gold text-obsidian font-semibold py-3 rounded-2xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {signupForm.formState.isSubmitting ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>
        )}

        <p className="text-muted text-sm text-center mt-6">
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={() => { setMode('signup'); setServerError(null); }}
                className="text-gold hover:underline"
              >
                S&apos;inscrire
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={() => { setMode('login'); setServerError(null); }}
                className="text-gold hover:underline"
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
