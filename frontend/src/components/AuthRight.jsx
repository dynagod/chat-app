import React from 'react';
import { MessageSquare } from 'lucide-react';

const AuthRight = () => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center p-12">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-base-content">Connect Instantly</h2>
        <p className="text-base-content/60 max-w-md">
          Join our platform to chat, share, and connect with friends and communities in real-time.
        </p>
      </div>
    </div>
  );
};

export default AuthRight;