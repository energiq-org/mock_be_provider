import { Request, Response } from "express";
import { Analytics, TimePeriod, MetricType } from "../../models/analytics.js";

interface ChartData {
    revenue_by_day?: number[];
    energy_by_day?: number[];
    sessions_by_day?: number[];
    success_rate_by_day?: number[];
    hourly_pattern?: number[];
    peak_hours?: number[];
    average_hourly_usage?: number;
    weekly_breakdown?: number[];
    monthly_trends?: {
        growth_rate: number;
        efficiency_improvement: number;
        customer_satisfaction: number;
    };
    station_rankings?: Array<{
        station_name: string;
        efficiency?: number;
        uptime: number;
        revenue?: number;
        sessions?: number; // Added sessions for transformation
    }>;
    top_performer?: string;
    lowest_performer?: string;
    energy_by_week?: number[];
    sessions_by_week?: number[];
}

// Get revenue chart data
export const getRevenueCharts = async (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        const analytics = await Analytics.findOne({
            where: {
                metric_type: MetricType.REVENUE_SUMMARY,
                time_period: period as TimePeriod
            }
        });

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: "Revenue chart data not found for the specified period"
            });
        }

        const chartData = analytics.data as ChartData;
        
        res.json({
            success: true,
            data: {
                period,
                revenue_by_day: chartData.revenue_by_day || [],
                total_revenue: analytics.total_revenue,
                weekly_breakdown: chartData.weekly_breakdown || null,
                monthly_trends: chartData.monthly_trends || null
            }
        });
    } catch (error) {
        console.error("Error fetching revenue charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch revenue chart data"
        });
    }
};

// Get energy chart data
export const getEnergyCharts = async (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        const analytics = await Analytics.findOne({
            where: {
                metric_type: MetricType.REVENUE_SUMMARY,
                time_period: period as TimePeriod
            }
        });

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: "Energy chart data not found for the specified period"
            });
        }

        const chartData = analytics.data as ChartData;
        
        res.json({
            success: true,
            data: {
                period,
                energy_by_day: chartData.energy_by_day || [],
                total_energy_delivered: analytics.total_energy_delivered,
                energy_by_week: chartData.energy_by_week || null
            }
        });
    } catch (error) {
        console.error("Error fetching energy charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch energy chart data"
        });
    }
};

// Get sessions chart data
export const getSessionsCharts = async (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        const analytics = await Analytics.findOne({
            where: {
                metric_type: MetricType.REVENUE_SUMMARY,
                time_period: period as TimePeriod
            }
        });

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: "Sessions chart data not found for the specified period"
            });
        }

        const chartData = analytics.data as ChartData;
        
        res.json({
            success: true,
            data: {
                period,
                sessions_by_day: chartData.sessions_by_day || [],
                success_rate_by_day: chartData.success_rate_by_day || [],
                total_sessions: analytics.total_sessions,
                sessions_by_week: chartData.sessions_by_week || null
            }
        });
    } catch (error) {
        console.error("Error fetching sessions charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions chart data"
        });
    }
};

// Get hourly usage chart data
export const getHourlyUsageCharts = async (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        const analytics = await Analytics.findOne({
            where: {
                metric_type: MetricType.HOURLY_USAGE,
                time_period: period as TimePeriod
            }
        });

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: "Hourly usage chart data not found for the specified period"
            });
        }

        const chartData = analytics.data as ChartData;
        
        res.json({
            success: true,
            data: {
                period,
                hourly_pattern: chartData.hourly_pattern ?? [],
                peak_hours: chartData.peak_hours ?? [],
                average_hourly_usage: chartData.average_hourly_usage ?? 0,
                utilization_rate: analytics.utilization_rate
            }
        });
    } catch (error) {
        console.error("Error fetching hourly usage charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch hourly usage chart data"
        });
    }
};

// Get station performance chart data
export const getStationPerformanceCharts = async (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        const analytics = await Analytics.findOne({
            where: {
                metric_type: MetricType.STATION_PERFORMANCE,
                time_period: period as TimePeriod
            }
        });

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: "Station performance chart data not found for the specified period"
            });
        }

        const chartData = analytics.data as ChartData;
        
        // Transform station rankings to match frontend expectations (sessions as main metric)
        const transformedRankings = chartData.station_rankings?.map(station => ({
            name: station.station_name,
            value: station.sessions ?? station.efficiency ?? 0 // Use nullish coalescing for explicit null handling
        })) ?? []; // Handle null/undefined rankings array
        
        res.json({
            success: true,
            data: transformedRankings // Return as simple array for horizontal bar chart
        });
    } catch (error) {
        console.error("Error fetching station performance charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch station performance chart data"
        });
    }
};

 

// Get plug chart data  
export const getPlugCharts = (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        // Generate plug chart data dynamically
        const plugData = {
            duration: Math.random() > 0.5 ? `+${Math.floor(1 + Math.random() * 10)}` : `-${Math.floor(1 + Math.random() * 5)}`,
            gauge: Math.floor(60 + Math.random() * 30)
        };
        
        res.json({
            success: true,
            data: {
                period,
                ...plugData
            }
        });
    } catch (error) {
        console.error("Error fetching plug charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch plug chart data"
        });
    }
};

// Get duration chart data
export const getDurationCharts = (req: Request, res: Response) => {
    try {
        const { period = "thisWeek" } = req.query;
        
        // Generate duration chart data dynamically
        const durationData = {
            duration: Math.random() > 0.5 ? `+${Math.floor(1 + Math.random() * 20)}` : `-${Math.floor(1 + Math.random() * 10)}`,
            time: Math.floor(30 + Math.random() * 30)
        };
        
        res.json({
            success: true,
            data: {
                period,
                ...durationData
            }
        });
    } catch (error) {
        console.error("Error fetching duration charts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch duration chart data"
        });
    }
}; 