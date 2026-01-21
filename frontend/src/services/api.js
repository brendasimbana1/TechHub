import { toast } from 'react-hot-toast';

let isRedirecting = false;

export const fetchAuthorized = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      if (isRedirecting) {
        return { sessionExpired: true };
      }

      isRedirecting = true;

      toast.error("Tu sesión ha caducado.", {
        duration: 4000,
        position: 'top-center',
      });
      
      localStorage.clear();

      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
      
      return { sessionExpired: true }; 
    }

    return response;

  } catch (error) {
    console.error("Error de red:", error);
    throw error;
  }
};