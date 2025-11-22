import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "true",
	},
});

// Response interceptor to handle errors gracefully
axiosInstance.interceptors.response.use(
	(response) => {
		// Return successful responses as is
		return response;
	},
	(error) => {
		// If there's a response from the server (4xx, 5xx), return it as data
		// instead of throwing an error
		if (error.response) {
			// Transform error response to include success: false
			return Promise.resolve({
				...error.response,
			});
		}
		// For network errors or timeouts, reject the promise
		return Promise.reject(error);
	}
);

export default axiosInstance;
