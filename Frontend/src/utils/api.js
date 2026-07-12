const API_BASE_URL = "http://localhost:8000/api/v1";

// Helper function to handle fetch calls
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include", // Required for session cookies
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    
    return await response.json();
}

export const fetchVehicles = () => fetchAPI("/vehicles/");
export const fetchTrips = () => fetchAPI("/trips/");
export const fetchDrivers = () => fetchAPI("/drivers/");
export const fetchMaintenance = () => fetchAPI("/maintenance/");
export const fetchExpenses = () => fetchAPI("/expenses/");

export const loginUser = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }
    return await response.json();
};
