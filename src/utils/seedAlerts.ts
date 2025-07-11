import { Alert, AlertSeverity, AlertStatus, AlertType } from "../models/alert.js";
import { Station } from "../models/station.js";
import { AppDataSource } from "../config/dbConnection.js";

async function seedAlerts() {
    try {
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Database connection established for alerts seeding");

        // Check if alerts already exist
        const existingAlerts = await Alert.count();
        if (existingAlerts > 0) {
            console.log("Alerts already exist in database. Skipping seeding.");
            return;
        }

        // Get all stations to associate alerts with
        const stations = await Station.find();
        if (stations.length === 0) {
            console.log("No stations found. Please seed stations first.");
            return;
        }

        const alertsData: Partial<Alert>[] = [];
        
        const alertTemplates = [
            {
                type: AlertType.CONNECTOR_FAULT,
                title: "Connector Maintenance Required",
                description: "Connector showing signs of wear and requires maintenance check",
                severity: AlertSeverity.HIGH
            },
            {
                type: AlertType.NETWORK_DISCONNECTED,
                title: "Network Connection Lost",
                description: "Station has lost connection to central server",
                severity: AlertSeverity.CRITICAL
            },
            {
                type: AlertType.MAINTENANCE_REQUIRED,
                title: "Scheduled Maintenance Due",
                description: "Regular maintenance check is overdue",
                severity: AlertSeverity.MEDIUM
            },
            {
                type: AlertType.POWER_FAILURE,
                title: "Power Output Issue",
                description: "Station power output is below optimal levels",
                severity: AlertSeverity.HIGH
            },
            {
                type: AlertType.OVERHEATING,
                title: "Temperature Alert",
                description: "Station temperature exceeding normal operating range",
                severity: AlertSeverity.HIGH
            },
            {
                type: AlertType.CHARGER_FAULT,
                title: "Charger System Error",
                description: "Charger experiencing technical difficulties",
                severity: AlertSeverity.CRITICAL
            },
            {
                type: AlertType.CONNECTOR_FAULT,
                title: "Connector Port Issue",
                description: "Connector port requires inspection and potential repair",
                severity: AlertSeverity.HIGH
            },
            {
                type: AlertType.MAINTENANCE_REQUIRED,
                title: "Routine Maintenance",
                description: "Routine maintenance scheduled for this week",
                severity: AlertSeverity.LOW
            }
        ];

        // Generate alerts for stations that have alerts_count > 0
        for (const station of stations) {
            if (station.alerts_count > 0) {
                const alertCount = Math.min(station.alerts_count, 3); // Limit for demo
                
                for (let i = 0; i < alertCount; i++) {
                    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
                    const createdTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
                    
                    // Determine status based on severity and time
                    let status = AlertStatus.ACTIVE;
                    if (template.severity === AlertSeverity.LOW && Math.random() > 0.3) {
                        status = AlertStatus.ACKNOWLEDGED;
                    } else if (template.severity === AlertSeverity.MEDIUM && Math.random() > 0.5) {
                        status = AlertStatus.ACKNOWLEDGED;
                    }
                    
                    alertsData.push({
                        station_id: station.id,
                        type: template.type,
                        title: template.title,
                        description: `${template.description} at ${station.name}`,
                        severity: template.severity,
                        status,
                        charger_id: Math.random() > 0.5 ? `CHG-${station.id}-${Math.floor(Math.random() * station.chargers_count) + 1}` : undefined,
                        connector_id: Math.random() > 0.5 ? `CON-${station.id}-${Math.floor(Math.random() * station.connectors_count) + 1}` : undefined,
                        acknowledged_at: status === AlertStatus.ACKNOWLEDGED ? 
                            new Date(createdTime.getTime() + Math.random() * 24 * 60 * 60 * 1000) : undefined,
                        acknowledged_by: status === AlertStatus.ACKNOWLEDGED ? 
                            `operator_${Math.floor(Math.random() * 5) + 1}` : undefined,
                        metadata: {
                            station_name: station.name,
                            station_location: station.location,
                            alert_code: `ALT_${Math.floor(Math.random() * 9000) + 1000}`,
                            auto_generated: true
                        },
                        created_at: createdTime
                    });
                }
            }
        }

        // Add some global system alerts (no station_id)
        const systemAlerts = [
            {
                station_id: undefined,
                type: AlertType.NETWORK_ISSUE,
                title: "System Update Completed",
                description: "EnergiQ platform update v2.1.0 has been successfully deployed",
                severity: AlertSeverity.LOW,
                status: AlertStatus.ACKNOWLEDGED,
                acknowledged_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
                acknowledged_by: "admin_user",
                metadata: {
                    version: "v2.1.0",
                    deployment_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
                },
                created_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            {
                station_id: undefined,
                type: AlertType.NETWORK_ISSUE,
                title: "Critical System Alert",
                description: "Monitoring system detected unusual network activity",
                severity: AlertSeverity.CRITICAL,
                status: AlertStatus.ACTIVE,
                metadata: {
                    alert_type: "security",
                    threat_level: "high",
                    detection_method: "anomaly_detection"
                },
                created_at: new Date(Date.now() - 30 * 60 * 1000)
            }
        ];

        alertsData.push(...systemAlerts);

        // Save alerts to database
        const alertRepository = AppDataSource.getRepository(Alert);
        const createdAlerts = await alertRepository.save(alertsData);

        console.log(`Successfully seeded ${createdAlerts.length} alerts`);
        return createdAlerts;
    } catch (error) {
        console.error("Error seeding alerts:", error);
        throw error;
    }
}

export { seedAlerts }; 