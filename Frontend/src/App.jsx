import React, { useState, useMemo } from "react";
import { Truck } from "lucide-react";

import {
    ROLES
} from "./utils/constants.js";

import {
    loginUser, fetchVehicles, fetchTrips, fetchDrivers, fetchMaintenance, fetchExpenses
} from "./utils/api.js";

// Layout
import Sidebar from "./components/Layout/Sidebar.jsx";
import Topbar from "./components/Layout/Topbar.jsx";

// Tabs
import DashboardHub from "./components/Tabs/DashboardHub.jsx";
import VehicleRegistry from "./components/Tabs/VehicleRegistry.jsx";
import DriverDirectory from "./components/Tabs/DriverDirectory.jsx";
import TripDispatcher from "./components/Tabs/TripDispatcher.jsx";
import MaintenanceLogs from "./components/Tabs/MaintenanceLogs.jsx";
import ExpenseLedger from "./components/Tabs/ExpenseLedger.jsx";
import AnalyticsROI from "./components/Tabs/AnalyticsROI.jsx";

// Modals
import VehicleModal from "./components/Modals/VehicleModal.jsx";
import DriverModal from "./components/Modals/DriverModal.jsx";
import TripModal from "./components/Modals/TripModal.jsx";
import MaintenanceModal from "./components/Modals/MaintenanceModal.jsx";
import ExpenseModal from "./components/Modals/ExpenseModal.jsx";
import CompletionModal from "./components/Modals/CompletionModal.jsx";

