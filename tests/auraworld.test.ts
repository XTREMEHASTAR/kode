import { AuraWorldEngine } from '../server/src/modules/auraworld/auraworld_engine.js';
import { WorldEventBus } from '../server/src/modules/auraworld/event_bus.js';

async function runAuraWorldTestSuite() {
  console.log('🧪 Starting AuraWorld Engine Test Suite...');
  let testsPassed = 0;
  let testsTotal = 0;

  function assert(condition: boolean, message: string) {
    testsTotal++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  // Test 1: Event Bus Pub/Sub
  console.log('\n--- 1. Event Bus Tests ---');
  const bus = new WorldEventBus();
  let receivedEvent = false;
  bus.subscribe('TIME_TICK', (evt) => {
    receivedEvent = true;
    assert(evt.payload.dilationFactor === 3600, 'Event payload contains correct dilation factor');
  });

  await bus.publish({
    type: 'TIME_TICK',
    timestamp: new Date().toISOString(),
    simulatedTimeSec: 3600,
    payload: { dilationFactor: 3600 }
  });
  assert(receivedEvent, 'WorldEventBus handler triggered successfully');

  // Test 2: Master Engine Initialization & All 11 Modules
  console.log('\n--- 2. AuraWorld Master Engine Initialization ---');
  const world = new AuraWorldEngine('test_world');
  const initialSnapshot = world.getSnapshot();

  assert(initialSnapshot.worldId === 'test_world', 'World Engine initialized with custom ID');
  assert(initialSnapshot.activeTrends.length >= 3, 'Trend Engine initialized with active SIR trends');
  assert(initialSnapshot.communities.length >= 4, 'Community Engine initialized subcommunity graph clusters');
  assert(initialSnapshot.creators.length >= 3, 'Creator Ecosystem initialized synthetic creator profiles');
  assert(initialSnapshot.trendingMusic.length >= 3, 'Trending Music Engine initialized audio tracks');
  assert(initialSnapshot.trendingFormats.length >= 3, 'Trending Formats Engine initialized templates');

  // Test 3: Simulation Clock & Step Advance
  console.log('\n--- 3. Time Dilation & Step Tick ---');
  const stepSnapshot = await world.stepWorld(1.0); // 1 real sec = 3600 sim sec (1 hour)
  assert(stepSnapshot.simulatedTime.tickCount === 1, 'Tick count incremented to 1');
  assert(stepSnapshot.simulatedTime.currentSimulatedTimeSec === 3600, 'Simulated clock advanced by 3600 seconds');
  assert(stepSnapshot.totalEventsProcessed >= 1, 'Event bus logged processed time ticks');

  // Test 4: Macro Event Triggering
  console.log('\n--- 4. Global Macro Events ---');
  const macroEvt = await world.globalEventsEngine.triggerGlobalEvent(
    'Instagram Algorithm Overhaul v3',
    'Algorithm prioritizes original audio and 3s retention.',
    'PLATFORM_SHOCK',
    ['Creator Economy', 'Tech'],
    2.0
  );
  assert(macroEvt.severity === 'PLATFORM_SHOCK', 'Global macro event severity verified');
  assert(world.globalEventsEngine.getActiveEvents().length >= 1, 'Active events registered in World OS');

  // Test 5: SIR Epidemic Diffusion Trend Dynamics
  console.log('\n--- 5. SIR Trend Diffusion & Growth ---');
  const newTrend = await world.trendEngine.createTrend('Hyper-Personalized AI Feed', 'Tech', 4.2);
  assert(newTrend.status === 'EMERGING', 'Newly created trend initialized as EMERGING');

  // Advance time by 5 steps to trigger epidemic spread
  for (let i = 0; i < 5; i++) {
    await world.stepWorld(1.0);
  }
  const updatedTrends = world.trendEngine.getTrends();
  const emergingTrend = updatedTrends.find(t => t.id === newTrend.id);
  assert(emergingTrend !== undefined && emergingTrend.infectedPopulation > 5000, 'SIR trend epidemic population grew exponentially');

  // Test 6: Platform Health & Attention Economy
  console.log('\n--- 6. Platform Health & Attention Pool ---');
  const healthMetrics = world.platformHealthEngine.getMetrics();
  assert(healthMetrics.viewerRetentionRatePct > 70.0, 'Platform viewer retention metric within healthy threshold');
  assert(healthMetrics.activeViewersDAU > 1000000, 'Active viewer DAU pool active');

  console.log(`\n🎉 AuraWorld Test Suite Finished: ${testsPassed}/${testsTotal} passed.`);
}

runAuraWorldTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
