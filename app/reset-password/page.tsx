import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BackgroundBeams } from '@/components/authentication/BackgroundBeams'
import NavbarComponent from '@/components/landingPage/Navbar'
import { ResetPasswordForm } from '@/components/authentication/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | Your App Name',
  description: 'Reset your account password securely',
  robots: 'noindex, nofollow' // Prevent search indexing of password reset pages
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre className="mt-2 text-sm">{error.message}</pre>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <NavbarComponent />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
        <BackgroundBeams />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 animate-pulse h-96" />
          }>
            <div className="relative z-10 w-full max-w-md">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                  Reset Password
                </h1>
                <ResetPasswordForm />
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}