import React from 'react';
import { Link } from 'react-router-dom';

const BadRequest: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white">
      <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-lg mb-8">You don't have permission to access this page.</p>
      <Link to="/" className="text-primary hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default BadRequest;
