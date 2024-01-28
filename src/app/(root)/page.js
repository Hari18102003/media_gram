"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [wait, setWait] = useState();
  const [login, setLogin] = useState(false);
  const session = useSession();
  const { status } = session;

  async function handleLogin(e) {
    setError("");
    setWait(true);
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res.error) {
      setWait(false);
      setError("Invalid Email or password");
      setPassword("");
    } else {
      setWait(false);
      setLogin(true);
    }
  }

  if (status === "authenticated") {
    redirect("/dashboard");
  }

  if (login) {
    redirect("/dashboard");
  }

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center justify-center my-5 md:my-2">
          <Image src={"/images/logo.png"} alt="logo-image" width={50} height={50} />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Media Gram</h1>
        </div>
        <div className="w-full bg-gray-800 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl leading-tight text-center tracking-tight md:text-2xl text-white">
              Login
            </h1>
            {error && <p className='text-center py-3 bg-red-200 border border-red-500'>{error}</p>}
            {wait && <p className='text-center py-3 bg-gray-100 border border-gray-500'>Please wait...</p>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" id="email" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="email" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" id="password" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="password" />
              </div>
              <button type="submit" className="w-full text-white font-semibold focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-r from-purple-400 to-pink-600">Login</button>
              <p className="text-sm font-light text-gray-500">
                New account? <Link href="/register" className="font-medium text-primary-600 hover:underline">create account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
