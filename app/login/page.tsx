import React from 'react';
import { LoginForm } from '@/components/authentication/LoginForm';
import { BackgroundBeams } from '@/components/authentication/BackgroundBeams';
import NavbarComponent from '@/components/landingPage/Navbar';

const Page = () => {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <NavbarComponent />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <BackgroundBeams />
        <div className="relative z-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default Page;