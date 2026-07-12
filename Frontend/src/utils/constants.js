export const ROLES = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];

export const INITIAL_VEHICLES = [
    { id: "v1", registrationNumber: "GJ-01-AA-1234", nameModel: "Van-05", type: "Van", maxLoadCapacity: 500, odometer: 12000, acquisitionCost: 15000, status: "Available" },
    { id: "v2", registrationNumber: "MH-02-BB-5678", nameModel: "Volvo FH16", type: "Semi-Truck", maxLoadCapacity: 20000, odometer: 85000, acquisitionCost: 95000, status: "On Trip" },
    { id: "v3", registrationNumber: "DL-03-CC-9012", nameModel: "Tata Isuzu Mux", type: "Pickup", maxLoadCapacity: 12000, odometer: 45000, acquisitionCost: 35000, status: "In Shop" }
];

export const INITIAL_DRIVERS = [
    { id: "d1", name: "Alex", licenseNumber: "DL-IND-9988", licenseCategory: "Light Vehicle", licenseExpiryDate: "2028-12-31", contactNumber: "+91 9876543210", safetyScore: 95, status: "Available" },
    { id: "d2", name: "Rajesh Kumar", licenseNumber: "DL-IND-4455", licenseCategory: "Heavy Commercial", licenseExpiryDate: "2027-05-14", contactNumber: "+91 9998887776", safetyScore: 88, status: "On Trip" },
    { id: "d3", name: "John Doe", licenseNumber: "DL-IND-1122", licenseCategory: "Commercial", licenseExpiryDate: "2024-01-01", contactNumber: "+91 8887776665", safetyScore: 72, status: "Available" }
];

export const INITIAL_TRIPS = [
    { id: "t1", source: "Mundra Port", destination: "Ahmedabad ICD", vehicleId: "v2", driverId: "d2", cargoWeight: 18000, plannedDistance: 350, revenue: 2500, status: "Dispatched" }
];

export const INITIAL_MAINTENANCE = [
    { id: "m1", vehicleId: "v3", description: "Engine Oil & Filter Change", cost: 450, date: "2026-07-10", status: "Active" }
];

export const INITIAL_FUEL = [
    { id: "f1", vehicleId: "v2", liters: 120, cost: 180, date: "2026-07-11" }
];

export const INITIAL_EXPENSES = [
    { id: "e1", vehicleId: "v2", type: "Toll", amount: 45, date: "2026-07-11" }
];
