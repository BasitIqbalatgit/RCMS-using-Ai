import type { Metadata } from 'next'
import { BackgroundBeams } from '@/components/authentication/BackgroundBeams'
import NavbarComponent from '@/components/landingPage/Navbar'
import { ResetPasswordForm } from '@/components/authentication/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | Your App Name',
  description: 'Reset your account password securely',
  robots: 'noindex, nofollow'
}

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <NavbarComponent />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
        <BackgroundBeams />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
              Reset Password
            </h1>
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </main>
  )
}