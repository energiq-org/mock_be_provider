import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { getDashboardQueryParamsSchema } from "../../schemas/controllers/dashboard/dashboard.js";

// Helper function for random generation
const generateRandomData = () => {
    // Generate random station names
    const stationPrefixes = ['Central', 'North', 'South', 'East', 'West', 'Metro', 'City', 'Business', 'Tech', 'Green'];
    const stationSuffixes = ['Station', 'Hub', 'Center', 'Plaza', 'Terminal', 'Park', 'Zone'];
    
    const generateStationName = () => {
        const prefix = stationPrefixes[Math.floor(Math.random() * stationPrefixes.length)];
        const suffix = stationSuffixes[Math.floor(Math.random() * stationSuffixes.length)];
        return `${prefix} ${suffix}`;
    };

    // Generate unique station names
    const stationNames = new Set<string>();
    while (stationNames.size < 5) {
        stationNames.add(generateStationName());
    }

    const stationList = Array.from(stationNames).map(name => ({
        name,
        sessions: Math.floor(30 + Math.random() * 120) // 30-150 sessions
    })).sort((a, b) => b.sessions - a.sessions); // Sort by sessions descending

    // Generate daily patterns
    const generateDailyPattern = (min: number, max: number) => {
        const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        return days.map(day => ({
            day,
            value: Math.floor(min + Math.random() * (max - min))
        }));
    };

    const generateAreaPattern = (min: number, max: number) => {
        const days = [
            { day: 'Sat', fullDay: 'Saturday' },
            { day: 'Sun', fullDay: 'Sunday' },
            { day: 'Mon', fullDay: 'Monday' },
            { day: 'Tue', fullDay: 'Tuesday' },
            { day: 'Wed', fullDay: 'Wednesday' },
            { day: 'Thu', fullDay: 'Thursday' },
            { day: 'Fri', fullDay: 'Friday' }
        ];
        return days.map(dayInfo => ({
            ...dayInfo,
            value: Math.floor(min + Math.random() * (max - min))
        }));
    };

    // Generate heatmap data
    const generateHeatmap = () => {
        const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const hours = ['12-4 AM', '4-8 AM', '8-12 PM', '12-4 PM', '4-8 PM', '8-12 AM'];
        const heatmap: { [key: string]: { [key: string]: number } } = {};
        
        days.forEach(day => {
            heatmap[day] = {};
            hours.forEach(hour => {
                // Peak hours (8-12 PM, 12-4 PM, 4-8 PM) have higher values
                const isPeak = ['8-12 PM', '12-4 PM', '4-8 PM'].includes(hour);
                const baseValue = isPeak ? 8 : 3;
                const variance = isPeak ? 10 : 5;
                heatmap[day][hour] = Math.floor(baseValue + Math.random() * variance);
            });
        });
        return heatmap;
    };

    return {
        stationList,
        generateDailyPattern,
        generateAreaPattern,
        generateHeatmap
    };
};

// Mock data that matches frontend expectations exactly
const generateMockDashboardData = () => {
    const { stationList, generateDailyPattern, generateAreaPattern, generateHeatmap } = generateRandomData();
    
    // Generate realistic metrics
    const totalStations = Math.floor(14 + Math.random() * 3);
    const offlineStations = Math.floor(1 + Math.random() * 3);
    const onlineStations = totalStations - offlineStations;
    
    const totalRevenue = Math.floor(800 + Math.random() * 400);
    const totalEnergyDelivered = Math.floor(1000 + Math.random() * 500);
    
    const totalAlerts = Math.floor(1 + Math.random() * 6);
    const urgentAlerts = Math.floor(1 + Math.random() * 3);
    
    return {
        summary: {
            onlineStations: {
                total: totalStations,
                online: onlineStations,
                offline: offlineStations
            },
            revenue: {
                total: totalRevenue,
                currency: "EGP",
                period: "today"
            },
            energyDelivered: {
                total: totalEnergyDelivered,
                unit: "kWh",
                period: "since midnight"
            },
            alerts: {
                total: totalAlerts,
                urgent: urgentAlerts
            }
        },
        datasets: {
            thisWeek: {
                bar: generateDailyPattern(20, 120),
                area: generateAreaPattern(30, 100),
                Hbar: stationList.map(station => ({
                    name: station.name,
                    value: station.sessions
                })),
                Plug: {
                    duration: Math.random() > 0.5 ? `+${Math.floor(1 + Math.random() * 10)}` : `-${Math.floor(1 + Math.random() * 5)}`,
                    gauge: Math.floor(60 + Math.random() * 30)
                },
                Duration: {
                    duration: Math.random() > 0.5 ? `+${Math.floor(1 + Math.random() * 20)}` : `-${Math.floor(1 + Math.random() * 10)}`,
                    time: Math.floor(30 + Math.random() * 30)
                },
                Heatmap: generateHeatmap()
            },
            lastWeek: {
                bar: generateDailyPattern(15, 100),
                area: generateAreaPattern(25, 85),
                Hbar: stationList.map(station => ({
                    name: station.name,
                    value: Math.floor(station.sessions * (0.8 + Math.random() * 0.4)) // Vary last week data
                })),
                Plug: {
                    duration: Math.random() > 0.5 ? `+${Math.floor(1 + Math.random() * 15)}` : `-${Math.floor(1 + Math.random() * 8)}`,
                    gauge: Math.floor(50 + Math.random() * 40)
                },
                Duration: {
                    duration: Math.random() > 0.5 ? `+${Math.floor(1 + Math.random() * 25)}` : `-${Math.floor(1 + Math.random() * 15)}`,
                    time: Math.floor(25 + Math.random() * 35)
                },
                Heatmap: generateHeatmap()
            }
        }
    };
};

function getDashboardController(
    req: Request<unknown, unknown, unknown, Static<typeof getDashboardQueryParamsSchema>>,
    res: Response
) {
    try {
        // Generate fresh random data for each request
        const mockData = generateMockDashboardData();
        
        return res.status(200).json(mockData);
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

function getDashboardSummaryController(req: Request, res: Response) {
    try {
        // Return just the summary metrics with fresh data
        const mockData = generateMockDashboardData();
        return res.status(200).json(mockData.summary);
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

function getDashboardChartsController(
    req: Request<unknown, unknown, unknown, Static<typeof getDashboardQueryParamsSchema>>,
    res: Response
) {
    try {
        const { period = "thisWeek" } = req.query;
        
        // Return the chart data for the specified period
        const validPeriods = ["thisWeek", "lastWeek"] as const;
        if (!validPeriods.includes(period as typeof validPeriods[number])) {
            return res.status(400).json({ msg: "Invalid period specified" });
        }

        const mockData = generateMockDashboardData();
        const chartData = mockData.datasets[period as keyof typeof mockData.datasets];
        return res.status(200).json(chartData);
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { getDashboardController, getDashboardSummaryController, getDashboardChartsController }; 