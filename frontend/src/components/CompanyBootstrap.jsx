import { useEffect } from "react";
import { useCompany } from "../context/CompanyContext";
import { getCompany } from "../services/companyApi";

export default function CompanyBootstrap() {
  const { company, setCompany } = useCompany();

  useEffect(() => {
    if (company.logo) return; // already loaded

    async function load() {
      try {
        const res = await getCompany();
        if (!res?.data) return;

        setCompany({
          name: res.data.name || "RBK Company",
          logo: res.data.logo
            ? `${import.meta.env.VITE_API_URL}${res.data.logo}`
            : "",
        });
      } catch (e) {
        console.error("Company bootstrap failed", e);
      }
    }

    load();
  }, []);

  return null;
}
