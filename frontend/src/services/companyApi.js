import API from "./api";

export const getCompany = () => API.get("/company");

export const saveCompany = (data) => API.post("/company", data);

export const uploadLogo = (logo) => {
  const formData = new FormData();
  formData.append("logo", logo);
  return API.post("/company/upload-logo", formData);
};
