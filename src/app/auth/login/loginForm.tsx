'use client';

import { FormEventHandler, useEffect, useState } from 'react';
import toast, { useToasterStore } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from "../../api/auth/auth";

import { signIn, useSession } from 'next-auth/react';

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { toasts } = useToasterStore();
  // set toast limit to 3
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= 3) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (!signInResponse) {
      toast.error('Sign in error.');
      return;
    } else if (signInResponse.error) {
      toast.error(signInResponse.error);
      return;
    }

     // Reset the inactivity timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Set a new inactivity timer
    const newInactivityTimer = setTimeout(() => {
      // Perform the logout action here
      // You can redirect the user to the logout page or perform any other necessary actions
      logout(); // Call the logout function directly
    }, 5 * 1000); // 5 seconds in milliseconds
      

    setInactivityTimer(newInactivityTimer);

    // if login successful redirect to home page
    router.push('/');

    
  };

  return (
    <form onSubmit={submitHandler} noValidate>
      <div className='flex flex-col gap-2 pb-3'>
        <InputLabel text='Email' />
        <input
          formNoValidate
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='email'
          placeholder='enter your email...'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className='flex flex-col gap-2 pb-3'>
        <InputLabel text='Password' />
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='password'
          placeholder='enter your password...'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className="flex mt-5 justify-between">
        <Link href="/reset/password" className="text-[#3b7bca] underline">
          Forgot password
        </Link>
        <Link href="/auth/register" className="text-[#3b7bca] underline">
          Register
        </Link>
      </div>
      <input
        className="py-2 px-4 bg-[#f0f0f0] mt-12 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
        type="submit"
        value="Login"
      />
    </form>
  );
};

const InputLabel = ({ text }: { text: string }) => {
  return <p className='text-[#555]'>{text}</p>;
};

export default LoginForm;
