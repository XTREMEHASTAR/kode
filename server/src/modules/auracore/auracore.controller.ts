import { Request, Response } from 'express';
import { AuraCoreSimulationEngine } from './auracore_simulation_engine.js';
import { ContentDnaService } from './content_dna_service.js';
import { SyntheticSwarmService } from './synthetic_swarm_service.js';

const simulationEngine = new AuraCoreSimulationEngine();
const contentDnaService = new ContentDnaService();
const syntheticSwarmService = new SyntheticSwarmService();

export async function runAuraCoreSimulation(req: Request, res: Response): Promise<void> {
  try {
    const { title, scriptText, durationSec, populationSize, contentType } = req.body;

    if (!scriptText || typeof scriptText !== 'string' || scriptText.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'scriptText is required to run AuraCore simulation.'
      });
      return;
    }

    const telemetry = await simulationEngine.runSimulation({
      title: title || 'Untitled Content',
      scriptText,
      durationSec: durationSec ? Number(durationSec) : undefined,
      populationSize: populationSize ? Number(populationSize) : 1000,
      contentType: contentType || 'Instagram Reel'
    });

    res.json({
      success: true,
      data: telemetry
    });
  } catch (error: any) {
    console.error('[AuraCore Controller] Simulation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run AuraCore simulation',
      error: error.message || String(error)
    });
  }
}

export async function extractContentDna(req: Request, res: Response): Promise<void> {
  try {
    const { title, scriptText, durationSec, contentType } = req.body;
    const dna = await contentDnaService.extractContentDna({
      title: title || 'Untitled',
      scriptText: scriptText || '',
      durationSec: durationSec ? Number(durationSec) : undefined,
      contentType
    });

    res.json({
      success: true,
      data: dna
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to extract Content DNA',
      error: error.message || String(error)
    });
  }
}

export async function getSyntheticPopulation(req: Request, res: Response): Promise<void> {
  try {
    const count = req.query.count ? Number(req.query.count) : 50;
    const swarm = syntheticSwarmService.generateSwarm(count);

    res.json({
      success: true,
      count: swarm.length,
      data: swarm
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate synthetic population',
      error: error.message || String(error)
    });
  }
}