export default function App() {
    // --- Global App Authentication States ---
    const [user, setUser] = useState(null); // default to null to show login
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authRole, setAuthRole] = useState("Fleet Manager");
    const [isLoading, setIsLoading] = useState(false);

    // --- UI Layout Modulators ---
    const [currentTab, setCurrentTab] = useState("dashboard");
    const [darkMode, setDarkMode] = useState(false);

    // --- Core Entity States ---
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [maintenanceLogs, setMaintenanceLogs] = useState([]);
    const [fuelLogs, setFuelLogs] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // --- Filter/Search Query Streams ---
    const [globalSearch, setGlobalSearch] = useState("");
    const [vehicleFilterType, setVehicleFilterType] = useState("");
    const [vehicleFilterStatus, setVehicleFilterStatus] = useState("");

    // --- Dynamic Form Visibility Flags ---
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ registrationNumber: "", nameModel: "", type: "Van", maxLoadCapacity: "", odometer: "", acquisitionCost: "", status: "Available" });

    const [showDriverModal, setShowDriverModal] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: "", licenseNumber: "", licenseCategory: "Commercial", licenseExpiryDate: "", contactNumber: "", safetyScore: 100, status: "Available" });

    const [showTripModal, setShowTripModal] = useState(false);
    const [newTrip, setNewTrip] = useState({ source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", plannedDistance: "", revenue: "" });

    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [newMaint, setNewMaint] = useState({ vehicleId: "", description: "", cost: "", date: "" });

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [newExp, setNewExp] = useState({ vehicleId: "", type: "Toll", amount: "", date: new Date().toISOString().split('T')[0], isFuel: false, liters: "" });

    const [tripCompletionModal, setTripCompletionModal] = useState({ show: false, tripId: "" });
    const [completionData, setCompletionData] = useState({ finalOdometer: 0, fuelConsumed: "", fuelCost: "" });

    // ==========================================
    // 3. REAL-TIME MATH ENGINE (FINANCIALS & METRICS)
    // ==========================================
    const financialsPerVehicle = useMemo(() => {
        const data = {};
        vehicles.forEach(v => {
            data[v.id] = { fuelCost: 0, maintenanceCost: 0, totalCost: 0, revenue: 0, miles: 0, fuelLiters: 0 };
        });

        fuelLogs.forEach(f => {
            if (data[f.vehicleId]) {
                data[f.vehicleId].fuelCost += f.cost;
                data[f.vehicleId].fuelLiters += f.liters;
            }
        });

        maintenanceLogs.forEach(m => {
            if (data[m.vehicleId]) data[m.vehicleId].maintenanceCost += m.cost;
        });

        trips.forEach(t => {
            if (data[t.vehicleId] && t.status === "Completed") {
                data[t.vehicleId].revenue += t.revenue;
                data[t.vehicleId].miles += t.plannedDistance;
            }
        });

        Object.keys(data).forEach(id => {
            data[id].totalCost = data[id].fuelCost + data[id].maintenanceCost;
        });

        return data;
    }, [vehicles, fuelLogs, maintenanceLogs, trips]);

    const kpis = useMemo(() => {
        const totalVehicles = vehicles.length;
        const activeVehicles = vehicles.filter(v => v.status === "On Trip").length;
        const availableVehicles = vehicles.filter(v => v.status === "Available").length;
        const inShopVehicles = vehicles.filter(v => v.status === "In Shop").length;
        const activeTrips = trips.filter(t => t.status === "Dispatched").length;
        const pendingTrips = trips.filter(t => t.status === "Draft").length;
        const driversOnDuty = drivers.filter(d => d.status === "On Trip" || d.status === "Available").length;

        const utilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

        return { activeVehicles, availableVehicles, inShopVehicles, activeTrips, pendingTrips, driversOnDuty, utilization };
    }, [vehicles, drivers, trips]);

    // ==========================================
    // 4. BUSINESS ACTION VALIDATION ENGINE
    // ==========================================
    
    // Fetch all initial data
    React.useEffect(() => {
        if (user) {
            const loadData = async () => {
                try {
                    const promises = [];
                    // Vehicles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst (everyone)
                    promises.push(fetchVehicles().then(setVehicles));
                    
                    // Drivers: Fleet Manager, Dispatcher, Safety Officer
                    if (["Fleet Manager", "Dispatcher", "Safety Officer"].includes(user.role)) {
                        promises.push(fetchDrivers().then(setDrivers));
                    }
                    
                    // Trips: Fleet Manager, Dispatcher
                    if (["Fleet Manager", "Dispatcher"].includes(user.role)) {
                        promises.push(fetchTrips().then(setTrips));
                    }

                    await Promise.all(promises);
                } catch (error) {
                    console.error("Failed to load initial data", error);
                    alert("Failed to load data from server. " + error.message);
                }
            };
            loadData();
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (authEmail && authPassword) {
            setIsLoading(true);
            try {
                const loggedInUser = await loginUser(authEmail, authPassword);
                setUser({ email: loggedInUser.email, role: loggedInUser.role, id: loggedInUser.id });
                
                const role = loggedInUser.role;
                if (role === "Fleet Manager") setCurrentTab("vehicles");
                else if (role === "Dispatcher") setCurrentTab("dashboard");
                else if (role === "Safety Officer") setCurrentTab("drivers");
                else if (role === "Financial Analyst") setCurrentTab("expenses");
            } catch (err) {
                alert(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const createVehicle = (e) => {
        e.preventDefault();
        if (vehicles.some(v => v.registrationNumber.toUpperCase() === newVehicle.registrationNumber.toUpperCase())) {
            return alert("Error Rule Violation: The vehicle registration number must be completely unique.");
        }

        setVehicles([...vehicles, {
            ...newVehicle,
            id: "v_" + Date.now(),
            registrationNumber: newVehicle.registrationNumber.toUpperCase(),
            maxLoadCapacity: Number(newVehicle.maxLoadCapacity),
            odometer: Number(newVehicle.odometer || 0),
            acquisitionCost: Number(newVehicle.acquisitionCost)
        }]);
        setShowVehicleModal(false);
    };

    const createDriver = (e) => {
        e.preventDefault();
        setDrivers([...drivers, {
            ...newDriver,
            id: "d_" + Date.now(),
            safetyScore: Number(newDriver.safetyScore)
        }]);
        setShowDriverModal(false);
    };

    const executeTripDispatch = (e) => {
        e.preventDefault();
        const selectedVehicle = vehicles.find(v => v.id === newTrip.vehicleId);
        const selectedDriver = drivers.find(d => d.id === newTrip.driverId);

        if (!selectedVehicle || !selectedDriver) return;

        if (selectedVehicle.status === "Retired" || selectedVehicle.status === "In Shop") {
            return alert("Error: Retired or In Shop vehicles must never be assigned to a trip.");
        }
        const isExpired = new Date(selectedDriver.licenseExpiryDate) < new Date();
        if (isExpired || selectedDriver.status === "Suspended") {
            return alert("Error: Drivers with expired licenses or Suspended status cannot be assigned to trips.");
        }
        if (selectedVehicle.status === "On Trip" || selectedDriver.status === "On Trip") {
            return alert("Error: A driver or vehicle already marked On Trip cannot be assigned to another trip.");
        }
        if (Number(newTrip.cargoWeight) > selectedVehicle.maxLoadCapacity) {
            return alert(`Error: Cargo Weight exceeds the vehicle's maximum load capacity of ${selectedVehicle.maxLoadCapacity} kg.`);
        }

        setVehicles(vehicles.map(v => v.id === newTrip.vehicleId ? { ...v, status: "On Trip" } : v));
        setDrivers(drivers.map(d => d.id === newTrip.driverId ? { ...d, status: "On Trip" } : d));

        setTrips([...trips, {
            ...newTrip,
            id: "t_" + Date.now(),
            cargoWeight: Number(newTrip.cargoWeight),
            plannedDistance: Number(newTrip.plannedDistance),
            revenue: Number(newTrip.revenue),
            status: "Dispatched"
        }]);
        setShowTripModal(false);
    };

    const handleCancelTrip = (tripId) => {
        const target = trips.find(t => t.id === tripId);
        if (!target) return;

        setVehicles(vehicles.map(v => v.id === target.vehicleId ? { ...v, status: "Available" } : v));
        setDrivers(drivers.map(d => d.id === target.driverId ? { ...d, status: "Available" } : d));
        setTrips(trips.map(t => t.id === tripId ? { ...t, status: "Cancelled" } : t));
    };

    const openCompletionInterface = (tripId) => {
        const t = trips.find(trip => trip.id === tripId);
        const v = vehicles.find(veh => veh.id === t?.vehicleId);
        setCompletionData({ finalOdometer: (v?.odometer || 0) + (t?.plannedDistance || 100), fuelConsumed: 40, fuelCost: 60 });
        setTripCompletionModal({ show: true, tripId });
    };

    const submitTripCompletion = (e) => {
        e.preventDefault();
        const targetTrip = trips.find(t => t.id === tripCompletionModal.tripId);
        if (!targetTrip) return;

        setVehicles(vehicles.map(v => v.id === targetTrip.vehicleId ? { ...v, status: "Available", odometer: Number(completionData.finalOdometer) } : v));
        setDrivers(drivers.map(d => d.id === targetTrip.driverId ? { ...d, status: "Available" } : d));

        setFuelLogs([...fuelLogs, {
            id: "f_" + Date.now(),
            vehicleId: targetTrip.vehicleId,
            liters: Number(completionData.fuelConsumed),
            cost: Number(completionData.fuelCost),
            date: new Date().toISOString().split('T')[0]
        }]);

        setTrips(trips.map(t => t.id === tripCompletionModal.tripId ? { ...t, status: "Completed", fuelConsumed: Number(completionData.fuelConsumed) } : t));
        setTripCompletionModal({ show: false, tripId: "" });
    };

    const executeMaintenanceLogging = (e) => {
        e.preventDefault();
        setVehicles(vehicles.map(v => v.id === newMaint.vehicleId ? { ...v, status: "In Shop" } : v));
        setMaintenanceLogs([...maintenanceLogs, {
            ...newMaint,
            id: "m_" + Date.now(),
            cost: Number(newMaint.cost),
            status: "Active"
        }]);
        setShowMaintenanceModal(false);
    };

    const closeMaintenanceRecord = (id) => {
        const log = maintenanceLogs.find(m => m.id === id);
        if (!log) return;

        setVehicles(vehicles.map(v => v.id === log.vehicleId ? { ...v, status: v.status === "Retired" ? "Retired" : "Available" } : v));
        setMaintenanceLogs(maintenanceLogs.map(m => m.id === id ? { ...m, status: "Closed" } : m));
    };

    const createStandaloneExpense = (e) => {
        e.preventDefault();
        if (newExp.isFuel) {
            setFuelLogs([...fuelLogs, { id: "f_" + Date.now(), vehicleId: newExp.vehicleId, liters: Number(newExp.liters), cost: Number(newExp.amount), date: newExp.date }]);
        } else {
            setExpenses([...expenses, { id: "e_" + Date.now(), vehicleId: newExp.vehicleId, type: newExp.type, amount: Number(newExp.amount), date: newExp.date }]);
        }
        setShowExpenseModal(false);
    };

    const handleExportDataCSV = (datasetType) => {
        let headers = [];
        let rows = [];

        if (datasetType === 'vehicles') {
            headers = ['Reg Number', 'Model', 'Type', 'Max Load', 'Odometer', 'Status'];
            rows = vehicles.map(v => [v.registrationNumber, v.nameModel, v.type, v.maxLoadCapacity.toString(), v.odometer.toString(), v.status]);
        } else if (datasetType === 'drivers') {
            headers = ['Name', 'License', 'Category', 'Expiry', 'Safety Score', 'Status'];
            rows = drivers.map(d => [d.name, d.licenseNumber, d.licenseCategory, d.licenseExpiryDate, d.safetyScore.toString(), d.status]);
        } else {
            headers = ['Source', 'Destination', 'Weight', 'Distance', 'Revenue', 'Status'];
            rows = trips.map(t => [t.source, t.destination, t.cargoWeight.toString(), t.plannedDistance.toString(), t.revenue.toString(), t.status]);
        }

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `TransitOps_${datasetType}_Report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-900">
                <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full border border-slate-200">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-600 p-2 rounded-xl text-white"><Truck className="h-6 w-6" /></div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">TransitOps</h1>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Smart Fleet Hub</p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-4">Sign in to Platform</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Corporate Email Address</label>
                            <input type="email" required placeholder="manager@transitops.com" className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Security Password</label>
                            <input type="password" required placeholder="••••••••" className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">ROLE (RBAC)</label>
                            <select className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={authRole} onChange={e => {
                                const newRole = e.target.value;
                                setAuthRole(newRole);
                                if (newRole === "Fleet Manager") setAuthEmail("manager@transitops.com");
                                else if (newRole === "Dispatcher") setAuthEmail("dispatcher@transitops.com");
                                else if (newRole === "Safety Officer") setAuthEmail("safety@transitops.com");
                                else if (newRole === "Financial Analyst") setAuthEmail("finance@transitops.com");
                            }}>
                                <option value="Fleet Manager">Fleet Manager</option>
                                <option value="Dispatcher">Dispatcher</option>
                                <option value="Safety Officer">Safety Officer</option>
                                <option value="Financial Analyst">Financial Analyst</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50">
                            {isLoading ? "Authenticating..." : "Access Terminal"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex font-sans transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <Sidebar
                darkMode={darkMode} setDarkMode={setDarkMode}
                user={user} setUser={setUser}
                currentTab={currentTab} setCurrentTab={setCurrentTab}
            />

            <main className="flex-1 p-8 overflow-y-auto h-screen max-w-7xl mx-auto w-full">
                <Topbar
                    currentTab={currentTab} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch}
                />

                {currentTab === "dashboard" && (
                    <DashboardHub
                        kpis={kpis} trips={trips} vehicles={vehicles} drivers={drivers} user={user}
                        openCompletionInterface={openCompletionInterface}
                        setCurrentTab={setCurrentTab} setShowTripModal={setShowTripModal}
                        setShowMaintenanceModal={setShowMaintenanceModal} setShowExpenseModal={setShowExpenseModal}
                    />
                )}
                {currentTab === "vehicles" && (
                    <VehicleRegistry
                        vehicles={vehicles} vehicleFilterType={vehicleFilterType} setVehicleFilterType={setVehicleFilterType}
                        vehicleFilterStatus={vehicleFilterStatus} setVehicleFilterStatus={setVehicleFilterStatus}
                        globalSearch={globalSearch} handleExportDataCSV={handleExportDataCSV} user={user}
                        setShowVehicleModal={setShowVehicleModal}
                    />
                )}
                {currentTab === "drivers" && (
                    <DriverDirectory
                        drivers={drivers} globalSearch={globalSearch} handleExportDataCSV={handleExportDataCSV}
                        user={user} setShowDriverModal={setShowDriverModal}
                    />
                )}
                {currentTab === "trips" && (
                    <TripDispatcher
                        trips={trips} vehicles={vehicles} drivers={drivers} user={user}
                        handleExportDataCSV={handleExportDataCSV} setShowTripModal={setShowTripModal}
                        handleCancelTrip={handleCancelTrip} openCompletionInterface={openCompletionInterface}
                    />
                )}
                {currentTab === "maintenance" && (
                    <MaintenanceLogs
                        maintenanceLogs={maintenanceLogs} vehicles={vehicles} user={user}
                        setShowMaintenanceModal={setShowMaintenanceModal} closeMaintenanceRecord={closeMaintenanceRecord}
                    />
                )}
                {currentTab === "expenses" && (
                    <ExpenseLedger
                        fuelLogs={fuelLogs} expenses={expenses} vehicles={vehicles} user={user}
                        setShowExpenseModal={setShowExpenseModal}
                    />
                )}
                {currentTab === "analytics" && (
                    <AnalyticsROI
                        vehicles={vehicles} financialsPerVehicle={financialsPerVehicle}
                    />
                )}
            </main>

            <VehicleModal
                showVehicleModal={showVehicleModal} setShowVehicleModal={setShowVehicleModal}
                createVehicle={createVehicle} newVehicle={newVehicle} setNewVehicle={setNewVehicle}
            />
            <DriverModal
                showDriverModal={showDriverModal} setShowDriverModal={setShowDriverModal}
                createDriver={createDriver} newDriver={newDriver} setNewDriver={setNewDriver}
            />
            <TripModal
                showTripModal={showTripModal} setShowTripModal={setShowTripModal}
                executeTripDispatch={executeTripDispatch} newTrip={newTrip} setNewTrip={setNewTrip}
                vehicles={vehicles} drivers={drivers}
            />
            <CompletionModal
                tripCompletionModal={tripCompletionModal} setTripCompletionModal={setTripCompletionModal}
                submitTripCompletion={submitTripCompletion} completionData={completionData} setCompletionData={setCompletionData}
            />
            <MaintenanceModal
                showMaintenanceModal={showMaintenanceModal} setShowMaintenanceModal={setShowMaintenanceModal}
                executeMaintenanceLogging={executeMaintenanceLogging} newMaint={newMaint} setNewMaint={setNewMaint}
                vehicles={vehicles}
            />
            <ExpenseModal
                showExpenseModal={showExpenseModal} setShowExpenseModal={setShowExpenseModal}
                createStandaloneExpense={createStandaloneExpense} newExp={newExp} setNewExp={setNewExp}
                vehicles={vehicles}
            />
        </div>
    );
}
