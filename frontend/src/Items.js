import axios from 'axios'

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001/api/menu-items"
    : "https://jp-menu-backend.onrender.com/api/menu-items";


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll }