import { Session, SessionStatus, PaymentMethod } from "../models/session.js";
import { Station } from "../models/station.js";
import { AppDataSource } from "../config/dbConnection.js";

async function seedSessions() {
    try {
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Database connection established for sessions seeding");

        // Check if sessions already exist
        const existingSessions = await Session.count();
        if (existingSessions > 0) {
            console.log("Sessions already exist in database. Skipping seeding.");
            return;
        }

        // Get all stations to associate sessions with
        const stations = await Station.find();
        if (stations.length === 0) {
            console.log("No stations found. Please seed stations first.");
            return;
        }

        const sessionsData: Partial<Session>[] = [];
        
        // Email list for realistic users
        const users = [
            "reem12@gmail.com",
            "ahmed.hassan@gmail.com", 
            "sarah.mohamed@yahoo.com",
            "omar.ali@hotmail.com",
            "fatma.ibrahim@gmail.com",
            "mohamed.ahmed@outlook.com",
            "nour.hassan@gmail.com",
            "khaled.omar@yahoo.com"
        ];

        // Generate sessions for each station based on their total_sessions count
        for (const station of stations) {
            const sessionCount = Math.min(station.total_sessions, 50); // Limit for demo
            
            for (let i = 0; i < sessionCount; i++) {
                const startTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
                const duration = Math.floor(Math.random() * 180) + 15; // 15-195 minutes
                const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
                
                const energyDelivered = Math.random() * 80 + 10; // 10-90 kWh
                const costPerKwh = 3.0 + Math.random() * 2.0; // 3-5 EGP per kWh
                const totalCost = energyDelivered * costPerKwh;
                
                // Create realistic status distribution
                const statuses = [SessionStatus.PAID, SessionStatus.PAID, SessionStatus.PAID, SessionStatus.IN_PROGRESS, SessionStatus.FAILED];
                const status = i < 3 && station.active_sessions > i ? SessionStatus.IN_PROGRESS : 
                            statuses[Math.floor(Math.random() * statuses.length)];
                
                // Assign user (80% real emails, 20% guests)
                const isGuest = Math.random() < 0.2;
                const user = isGuest ? `user_${Math.floor(Math.random() * 100) + 1}` : users[Math.floor(Math.random() * users.length)];
                
                // Payment methods
                const paymentMethods = [PaymentMethod.CREDIT_CARD, PaymentMethod.WALLET, PaymentMethod.SUBSCRIPTION];
                const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                
                // Connector types
                const connectorTypes = ["Type 2 - Port 1", "Type 2 - Port 2", "CCS - Port 1", "CHAdeMO - Port 1"];
                const connectorId = connectorTypes[Math.floor(Math.random() * connectorTypes.length)];
                
                sessionsData.push({
                    station_id: station.id,
                    user_id: user,
                    charger_id: `CHG-${station.id}-${Math.floor(Math.random() * station.chargers_count) + 1}`,
                    connector_id: connectorId,
                    status,
                    start_time: startTime,
                    end_time: status === SessionStatus.IN_PROGRESS ? undefined : endTime,
                    energy_delivered: status === SessionStatus.IN_PROGRESS ? energyDelivered * 0.3 : energyDelivered,
                    cost: status === SessionStatus.IN_PROGRESS ? totalCost * 0.3 : totalCost,
                    duration_minutes: status === SessionStatus.IN_PROGRESS ? Math.floor(duration * 0.3) : duration,
                    success_rate: status === SessionStatus.FAILED ? Math.random() * 50 : 85 + Math.random() * 15,
                    plug_in_successful: status !== SessionStatus.FAILED,
                    peak_power: Math.random() * 50 + 50, // 50-100 kW
                    average_power: Math.random() * 40 + 30, // 30-70 kW
                    payment_method: paymentMethod
                });
            }
        }

        // Save sessions to database
        const sessionRepository = AppDataSource.getRepository(Session);
        const createdSessions = await sessionRepository.save(sessionsData);

        console.log(`Successfully seeded ${createdSessions.length} sessions`);
        return createdSessions;
    } catch (error) {
        console.error("Error seeding sessions:", error);
        throw error;
    }
}

export { seedSessions }; 