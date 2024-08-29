import React from 'react';

const SignUp = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-6">Sign Up</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignUp;
