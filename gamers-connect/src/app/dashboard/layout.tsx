// src/app/dashboard/layout.tsx
import React from 'react';
import PresencePinger from '@/components/PresencePinger';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PresencePinger />
      {children}
    </>
  );
}
