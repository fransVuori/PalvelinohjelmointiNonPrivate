import axios from "axios";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001/api"
    : "https://jp-menu-backend.onrender.com/api";

const getCategories = () => {
  return axios.get(`${baseUrl}/categories`).then(res => res.data);
};

const getCategoryItems = (categoryId, lang = "fi") => {
  return axios
    .get(`${baseUrl}/category/${categoryId}?lang=${lang}`)
    .then(res => res.data);
};

const getFilteredProducts = (lang, filters) => {
  const params = new URLSearchParams({ lang });

  Object.entries(filters).forEach(([key, value]) => {
    params.append(key, value ? "true" : "false");
  });

  return axios
    .get(`${baseUrl}/products?${params.toString()}`)
    .then(res => res.data);
};

export default {
  getCategories,
  getCategoryItems,
  getFilteredProducts
};
