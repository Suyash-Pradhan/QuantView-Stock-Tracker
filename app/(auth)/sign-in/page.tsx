"use client"
import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import InputField from '@/components/form/InputField'
import { Button } from '@/components/ui/button'
import { signInWithEmail } from '@/lib/action/auth.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Render the sign-in page containing an email and password form with validation and submission.
 *
 * The form validates inputs on blur, submits credentials via the authentication action,
 * navigates to the home route on successful sign-in, and shows an error toast if submission fails.
 *
 * @returns A React element representing the sign-in page.
 */
function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result?.success) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Sign in failed. Please try again.', {
        description: error instanceof Error ? error.message : 'Failed to Sign in.'
      });
    }
  }

  return (
    <>
      <h1 className="form-title">Welcome back — sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          placeholder="alex@gmail.com"
          register={register}
          name="email"
          label="Email"
          validation={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
            },
          }}
          error={errors.email}
        />

        <InputField
          placeholder="••••••••"
          type="password"
          register={register}
          name="password"
          label="Password"
          validation={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters long' }
          }}
          error={errors.password}
        />

        <div className="flex items-center justify-end -mt-2">
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full yellow-btn mt-3">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center text-gray-500 mt-4">
          Don’t have an account?{' '}
          <Link href="/sign-up" className="underline text-yellow-500 hover:text-yellow-600">
            Sign up
          </Link>
        </div>
      </form>
    </>
  )
}

export default SignInPage