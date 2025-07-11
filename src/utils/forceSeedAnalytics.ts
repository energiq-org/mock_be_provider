import { Analytics, TimePeriod, MetricType } from "../models/analytics.js";
import { AppDataSource } from "../config/dbConnection.js";

async function forceSeedAnalytics() {
    try {
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Database connection established for forced analytics seeding");

        // Clear existing analytics first
        const analyticsRepository = AppDataSource.getRepository(Analytics);
        await analyticsRepository.clear();
        console.log("Cleared existing analytics data");

        const analyticsData: Partial<Analytics>[] = [];
        
        // Helper function to generate realistic data with more randomness
        const generateMetrics = (baseValue: number, variance: number = 0.3) => {
            return Math.floor(baseValue * (0.7 + Math.random() * variance * 2));
        };

        const generateDecimal = (baseValue: number, variance: number = 0.3) => {
            return parseFloat((baseValue * (0.7 + Math.random() * variance * 2)).toFixed(2));
        };

        // Generate random daily patterns for 7 days
        const generateDailyPattern = (baseMin: number, baseMax: number) => {
            return Array.from({length: 7}, () => 
                Math.floor(baseMin + Math.random() * (baseMax - baseMin))
            );
        };

        const generateDecimalPattern = (baseMin: number, baseMax: number) => {
            return Array.from({length: 7}, () => 
                parseFloat((baseMin + Math.random() * (baseMax - baseMin)).toFixed(1))
            );
        };

        // Generate random station names for more variety
        const stationPrefixes = ['Central', 'North', 'South', 'East', 'West', 'Metro', 'City', 'Town', 'Park', 'Mall', 'Business', 'Tech', 'Green', 'Blue', 'Silver'];
        const stationSuffixes = ['Station', 'Hub', 'Center', 'Plaza', 'Point', 'Terminal', 'Park', 'Valley', 'Heights', 'District', 'Square', 'Zone'];
        
        const generateStationName = () => {
            const prefix = stationPrefixes[Math.floor(Math.random() * stationPrefixes.length)];
            const suffix = stationSuffixes[Math.floor(Math.random() * stationSuffixes.length)];
            return `${prefix} ${suffix}`;
        };

        // Generate unique station names
        const allStationNames = new Set<string>();
        while (allStationNames.size < 10) {
            allStationNames.add(generateStationName());
        }
        const stationNames = Array.from(allStationNames);

        // Current Week Dashboard Summary
        const thisWeekRevenue = generateDailyPattern(100, 220);
        const thisWeekEnergy = generateDecimalPattern(70, 160);
        const thisWeekSessions = generateDailyPattern(35, 85);
        const thisWeekSuccessRate = generateDecimalPattern(90, 98);

        analyticsData.push({
            metric_type: MetricType.REVENUE_SUMMARY,
            time_period: TimePeriod.THIS_WEEK,
            date: new Date(),
            data: {
                revenue_by_day: thisWeekRevenue,
                energy_by_day: thisWeekEnergy,
                sessions_by_day: thisWeekSessions,
                success_rate_by_day: thisWeekSuccessRate
            },
            total_stations: generateMetrics(15, 0.1),
            online_stations: generateMetrics(14, 0.1),
            offline_stations: generateMetrics(1, 2),
            total_revenue: generateDecimal(thisWeekRevenue.reduce((a, b) => a + b, 0)),
            total_energy_delivered: generateDecimal(thisWeekEnergy.reduce((a, b) => a + b, 0)),
            total_sessions: thisWeekSessions.reduce((a, b) => a + b, 0),
            active_alerts: generateMetrics(5, 0.8),
            critical_alerts: generateMetrics(2, 1),
            plug_in_success_rate: generateDecimal(94.5, 0.1),
            average_session_duration: generateDecimal(45 + Math.random() * 40),
            utilization_rate: generateDecimal(75 + Math.random() * 20)
        });

        // Previous Week Dashboard Summary
        const lastWeekRevenue = generateDailyPattern(80, 200);
        const lastWeekEnergy = generateDecimalPattern(60, 140);
        const lastWeekSessions = generateDailyPattern(30, 70);
        const lastWeekSuccessRate = generateDecimalPattern(88, 96);

        analyticsData.push({
            metric_type: MetricType.REVENUE_SUMMARY,
            time_period: TimePeriod.LAST_WEEK,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            data: {
                revenue_by_day: lastWeekRevenue,
                energy_by_day: lastWeekEnergy,
                sessions_by_day: lastWeekSessions,
                success_rate_by_day: lastWeekSuccessRate
            },
            total_stations: generateMetrics(15, 0.1),
            online_stations: generateMetrics(13, 0.1),
            offline_stations: generateMetrics(2, 1),
            total_revenue: generateDecimal(lastWeekRevenue.reduce((a, b) => a + b, 0)),
            total_energy_delivered: generateDecimal(lastWeekEnergy.reduce((a, b) => a + b, 0)),
            total_sessions: lastWeekSessions.reduce((a, b) => a + b, 0),
            active_alerts: generateMetrics(8, 0.6),
            critical_alerts: generateMetrics(3, 1),
            plug_in_success_rate: generateDecimal(92.8, 0.1),
            average_session_duration: generateDecimal(40 + Math.random() * 45),
            utilization_rate: generateDecimal(65 + Math.random() * 20)
        });

        // Current Week Hourly Usage Pattern - More dynamic
        const generateHourlyPattern = () => {
            return Array.from({length: 24}, (_, i) => {
                // Peak hours with randomness: 7-10 AM, 4-8 PM
                if ((i >= 7 && i <= 10) || (i >= 16 && i <= 20)) {
                    return generateMetrics(60 + Math.random() * 40, 0.4);
                } else if (i >= 6 && i <= 22) {
                    return generateMetrics(25 + Math.random() * 30, 0.5);
                } else {
                    return generateMetrics(5 + Math.random() * 15, 0.8);
                }
            });
        };

        const thisWeekHourlyPattern = generateHourlyPattern();
        const randomPeakHours = [7, 8, 9, 16, 17, 18, 19, 20].slice(0, 3 + Math.floor(Math.random() * 4));

        analyticsData.push({
            metric_type: MetricType.HOURLY_USAGE,
            time_period: TimePeriod.THIS_WEEK,
            date: new Date(),
            data: {
                hourly_pattern: thisWeekHourlyPattern,
                peak_hours: randomPeakHours,
                average_hourly_usage: parseFloat((thisWeekHourlyPattern.reduce((a, b) => a + b, 0) / 24).toFixed(1))
            },
            total_stations: generateMetrics(15, 0.1),
            online_stations: generateMetrics(14, 0.1),
            offline_stations: generateMetrics(1, 2),
            total_revenue: 0,
            total_energy_delivered: 0,
            total_sessions: 0,
            active_alerts: 0,
            critical_alerts: 0,
            plug_in_success_rate: 0,
            average_session_duration: 0,
            utilization_rate: generateDecimal(75 + Math.random() * 20)
        });

        // Last Week Hourly Usage Pattern
        const lastWeekHourlyPattern = generateHourlyPattern();
        const lastWeekPeakHours = [7, 8, 9, 16, 17, 18, 19].slice(0, 3 + Math.floor(Math.random() * 3));

        analyticsData.push({
            metric_type: MetricType.HOURLY_USAGE,
            time_period: TimePeriod.LAST_WEEK,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            data: {
                hourly_pattern: lastWeekHourlyPattern,
                peak_hours: lastWeekPeakHours,
                average_hourly_usage: parseFloat((lastWeekHourlyPattern.reduce((a, b) => a + b, 0) / 24).toFixed(1))
            },
            total_stations: generateMetrics(15, 0.1),
            online_stations: generateMetrics(13, 0.1),
            offline_stations: generateMetrics(2, 1),
            total_revenue: 0,
            total_energy_delivered: 0,
            total_sessions: 0,
            active_alerts: 0,
            critical_alerts: 0,
            plug_in_success_rate: 0,
            average_session_duration: 0,
            utilization_rate: generateDecimal(65 + Math.random() * 20)
        });

        // Station Performance Metrics - This Week (Sessions per Station)
        const thisWeekStationSessions = stationNames.slice(0, 5).map(name => ({
            station_name: name,
            sessions: generateMetrics(50 + Math.random() * 100),
            uptime: generateDecimal(95 + Math.random() * 4),
            efficiency: generateDecimal(92 + Math.random() * 6)
        })).sort((a, b) => b.sessions - a.sessions);

        analyticsData.push({
            metric_type: MetricType.STATION_PERFORMANCE,
            time_period: TimePeriod.THIS_WEEK,
            date: new Date(),
            data: {
                station_rankings: thisWeekStationSessions.map(station => ({
                    station_name: station.station_name,
                    sessions: station.sessions,
                    uptime: station.uptime,
                    efficiency: station.efficiency
                })),
                top_performer: thisWeekStationSessions[0].station_name,
                lowest_performer: thisWeekStationSessions[thisWeekStationSessions.length - 1].station_name
            },
            total_stations: generateMetrics(15, 0.1),
            online_stations: generateMetrics(14, 0.1),
            offline_stations: generateMetrics(1, 2),
            total_revenue: 0,
            total_energy_delivered: 0,
            total_sessions: 0,
            active_alerts: 0,
            critical_alerts: 0,
            plug_in_success_rate: 0,
            average_session_duration: 0,
            utilization_rate: 0
        });

        // Station Performance Metrics - Last Week (Sessions per Station)
        const lastWeekStationSessions = stationNames.slice(0, 5).map(name => ({
            station_name: name,
            sessions: generateMetrics(40 + Math.random() * 90),
            uptime: generateDecimal(90 + Math.random() * 8),
            efficiency: generateDecimal(88 + Math.random() * 8)
        })).sort((a, b) => b.sessions - a.sessions);

        analyticsData.push({
            metric_type: MetricType.STATION_PERFORMANCE,
            time_period: TimePeriod.LAST_WEEK,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            data: {
                station_rankings: lastWeekStationSessions.map(station => ({
                    station_name: station.station_name,
                    sessions: station.sessions,
                    uptime: station.uptime,
                    efficiency: station.efficiency
                })),
                top_performer: lastWeekStationSessions[0].station_name,
                lowest_performer: lastWeekStationSessions[lastWeekStationSessions.length - 1].station_name
            },
            total_stations: generateMetrics(15, 0.1),
            online_stations: generateMetrics(13, 0.1),
            offline_stations: generateMetrics(2, 1),
            total_revenue: 0,
            total_energy_delivered: 0,
            total_sessions: 0,
            active_alerts: 0,
            critical_alerts: 0,
            plug_in_success_rate: 0,
            average_session_duration: 0,
            utilization_rate: 0
        });

        // Save analytics to database
        const createdAnalytics = await analyticsRepository.save(analyticsData);

        console.log(`Successfully force-seeded ${createdAnalytics.length} analytics records`);
        console.log("Analytics data is now available for all endpoints!");
        return createdAnalytics;
    } catch (error) {
        console.error("Error force seeding analytics:", error);
        throw error;
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    forceSeedAnalytics().then(() => {
        console.log("🏁 Forced analytics seeding completed");
        process.exit(0);
    }).catch((error) => {
        console.error("💥 Forced analytics seeding failed:", error);
        process.exit(1);
    });
}

export { forceSeedAnalytics }; 