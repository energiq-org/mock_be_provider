import { Request, Response } from "express";
import { Alert, AlertSeverity, AlertStatus, AlertType } from "../../models/alert.js";
import { FindOptionsWhere } from "typeorm";

export const getAllAlerts = async (req: Request, res: Response) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            severity, 
            status,
            station_id,
            issue_type
        } = req.query;

        const where: FindOptionsWhere<Alert> = {};

        // Apply filters with explicit checks
        if (severity !== undefined && severity !== null && severity !== '') {
            where.severity = severity as AlertSeverity;
        }
        if (status !== undefined && status !== null && status !== '') {
            where.status = status as AlertStatus;
        }
        if (station_id !== undefined && station_id !== null && station_id !== '') {
            where.station_id = Number(station_id);
        }
        if (issue_type !== undefined && issue_type !== null && issue_type !== '') {
            where.type = issue_type as AlertType;
        }

        const [alerts, total] = await Alert.findAndCount({
            where,
            relations: ["station"],
            order: { created_at: "DESC" },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });

        const formattedAlerts = alerts.map(alert => ({
            id: alert.id,
            station_name: alert.station?.name || 'System',
            station_id: alert.station_id,
            issue_type: alert.type,
            title: alert.title,
            description: alert.description,
            severity: alert.severity,
            status: alert.status,
            time_detected: alert.created_at,
            acknowledged_by: alert.acknowledged_by,
            acknowledged_at: alert.acknowledged_at,
            charger_id: alert.charger_id,
            connector_id: alert.connector_id,
            metadata: alert.metadata,
            created_at: alert.created_at,
            updated_at: alert.updated_at
        }));

        res.json({
            success: true,
            data: formattedAlerts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts"
        });
    }
};

export const getAlertById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const alert = await Alert.findOne({
            where: { id: Number(id) },
            relations: ["station"]
        });

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        const formattedAlert = {
            id: alert.id,
            station_name: alert.station?.name || 'System',
            station_id: alert.station_id,
            issue_type: alert.type,
            title: alert.title,
            description: alert.description,
            severity: alert.severity,
            status: alert.status,
            time_detected: alert.created_at,
            acknowledged_by: alert.acknowledged_by,
            acknowledged_at: alert.acknowledged_at,
            resolved_at: alert.resolved_at,
            resolved_by: alert.resolved_by,
            charger_id: alert.charger_id,
            connector_id: alert.connector_id,
            metadata: alert.metadata,
            created_at: alert.created_at,
            updated_at: alert.updated_at
        };

        res.json({
            success: true,
            data: formattedAlert
        });
    } catch (error) {
        console.error("Error fetching alert:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch alert"
        });
    }
};

export const createAlert = async (req: Request, res: Response) => {
    try {
        const alertData = req.body;
        
        const alert = new Alert();
        Object.assign(alert, alertData);
        await alert.save();

        // Fetch the alert with relations for response
        const createdAlert = await Alert.findOne({
            where: { id: alert.id },
            relations: ["station"]
        });

        if (!createdAlert) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve created alert"
            });
        }

        const formattedAlert = {
            id: createdAlert.id,
            station_name: createdAlert.station?.name || 'System',
            station_id: createdAlert.station_id,
            issue_type: createdAlert.type,
            title: createdAlert.title,
            description: createdAlert.description,
            severity: createdAlert.severity,
            status: createdAlert.status,
            time_detected: createdAlert.created_at,
            created_at: createdAlert.created_at
        };

        res.status(201).json({
            success: true,
            data: formattedAlert,
            message: "Alert created successfully"
        });
    } catch (error) {
        console.error("Error creating alert:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create alert"
        });
    }
};

export const acknowledgeAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { acknowledged_by } = req.body;

        const alert = await Alert.findOne({
            where: { id: Number(id) }
        });

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        alert.status = AlertStatus.ACKNOWLEDGED;
        alert.acknowledged_at = new Date();
        alert.acknowledged_by = acknowledged_by ?? 'system';
        await alert.save();

        // Fetch updated alert with relations
        const updatedAlert = await Alert.findOne({
            where: { id: Number(id) },
            relations: ["station"]
        });

        if (!updatedAlert) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve updated alert"
            });
        }

        const formattedAlert = {
            id: updatedAlert.id,
            station_name: updatedAlert.station?.name || 'System',
            station_id: updatedAlert.station_id,
            issue_type: updatedAlert.type,
            title: updatedAlert.title,
            description: updatedAlert.description,
            severity: updatedAlert.severity,
            status: updatedAlert.status,
            acknowledged_by: updatedAlert.acknowledged_by,
            acknowledged_at: updatedAlert.acknowledged_at,
            created_at: updatedAlert.created_at,
            updated_at: updatedAlert.updated_at
        };

        res.json({
            success: true,
            data: formattedAlert,
            message: "Alert acknowledged successfully"
        });
    } catch (error) {
        console.error("Error acknowledging alert:", error);
        res.status(500).json({
            success: false,
            message: "Failed to acknowledge alert"
        });
    }
};

export const dismissResolvedAlerts = async (req: Request, res: Response) => {
    try {
        // Update all resolved alerts to dismissed status
        const result = await Alert.update(
            { status: AlertStatus.RESOLVED },
            { status: AlertStatus.DISMISSED }
        );

        const affectedCount = result.affected ?? 0;
        res.json({
            success: true,
            message: `${affectedCount} resolved alerts dismissed successfully`
        });
    } catch (error) {
        console.error("Error dismissing resolved alerts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to dismiss resolved alerts"
        });
    }
};

export const deleteAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const alert = await Alert.findOne({
            where: { id: Number(id) }
        });

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        await alert.remove();

        res.json({
            success: true,
            message: "Alert deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting alert:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete alert"
        });
    }
}; 