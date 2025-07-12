import { Request, Response } from "express";
import { Session } from "../../models/session.js";

// Helper function to format session ID
const formatSessionId = (id: number): string => {
    return `#A${id.toString().padStart(2, '0')}F${(id * 3).toString().padStart(3, '0')}`;
};

// Helper function to format duration
const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
};

// Helper function to format user display
const formatUserDisplay = (userId: string | null): string => {
    if (userId === null || userId === undefined || userId.startsWith('user_')) {
        return 'Guest';
    }
    return userId;
};

export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await Session.find({
            relations: ["station"],
            order: { start_time: "DESC" },
            take: 50
        });

        const formattedSessions = sessions.map(session => ({
            id: session.id,
            session_id: formatSessionId(session.id),
            user: formatUserDisplay(session.user_id),
            station: session.station?.name || 'Unknown Station',
            start_time: session.start_time,
            duration: formatDuration(session.duration_minutes),
            duration_minutes: session.duration_minutes,
            energy_delivered: Number(session.energy_delivered),
            cost: Number(session.cost),
            status: session.status,
            payment_method: session.payment_method,
            connector_id: session.connector_id,
            charger_id: session.charger_id,
            end_time: session.end_time,
            created_at: session.created_at,
            updated_at: session.updated_at
        }));

        res.json({
            success: true,
            data: formattedSessions,
            total: sessions.length
        });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions"
        });
    }
};

export const getSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const session = await Session.findOne({
            where: { id: Number(id) },
            relations: ["station"]
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const formattedSession = {
            id: session.id,
            session_id: formatSessionId(session.id),
            user: formatUserDisplay(session.user_id),
            station: session.station?.name || 'Unknown Station',
            connector: session.connector_id || 'N/A',
            start_time: session.start_time,
            duration: formatDuration(session.duration_minutes),
            duration_minutes: session.duration_minutes,
            energy_delivered: Number(session.energy_delivered),
            cost: Number(session.cost),
            status: session.status,
            payment_method: session.payment_method,
            charger_id: session.charger_id,
            connector_id: session.connector_id,
            end_time: session.end_time,
            peak_power: session.peak_power,
            average_power: session.average_power,
            created_at: session.created_at,
            updated_at: session.updated_at
        };

        res.json({
            success: true,
            data: formattedSession
        });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch session"
        });
    }
};

export const createSession = async (req: Request, res: Response) => {
    try {
        const sessionData = req.body;
        
        const session = new Session();
        Object.assign(session, sessionData);
        await session.save();

        // Fetch the session with relations for response
        const createdSession = await Session.findOne({
            where: { id: session.id },
            relations: ["station"]
        });

        if (!createdSession) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve created session"
            });
        }

        const formattedSession = {
            id: createdSession.id,
            session_id: formatSessionId(createdSession.id),
            user: formatUserDisplay(createdSession.user_id),
            station: createdSession.station?.name || 'Unknown Station',
            start_time: createdSession.start_time,
            duration: formatDuration(createdSession.duration_minutes),
            energy_delivered: Number(createdSession.energy_delivered),
            cost: Number(createdSession.cost),
            status: createdSession.status,
            payment_method: createdSession.payment_method,
            connector_id: createdSession.connector_id,
            charger_id: createdSession.charger_id,
            created_at: createdSession.created_at
        };

        res.status(201).json({
            success: true,
            data: formattedSession,
            message: "Session created successfully"
        });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create session"
        });
    }
};

export const updateSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const session = await Session.findOne({
            where: { id: Number(id) }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        Object.assign(session, updateData);
        await session.save();

        // Fetch updated session with relations
        const updatedSession = await Session.findOne({
            where: { id: Number(id) },
            relations: ["station"]
        });

        if (!updatedSession) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve updated session"
            });
        }

        const formattedSession = {
            id: updatedSession.id,
            session_id: formatSessionId(updatedSession.id),
            user: formatUserDisplay(updatedSession.user_id),
            station: updatedSession.station?.name || 'Unknown Station',
            start_time: updatedSession.start_time,
            duration: formatDuration(updatedSession.duration_minutes),
            energy_delivered: Number(updatedSession.energy_delivered),
            cost: Number(updatedSession.cost),
            status: updatedSession.status,
            payment_method: updatedSession.payment_method,
            created_at: updatedSession.created_at,
            updated_at: updatedSession.updated_at
        };

        res.json({
            success: true,
            data: formattedSession,
            message: "Session updated successfully"
        });
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update session"
        });
    }
};

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const session = await Session.findOne({
            where: { id: Number(id) }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        await session.remove();

        res.json({
            success: true,
            message: "Session deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete session"
        });
    }
}; 

export const exportSessionsCSV = async (req: Request, res: Response) => {
    try {
        const sessions = await Session.find({
            relations: ["station"],
            order: { start_time: "DESC" },
        });

        const headers = [
            'Session ID',
            'User',
            'Station',
            'Start Time',
            'Duration',
            'Energy (kWh)',
            'Cost (EGP)',
            'Status',
            'Payment Method',
            'Connector ID',
            'Charger ID',
            'End Time'
        ];

        const csvRows = sessions.map(session => [
            formatSessionId(session.id),
            formatUserDisplay(session.user_id),
            session.station?.name || 'Unknown Station',
            session.start_time !== null ? session.start_time.toISOString() : '',
            formatDuration(session.duration_minutes),
            Number(session.energy_delivered).toFixed(2),
            Number(session.cost).toFixed(2),
            session.status,
            session.payment_method,
            session.connector_id || '',
            session.charger_id || '',
            session.end_time !== null ? session.end_time.toISOString() : ''
        ]);

        const csvContent = [
            headers.join(','),
            ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="sessions_${new Date().toISOString().split('T')[0]}.csv"`);
        
        res.send(csvContent);
    } catch (error) {
        console.error("Error exporting sessions CSV:", error);
        res.status(500).json({
            success: false,
            message: "Failed to export sessions CSV"
        });
    }
}; 