import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { getStationsQueryParamsSchema } from "../../schemas/controllers/dashboard/dashboard.js";
import { AppDataSource } from "../../config/dbConnection.js";
import { Station } from "../../models/station.js";
import { Charger } from "../../models/charger.js";
import { Connector } from "../../models/connector.js";

async function getStationsController(
    req: Request<unknown, unknown, unknown, Static<typeof getStationsQueryParamsSchema>>,
    res: Response
) {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        const stationRepository = AppDataSource.getRepository(Station);
        
        // Build query with relations
        const queryBuilder = stationRepository.createQueryBuilder("station")
            .leftJoinAndSelect("station.chargers", "charger")
            .leftJoinAndSelect("charger.connectors", "connector");

        // Filter by status if provided
        if (status) {
            queryBuilder.where("station.status = :status", { status });
        }

        // Apply pagination and get results
        const [stations] = await queryBuilder
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        // Transform data to match frontend expectations
        const transformedStations = stations.map(station => ({
            // Map data structure for frontend compatibility
            ID: station.id,
            UUID: `uuid-${station.id}`,
            AddressInfo: {
                ID: station.id,
                Distance: 0, // Could be calculated based on user location
                Title: station.name,
                AddressLine1: station.location,
                AddressLine2: null,
                Town: station.location.split(',')[1]?.trim() || '',
                StateOrProvince: station.location.split(',')[2]?.trim() || '',
                Postcode: null,
                Country: {
                    ISOCode: "EG",
                    ContinentCode: "AF",
                    ID: 1,
                    Title: "Egypt"
                },
                Latitude: parseFloat(station.latitude.toString()),
                Longitude: parseFloat(station.longitude.toString())
            },
            Connections: (station.chargers as any[]).flatMap((charger: any) => 
                (charger.connectors as any[]).map((connector: any) => ({
                    ID: connector.id,
                    ConnectionTypeID: connector.id,
                    ConnectionType: {
                        FormalName: connector.type,
                        IsDiscontinued: false,
                        IsObsolete: false,
                        ID: connector.id,
                        Title: connector.type
                    },
                    StatusType: {
                        IsOperational: connector.status === 'Available',
                        IsUserSelectable: true,
                        ID: connector.status === 'Available' ? 1 : 2,
                        Title: connector.status
                    },
                    Level: {
                        Comments: `${connector.max_power}kW charging`,
                        IsFastChargeCapable: parseFloat(connector.max_power) > 22,
                        ID: parseFloat(connector.max_power) > 22 ? 3 : 2,
                        Title: parseFloat(connector.max_power) > 22 ? "Level 3 (Fast)" : "Level 2 (Standard)"
                    },
                    Amps: Math.round(parseFloat(connector.max_power) * 1000 / 230), // Approximate calculation
                    Voltage: 230,
                    PowerKW: parseFloat(connector.max_power),
                    CurrentType: {
                        Description: charger.type === 'AC' ? 'Alternating Current' : 'Direct Current',
                        ID: charger.type === 'AC' ? 1 : 2,
                        Title: charger.type
                    },
                    Quantity: 1
                }))
            ),
            UsageCost: "Free", // Could be dynamic based on station settings
            NumberOfPoints: station.connectors_count,
            StatusType: {
                IsOperational: station.status === 'Online',
                IsUserSelectable: true,
                ID: station.status === 'Online' ? 1 : station.status === 'Degraded' ? 2 : 3,
                Title: station.status
            },
            // Additional fields for table display
            Name: station.name,
            Location: station.location,
            Status: station.status,
            Power: station.power,
            Sessions: station.active_sessions,
            TotalSessions: station.total_sessions,
            AlertsCount: station.alerts_count,
            ChargersCount: station.chargers_count,
            ConnectorsCount: station.connectors_count,
            LastSeen: station.last_seen,
            CreatedAt: station.created_at,
            UpdatedAt: station.updated_at
        }));

        return res.status(200).json(transformedStations);
    } catch (error) {
        console.error('Error fetching stations:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function createStationController(req: Request, res: Response) {
    try {
        const { name, location, latitude, longitude, status, operatingHours, chargers }: {
            name: string;
            location: string;
            latitude: number;
            longitude: number;
            status: string;
            operatingHours?: any;
            chargers?: any[];
        } = req.body;
        
        // Calculate totals from chargers and connectors
        const chargers_count = chargers?.length || 0;
        const connectors_count = chargers?.reduce((total: number, charger: any) => total + (charger.connectors?.length || 0), 0) || 0;
        
        // Calculate total power from chargers
        const total_power = chargers?.reduce((total: number, charger: any) => total + (charger.power || 0), 0) || 0;
        
        // Map frontend status to backend status
        const backendStatus = status === 'Active' ? 'Online' : status === 'Under Maintenance' ? 'Degraded' : 'Offline';
        
        // Create station entity
        const stationRepository = AppDataSource.getRepository(Station);
        const chargerRepository = AppDataSource.getRepository(Charger);
        const connectorRepository = AppDataSource.getRepository(Connector);
        
        // Start transaction
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            // Create and save station
            const station = new Station();
            station.name = name;
            station.location = location;
            station.status = backendStatus as any;
            station.power = `${total_power} kW`;
            station.latitude = latitude;
            station.longitude = longitude;
            station.chargers_count = chargers_count;
            station.connectors_count = connectors_count;
            station.operating_hours = operatingHours;
            station.last_seen = new Date();
            
            const savedStation = await queryRunner.manager.save(Station, station);
            
            // Create chargers and connectors
            const savedChargers: Charger[] = [];
            
            if (chargers && chargers.length > 0) {
                for (let i = 0; i < chargers.length; i++) {
                    const chargerData = chargers[i];
                    
                    // Create charger
                    const charger = new Charger();
                    charger.charger_id = `CH-${String(i + 1).padStart(2, '0')}`;
                    charger.station_id = savedStation.id;
                    charger.name = chargerData.name || `Charger ${i + 1}`;
                    charger.type = chargerData.type;
                    charger.status = chargerData.status || 'Available';
                    charger.max_power = chargerData.power;
                    charger.min_power = chargerData.power * 0.1; // Assume 10% minimum
                    charger.connectors_count = chargerData.connectors?.length || 0;
                    
                    const savedCharger = await queryRunner.manager.save(Charger, charger);
                    savedChargers.push(savedCharger);
                    
                    // Create connectors for this charger
                    if (chargerData.connectors && chargerData.connectors.length > 0) {
                        for (let j = 0; j < chargerData.connectors.length; j++) {
                            const connectorData = chargerData.connectors[j];
                            
                            const connector = new Connector();
                            connector.connector_id = `C-${String(j + 1).padStart(2, '0')}`;
                            connector.charger_id = savedCharger.id;
                            connector.name = connectorData.name || `Connector ${j + 1}`;
                            connector.type = connectorData.type;
                            connector.status = connectorData.status || 'Available';
                            connector.max_power = connectorData.power;
                            connector.min_power = connectorData.power * 0.1; // Assume 10% minimum
                            
                            await queryRunner.manager.save(Connector, connector);
                        }
                    }
                }
            }
            
            // Commit transaction
            await queryRunner.commitTransaction();
            
            // Fetch the complete station with relations
            const completeStation = await stationRepository.findOne({
                where: { id: savedStation.id },
                relations: ['chargers', 'chargers.connectors']
            });
            
            console.log('Station created with chargers and connectors:', JSON.stringify(completeStation, null, 2));
        
        return res.status(201).json({ 
                success: true,
                message: "Station created successfully", 
                data: completeStation 
        });
            
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
        
    } catch (error) {
        console.error('Error creating station:', error);
        return res.status(500).json({ 
            success: false,
            message: (error as Error).message 
        });
    }
}

async function updateStationController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        const stationRepository = AppDataSource.getRepository(Station);
        const station = await stationRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['chargers', 'chargers.connectors']
        });
        
        if (!station) {
            return res.status(404).json({ msg: "Station not found" });
        }
        
        // Update station properties
        Object.assign(station, req.body);
        station.updated_at = new Date();
        
        const updatedStation = await stationRepository.save(station);
        
        return res.status(200).json({ 
            msg: "Station updated successfully", 
            data: updatedStation 
        });
    } catch (error) {
        console.error('Error updating station:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function restartStationController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Simulate restart operation with 3 second delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const stationRepository = AppDataSource.getRepository(Station);
        const station = await stationRepository.findOne({
            where: { id: parseInt(id) }
        });
        
        if (!station) {
            return res.status(404).json({ msg: "Station not found" });
        }
        
        // Update last_seen timestamp to indicate restart
        station.last_seen = new Date();
        await stationRepository.save(station);
        
        return res.status(200).json({ 
            msg: "Station restarted successfully",
            data: station
        });
    } catch (error) {
        console.error('Error restarting station:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function rebootStationController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Simulate reboot operation with 3 second delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const stationRepository = AppDataSource.getRepository(Station);
        const station = await stationRepository.findOne({
            where: { id: parseInt(id) }
        });
        
        if (!station) {
            return res.status(404).json({ msg: "Station not found" });
        }
        
        // Update last_seen timestamp to indicate reboot
        station.last_seen = new Date();
        await stationRepository.save(station);
        
        return res.status(200).json({ 
            msg: "Station rebooted successfully",
            data: station
        });
    } catch (error) {
        console.error('Error rebooting station:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function deleteStationController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        const stationRepository = AppDataSource.getRepository(Station);
        const chargerRepository = AppDataSource.getRepository(Charger);
        const connectorRepository = AppDataSource.getRepository(Connector);
        
        const station = await stationRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['chargers', 'chargers.connectors']
        });
        
        if (!station) {
            return res.status(404).json({ msg: "Station not found" });
        }
        
        // Start transaction for safe deletion
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            // Delete all connectors first
            for (const charger of station.chargers as any[]) {
                if (charger.connectors) {
                    for (const connector of charger.connectors) {
                        await queryRunner.manager.remove(Connector, connector);
                    }
                }
            }
            
            // Delete all chargers
            for (const charger of station.chargers as any[]) {
                await queryRunner.manager.remove(Charger, charger);
            }
            
            // Finally delete the station
            await queryRunner.manager.remove(Station, station);
            
            // Commit transaction
            await queryRunner.commitTransaction();
            
            return res.status(200).json({ 
                msg: `Station ${station.name} deleted successfully` 
            });
            
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
        
    } catch (error) {
        console.error('Error deleting station:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { 
    getStationsController, 
    createStationController, 
    updateStationController, 
    deleteStationController,
    restartStationController,
    rebootStationController
}; 