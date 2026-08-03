import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ModelRegistryService } from '../modules/simulation/modelRegistryService.js';

describe('Model Registry & Dynamic Routing Engine Test Suite', () => {

  it('1. registers dynamic AI models and queries capability inventory', async () => {
    const customModel = await ModelRegistryService.registerModel({
      id: 'custom-fine-tuned-v1',
      modelName: 'KONTAGI Fine-Tuned Llama 3 70B',
      provider: 'fine-tuned',
      capabilities: ['text-generation', 'vision'],
      avgLatencyMs: 150,
      costPer1kTokens: 0.0002,
      version: 'v1.0-ft',
      fallbackModelId: 'gemini-2-flash',
      qualityScore: 94.5,
      isActive: true
    });

    assert.strictEqual(customModel.id, 'custom-fine-tuned-v1');
    const models = ModelRegistryService.listModels();
    assert.ok(models.some(m => m.id === 'custom-fine-tuned-v1'));
  });

  it('2. performs A/B traffic splitting and Canary deployment probability routing', async () => {
    // Configure 50/50 A/B policy
    await ModelRegistryService.setRoutingPolicy({
      capability: 'text-generation',
      routingStrategy: 'ab_test',
      primaryModelId: 'gemini-2-flash',
      secondaryModelId: 'claude-3-5-sonnet',
      trafficSplitPct: 50.0
    });

    const routeLowSeed = ModelRegistryService.resolveModel('text-generation', 20.0);
    assert.strictEqual(routeLowSeed.selectedModelId, 'gemini-2-flash');

    const routeHighSeed = ModelRegistryService.resolveModel('text-generation', 80.0);
    assert.strictEqual(routeHighSeed.selectedModelId, 'claude-3-5-sonnet');

    // Configure 10% Canary policy
    await ModelRegistryService.setRoutingPolicy({
      capability: 'text-generation',
      routingStrategy: 'canary',
      primaryModelId: 'gemini-2-flash',
      secondaryModelId: 'custom-fine-tuned-v1',
      trafficSplitPct: 10.0
    });

    const canaryTriggered = ModelRegistryService.resolveModel('text-generation', 5.0);
    assert.strictEqual(canaryTriggered.selectedModelId, 'custom-fine-tuned-v1');

    const canaryBypassed = ModelRegistryService.resolveModel('text-generation', 50.0);
    assert.strictEqual(canaryBypassed.selectedModelId, 'gemini-2-flash');
  });

  it('3. executes model call with fallback resilience on simulated failure', async () => {
    const execution = await ModelRegistryService.executeModelCall('text-generation', 'Analyze opening hook velocity...', {
      forceModelId: 'gemini-2-flash',
      simulateFailure: true
    });

    assert.ok(execution.fallbackTriggered, 'Fallback must be triggered on primary failure');
    assert.strictEqual(execution.executedModelId, 'claude-3-5-sonnet', 'Must failover to target fallback model');
    assert.ok(execution.latencyMs > 0);
  });

});
