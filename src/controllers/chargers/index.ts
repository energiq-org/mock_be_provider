import { Request, Response } from "express";
import { AppDataSource } from "../../config/dbConnection.js";
import { Charger } from "../../models/charger.js";
import { Connector } from "../../models/connector.js";

async function restartChargerController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Simulate restart operation with 3 second delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const chargerRepository = AppDataSource.getRepository(Charger);
        const charger = await chargerRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['station']
        });
        
        if (!charger) {
            return res.status(404).json({ msg: "Charger not found" });
        }
        
        // Update updated_at timestamp to indicate restart
        charger.updated_at = new Date();
        await chargerRepository.save(charger);
        
        return res.status(200).json({ 
            msg: "Charger restarted successfully",
            data: charger
        });
    } catch (error) {
        console.error('Error restarting charger:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function rebootChargerController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Simulate reboot operation with 3 second delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const chargerRepository = AppDataSource.getRepository(Charger);
        const charger = await chargerRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['station']
        });
        
        if (!charger) {
            return res.status(404).json({ msg: "Charger not found" });
        }
        
        // Update updated_at timestamp to indicate reboot
        charger.updated_at = new Date();
        await chargerRepository.save(charger);
        
        return res.status(200).json({ 
            msg: "Charger rebooted successfully",
            data: charger
        });
    } catch (error) {
        console.error('Error rebooting charger:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function deleteChargerController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        const chargerRepository = AppDataSource.getRepository(Charger);
        const connectorRepository = AppDataSource.getRepository(Connector);
        
        const charger = await chargerRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['connectors', 'station']
        });
        
        if (!charger) {
            return res.status(404).json({ msg: "Charger not found" });
        }
        
        // Start transaction for safe deletion
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            // Delete all connectors first
            if (charger.connectors) {
                for (const connector of charger.connectors) {
                    await queryRunner.manager.remove(Connector, connector);
                }
            }
            
            // Delete the charger
            await queryRunner.manager.remove(Charger, charger);
            
            // Commit transaction
            await queryRunner.commitTransaction();
            
            return res.status(200).json({ 
                msg: `Charger ${charger.name} deleted successfully` 
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
        console.error('Error deleting charger:', error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { 
    restartChargerController,
    rebootChargerController,
    deleteChargerController
}; 