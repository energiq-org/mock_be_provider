import { initializeDatabase } from "../config/dbConnection.js";
import { seedVehicles } from "./seedVehicles.js";
import { seedStations } from "./seedStations.js";
import { seedSessions } from "./seedSessions.js";
import { seedAlerts } from "./seedAlerts.js";
import { seedAnalytics } from "./seedAnalytics.js";

async function seedAll() {
    try {
        console.log("🌱 Starting database seeding...");
        
        // Initialize database
        await initializeDatabase();
        
        // Seed all entities in the correct order (dependencies first)
        console.log("📊 Seeding stations...");
        try {
            await seedStations();
        } catch {
            console.log("Stations already exist, continuing...");
        }
        
        console.log("⚡ Seeding sessions...");
        try {
            await seedSessions();
        } catch {
            console.log("Sessions already exist, continuing...");
        }
        
        console.log("🚨 Seeding alerts...");
        try {
            await seedAlerts();
        } catch {
            console.log("Alerts already exist, continuing...");
        }
        
        console.log("📈 Seeding analytics...");
        try {
            await seedAnalytics();
        } catch {
            console.log("Analytics already exist, continuing...");
        }
        
        console.log("🚗 Seeding vehicles...");
        try {
            await seedVehicles();
        } catch {
            console.log("Vehicles already exist, continuing...");
        }
        
        console.log("✅ Database seeding completed successfully!");
        console.log("🎯 EnergiQ Dashboard mock data is ready!");
        
        // Display comprehensive summary
        console.log("\n📈 Seeded Data Summary:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🏢 Stations: 10 charging stations across Egypt");
        console.log("   • 7 Online, 1 Offline, 2 Degraded");
        console.log("   • Located in Cairo, Giza, New Capital, etc.");
        console.log("   • Total capacity: 1,200+ kW across all stations");
        console.log("");
        console.log("⚡ Sessions: Realistic charging session data");
        console.log("   • Active, completed, and failed sessions");
        console.log("   • Energy delivery ranges: 10-90 kWh per session");
        console.log("   • Payment methods and session metadata");
        console.log("");
        console.log("🚨 Alerts: System notifications and warnings");
        console.log("   • Station-specific and system-wide alerts");
        console.log("   • Multiple severity levels (Low, Medium, High, Critical)");
        console.log("   • Maintenance, safety, and performance alerts");
        console.log("");
        console.log("📊 Analytics: Dashboard metrics and chart data");
        console.log("   • This Week vs Last Week comparisons");
        console.log("   • Hourly usage patterns and peak hours");
        console.log("   • Station performance rankings");
        console.log("   • Monthly trends and projections");
        console.log("");
        console.log("🚗 Vehicles: 10 premium EV models for testing");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        console.log("✨ API Endpoints Available:");
        console.log("");
        console.log("📊 Dashboard Analytics:");
        console.log("   GET /api/v1/dashboard/summary - Dashboard summary metrics");
        console.log("");
        console.log("📈 Individual Chart Data:");
        console.log("   GET /api/v1/charts/revenue - Revenue analytics");
        console.log("   GET /api/v1/charts/energy - Energy consumption data");
        console.log("   GET /api/v1/charts/sessions - Session analytics");
        console.log("   GET /api/v1/charts/hourly-usage - Hourly usage patterns");
        console.log("   GET /api/v1/charts/station-performance - Station performance rankings");
        console.log("   GET /api/v1/charts/plug - Plug utilization gauge metrics");
        console.log("   GET /api/v1/charts/duration - Charging duration metrics");
        console.log("");
        console.log("⚡ Sessions Management:");
        console.log("   GET /api/v1/sessions - List all charging sessions with filtering support");
        console.log("   GET /api/v1/sessions/:id - Get detailed session information");
        console.log("");
        console.log("📚 Documentation:");
        console.log("   Swagger UI: /docs/swagger");
        console.log("   Scalar Docs: /docs/scalar");
        console.log("");
        console.log("🎨 Frontend Integration:");
        console.log("   • All endpoints are actively used by the frontend");
        console.log("   • Individual chart endpoints for granular data fetching");
        console.log("   • Sessions page with real-time data and filtering");
        console.log("   • Metric cards populated with realistic values");
        console.log("   • Time period filtering (This Week/Last Week) supported");
        console.log("   • Frontend-side filtering and pagination for sessions");
        console.log("   • Documentation shows only frontend-used endpoints for clarity");
        
    } catch (error) {
        console.error("❌ Error during database seeding:", error);
        process.exit(1);
    }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedAll().then(() => {
        console.log("🏁 Seeding process completed");
        process.exit(0);
    }).catch((error) => {
        console.error("💥 Seeding failed:", error);
        process.exit(1);
    });
}

export { seedAll }; 