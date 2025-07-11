import { Analytics, TimePeriod, MetricType } from "../models/analytics.js";
import { AppDataSource } from "../config/dbConnection.js";

async function seedAnalytics() {
    try {
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Database connection established for analytics seeding");

        // Check if analytics already exist
        const existingAnalytics = await Analytics.count();
        if (existingAnalytics > 0) {
            console.log("Analytics already exist in database. Skipping seeding.");
            return;
        }

        const analyticsData: Partial<Analytics>[] = [];
        
        // Helper function to generate realistic data
        const generateMetrics = (baseValue: number, variance: number = 0.2) => {
            return Math.floor(baseValue * (1 + (Math.random() - 0.5) * variance));
        };

        const generateDecimal = (baseValue: number, variance: number = 0.2) => {
            return parseFloat((baseValue * (1 + (Math.random() - 0.5) * variance)).toFixed(2));
        };

        // Current Week Dashboard Summary
        analyticsData.push({
            metric_type: MetricType.REVENUE_SUMMARY,
            time_period: TimePeriod.THIS_WEEK,
            date: new Date(),
            data: {
                revenue_by_day: [120, 145, 189, 156, 178, 134, 198],
                energy_by_day: [85.2, 102.3, 145.8, 112.4, 128.9, 95.6, 142.7],
                sessions_by_day: [45, 52, 68, 58, 63, 48, 71],
                success_rate_by_day: [94.2, 95.1, 93.8, 94.7, 95.3, 93.5, 94.9]
            },
            total_stations: 15,
            online_stations: 14,
            offline_stations: 1,
            total_revenue: generateDecimal(1000.00),
            total_energy_delivered: generateDecimal(1240.50),
            total_sessions: generateMetrics(450),
            active_alerts: 5,
            critical_alerts: 2,
            plug_in_success_rate: generateDecimal(94.5, 0.1),
            average_session_duration: generateDecimal(65.0),
            utilization_rate: generateDecimal(78.5, 0.15)
        });

        // Previous Week Dashboard Summary
        analyticsData.push({
            metric_type: MetricType.REVENUE_SUMMARY,
            time_period: TimePeriod.LAST_WEEK,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            data: {
                revenue_by_day: [98, 134, 165, 142, 158, 112, 186],
                energy_by_day: [76.8, 89.5, 132.1, 98.7, 115.2, 87.3, 125.4],
                sessions_by_day: [42, 48, 61, 52, 57, 43, 63],
                success_rate_by_day: [92.1, 93.4, 91.9, 93.2, 94.1, 91.8, 93.7]
            },
            total_stations: 15,
            online_stations: 13,
            offline_stations: 2,
            total_revenue: generateDecimal(895.50),
            total_energy_delivered: generateDecimal(1125.30),
            total_sessions: generateMetrics(398),
            active_alerts: 8,
            critical_alerts: 3,
            plug_in_success_rate: generateDecimal(92.8, 0.1),
            average_session_duration: generateDecimal(68.0),
            utilization_rate: generateDecimal(72.3, 0.15)
        });

        // Current Week Hourly Usage Pattern
        analyticsData.push({
            metric_type: MetricType.HOURLY_USAGE,
            time_period: TimePeriod.THIS_WEEK,
            date: new Date(),
            data: {
                hourly_pattern: Array.from({length: 24}, (_, i) => {
                    // Peak hours: 8-10 AM, 5-7 PM
                    if ((i >= 8 && i <= 10) || (i >= 17 && i <= 19)) {
                        return generateMetrics(80, 0.3);
                    } else if (i >= 6 && i <= 22) {
                        return generateMetrics(45, 0.4);
                    } else {
                        return generateMetrics(15, 0.6);
                    }
                }),
                peak_hours: [8, 9, 10, 17, 18, 19],
                average_hourly_usage: 42.3
            },
            total_stations: 15,
            online_stations: 14,
            offline_stations: 1,
            total_revenue: 0,
            total_energy_delivered: 0,
            total_sessions: 0,
            active_alerts: 0,
            critical_alerts: 0,
            plug_in_success_rate: 0,
            average_session_duration: 0,
            utilization_rate: generateDecimal(78.5, 0.15)
        });

        // Station Performance Metrics
        analyticsData.push({
            metric_type: MetricType.STATION_PERFORMANCE,
            time_period: TimePeriod.THIS_WEEK,
            date: new Date(),
            data: {
                station_rankings: [
                    { station_name: "Central Station", efficiency: 97.8, uptime: 99.2, revenue: 185.50 },
                    { station_name: "Zarvak Hub", efficiency: 96.5, uptime: 98.8, revenue: 165.25 },
                    { station_name: "Business Hub", efficiency: 95.9, uptime: 99.1, revenue: 142.80 },
                    { station_name: "Green Valley", efficiency: 94.3, uptime: 97.5, revenue: 128.90 },
                    { station_name: "Airport Terminal", efficiency: 93.7, uptime: 98.2, revenue: 115.75 }
                ],
                top_performer: "Central Station",
                lowest_performer: "Mall Plaza"
            },
            total_stations: 15,
            online_stations: 14,
            offline_stations: 1,
            total_revenue: 0,
            total_energy_delivered: 0,
            total_sessions: 0,
            active_alerts: 0,
            critical_alerts: 0,
            plug_in_success_rate: 0,
            average_session_duration: 0,
            utilization_rate: 0
        });

        // Monthly Summary
        analyticsData.push({
            metric_type: MetricType.REVENUE_SUMMARY,
            time_period: TimePeriod.THIS_MONTH,
            date: new Date(),
            data: {
                weekly_breakdown: [985, 1120, 1345, 1200],
                monthly_trends: {
                    growth_rate: 12.5,
                    efficiency_improvement: 3.2,
                    customer_satisfaction: 4.7
                },
                projections: {
                    end_of_month_revenue: 5200,
                    expected_sessions: 2100
                }
            },
            total_stations: 15,
            online_stations: 14,
            offline_stations: 1,
            total_revenue: generateDecimal(4250.75),
            total_energy_delivered: generateDecimal(5480.90),
            total_sessions: generateMetrics(1890),
            active_alerts: 12,
            critical_alerts: 8,
            plug_in_success_rate: generateDecimal(93.7, 0.1),
            average_session_duration: generateDecimal(66.0),
            utilization_rate: generateDecimal(82.1, 0.15)
        });

        // Save analytics to database
        const analyticsRepository = AppDataSource.getRepository(Analytics);
        const createdAnalytics = await analyticsRepository.save(analyticsData);

        console.log(`Successfully seeded ${createdAnalytics.length} analytics records`);
        return createdAnalytics;
    } catch (error) {
        console.error("Error seeding analytics:", error);
        throw error;
    }
}

export { seedAnalytics }; 