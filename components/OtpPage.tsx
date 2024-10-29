"use client";

import React from "react";

interface Props {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  handleVerify: (e: React.FormEvent) => void;
}

function OtpPage({ code, setCode, handleVerify }: Props) {
  return (
    <div className="container mx-auto p-10 flex flex-col items-center justify-center gap-4">
      <div className="card w-1/3 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <p className="text-xl font-bold">SAAS</p>
          <p className="text-lg">Verification required</p>
          <form className="flex flex-col pt-4 gap-3" onSubmit={handleVerify}>
            <p>You must verify your email address before you continue</p>
            <input
              type="text"
              placeholder="Enter your verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <div className="flex justify-start">
              <button
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
