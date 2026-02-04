import { createContext, useContext, useEffect, useState } from "react";

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const stored = localStorage.getItem("company");

  const [company, setCompany] = useState(
    stored ? JSON.parse(stored) : { name: "RBK Company", logo: "" },
  );

  // persist on change
  useEffect(() => {
    localStorage.setItem("company", JSON.stringify(company));
  }, [company]);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}
