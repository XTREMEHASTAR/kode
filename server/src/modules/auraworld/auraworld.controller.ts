import { Request, Response } from 'express';
import { globalAuraWorld } from './auraworld_engine.js';

export async function getWorldState(_req: Request, res: Response): Promise<void> {
  try {
    const snapshot = globalAuraWorld.getSnapshot();
    res.json({
      success: true,
      data: snapshot
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve AuraWorld state',
      error: error.message || String(error)
    });
  }
}

export async function advanceWorldTick(req: Request, res: Response): Promise<void> {
  try {
    const deltaSeconds = req.body.deltaRealSeconds ? Number(req.body.deltaRealSeconds) : 1.0;
    const snapshot = await globalAuraWorld.stepWorld(deltaSeconds);
    res.json({
      success: true,
      message: `World advanced by ${deltaSeconds}s tick.`,
      data: snapshot
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to advance world tick',
      error: error.message || String(error)
    });
  }
}

export async function triggerGlobalMacroEvent(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, severity, affectedCategories, attentionMultiplier } = req.body;
    const evt = await globalAuraWorld.globalEventsEngine.triggerGlobalEvent(
      title || 'Macro Shock Event',
      description || 'Platform event affecting distribution dynamics.',
      severity || 'MEDIUM',
      affectedCategories || ['General'],
      attentionMultiplier ? Number(attentionMultiplier) : 1.5
    );

    res.json({
      success: true,
      data: evt
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to trigger global macro event',
      error: error.message || String(error)
    });
  }
}

export async function getEventHistory(req: Request, res: Response): Promise<void> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const history = globalAuraWorld.eventBus.getEventHistory(limit);
    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event history',
      error: error.message || String(error)
    });
  }
}
