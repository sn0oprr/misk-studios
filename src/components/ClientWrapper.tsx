'use client';

import { AuthProvider } from '@/contexts/AuthContext';

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper = ({ children }: ClientWrapperProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default ClientWrapper;
