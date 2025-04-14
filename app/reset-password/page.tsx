'use client';

// Option 1: Keep force-dynamic with renamed export
export const dynamicConfig = 'force-dynamic';

// Option 2: Or use this alternative syntax
// export const revalidate = 0; // Alternative to force-dynamic

import React from 'react';
import dynamic from 'next/dynamic';
import NavbarComponent from '@/components/landingPage/Navbar';
import { ResetPasswordForm } from '@/components/authentication/ResetPasswordForm';

const BackgroundBeams = dynamic(
  () => import('@/components/authentication/BackgroundBeams').then(mod => mod.BackgroundBeams),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gray-100/30" />
  }
);

const Page = () => {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <NavbarComponent />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <BackgroundBeams />
        <div className="relative z-10">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
};

export default Page;