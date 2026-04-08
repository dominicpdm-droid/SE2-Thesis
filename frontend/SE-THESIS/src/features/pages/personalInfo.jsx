export default function PersonalInfo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-8">
      <h2 className="text-2xl font-bold text-[#1E1E1E]">Personal Organization</h2>
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-[#858585]">Organization Name</p>
          <p className="text-lg font-semibold text-[#1E1E1E]">Your Organization</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-[#858585]">Members</p>
          <p className="text-lg font-semibold text-[#1E1E1E]">12 members</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-[#858585]">Role</p>
          <p className="text-lg font-semibold text-[#1E1E1E]">Administrator</p>
        </div>
      </div>
    </div>
  );
}