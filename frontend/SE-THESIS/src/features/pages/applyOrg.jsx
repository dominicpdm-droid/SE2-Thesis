import { useState, useEffect } from "react";
import { addOrganization, getOrganization } from "../../shared/services/organization";

export default function ApplyOrg() {
  const [orgName, setOrgName] = useState("");
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getOrganization();
        setOrganizations(orgs);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addOrganization({ org_name: orgName });
      setOrgName("");
    } catch (error) {
      console.error("Error adding organization:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-4 flex-1">
        <input
          type="text"
          placeholder="Search organizations..."
          className="w-full h-9 px-4 py-1 text-base border border-[#d4d3d1] rounded-full shadow-inner focus:outline-none focus:border-[#858585] bg-[#E4E3E1]"
        />
        <div className="flex-1 bg-[#E4E3E1] border border-[#d4d3d1] rounded-xl shadow-inner overflow-y-auto">
          {organizations.map((org) => (
            <div key={org._id} className="py-2 px-3 text-lg hover:bg-[#A7A7A3] cursor-pointer rounded">
              {org.organization_name}
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <button 
            className="w-62 h-10 bg-[#A1A2A6] text-white px-6 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300"
            onClick={handleSubmit}
          >
            Add Organization
          </button>
          <button className="w-62 h-10 bg-[#A1A2A6] text-white px-6 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}