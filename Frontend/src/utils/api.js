const API_BASE_URL = "http://localhost:8000/api/v1";

const snakeToCamel = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const transformKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => transformKeys(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            let finalKey = snakeToCamel(key);
            
            // Explicit mapping for frontend naming discrepancies
            if (key === 'model_name') finalKey = 'nameModel';
            if (key === 'max_capacity_kg') finalKey = 'maxLoadCapacity';
            if (key === 'cargo_weight_kg') finalKey = 'cargoWeight';
            if (key === 'expense_date' || key === 'log_date') finalKey = 'date';
            if (key === 'amount') finalKey = 'cost';

            result[finalKey] = transformKeys(obj[key]);
            
            // Mock liters for fuel expenses
            if (key === 'expense_type' && obj[key] === 'Fuel') {
                result['liters'] = Math.round(obj['amount'] / 4);
            }
            
            return result;
        }, {});
    }
    return obj;
};

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
    
    const data = await response.json();
    return transformKeys(data);
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

export const createVehicleAPI = (v) => fetchAPI("/vehicles/", {
    method: "POST",
    body: JSON.stringify({
        registration_number: v.registrationNumber,
        model_name: v.nameModel,
        type: v.type,
        max_capacity_kg: v.maxLoadCapacity,
        odometer: v.odometer || 0,
        acquisition_cost: v.acquisitionCost,
        status: v.status || "Available"
    })
});

export const createDriverAPI = (d) => fetchAPI("/drivers/", {
    method: "POST",
    body: JSON.stringify({
        name: d.name,
        license_number: d.licenseNumber,
        license_category: d.licenseCategory,
        license_expiry_date: d.licenseExpiryDate,
        contact_number: d.contactNumber || "+91 9999900000",
        safety_score: d.safetyScore || 100
    })
});

export const createTripAPI = (t) => fetchAPI("/trips/", {
    method: "POST",
    body: JSON.stringify({
        vehicle_id: t.vehicleId,
        driver_id: t.driverId,
        source: t.source,
        destination: t.destination,
        cargo_weight_kg: t.cargoWeight,
        planned_distance: t.plannedDistance,
        revenue: t.revenue
    })
});

export const updateTripStatusAPI = (tripId, status, finalOdometer = null) => fetchAPI(`/trips/${tripId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
        status,
        final_odometer: finalOdometer
    })
});

export const createMaintenanceAPI = (m) => fetchAPI("/maintenance/", {
    method: "POST",
    body: JSON.stringify({
        vehicle_id: m.vehicleId,
        log_date: m.date || new Date().toISOString().split('T')[0],
        description: m.description,
        cost: m.cost,
        status: m.status || "Open",
        is_predictive: m.isPredictive || false
    })
});

export const updateMaintenanceStatusAPI = (logId, status) => fetchAPI(`/maintenance/${logId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
        status
    })
});


