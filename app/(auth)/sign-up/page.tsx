'use client'
import InputField from '@/components/form/InputField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/form/SelectField'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CountrySelectField } from '@/components/form/CountrySelectField'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
import { sendWelcomeEmail } from '@/lib/nodemailer/index'
import { signUpWithEmail } from '@/lib/action/auth.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


/**
 * Renders the sign-up page with a personalized form and manages the user registration flow.
 *
 * Submits collected form data to the registration service; on successful registration navigates to the root route and on failure displays a user-facing error toast.
 *
 * @returns The rendered sign-up page as a JSX element.
 */
function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {

      fullName: '',
      email: '',
      password: '',
      country: 'IND',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
    }, mode: 'onBlur'
  })
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data);
      if (result?.success) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Sign up failed. Please try again.', {
        description: error instanceof Error ? error.message : 'Failed to create an account.'
      });
    }
  }
  return (
    <>
      <h1 className='form-title'>Sign up & personalize </h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <InputField
          placeholder='alex johnson'
          register={register}
          name='fullName'
          label='Full Name'
          validation={{ required: 'full name is required', minLength: 2 }}
          error={errors.fullName}

        />

        <InputField
          placeholder='alex@gmail.com'
          register={register}
          name='email'
          label='Email'
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email"
            }
          }}
          error={errors.email}

        />

        <InputField
          placeholder='••••••••'
          type='password'
          register={register}
          name='password'
          label='Password'
          validation={{
            required: 'password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters long' }
          }}
          error={errors.password}
        />

        <SelectField
          name='investmentGoals'
          label='Investment Goals'
          placeholder='Select your investment goals'
          control={control}
          options={INVESTMENT_GOALS}
          error={errors.investmentGoals}
        />

        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        <SelectField
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select your preferred industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />




        <Button type='submit' disabled={isSubmitting} className='w-full yellow-btn mt-5'>
          {isSubmitting ? 'Submitting...' : 'Start Your Investing Journey'}
        </Button>
      </form>

    </>
  )
}

export default SignUpPage