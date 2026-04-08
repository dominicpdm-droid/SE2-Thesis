import React, { useState } from "react";

export default function OrganizationPage() {
  return (
    <div className="w-full h-full bg-[#E4E3E1] min-h-0">
      <section className="relative w-full h-full flex flex-col gap-6 min-h-0">
        <div className="w-full flex flex-row items-end justify-between text-[#1E1E1E] opacity-75">
          <h1 className="text-subheader font-bold">Organization</h1>
        </div>
        <div className="w-full h-full min-h-0 rounded-2xl shadow-outside-dropshadow flex flex-col bg-white">
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center gap-4">
            <h2 className="text-title text-[#1E1E1E]">Organization Settings</h2>
            <p className="text-subtitle text-[#666]">Manage your organization here</p>
          </div>
        </div>
      </section>
    </div>
  );
}
