/**
 * StateAggregator — Unit Tests
 * Tissue ID: TIS-STATEAGG-v0.1.0
 * Test Hash: 747f69b9
 */

import { StateAggregator } from '../src/entity';
import { NIGERIA_FIRST_CONFIG, TISSUE_ID, COMPOSED_CELLS } from '../src/types';

describe('StateAggregator', () => {
  let tissue: StateAggregator;

  beforeEach(() => {
    tissue = new StateAggregator();
  });

  describe('Identity', () => {
    it('should have correct tissue ID', () => {
      expect(TISSUE_ID).toBe('TIS-STATEAGG-v0.1.0');
    });

    it('should compose correct cells', () => {
      expect(COMPOSED_CELLS).toEqual(['CEL-STATESTORE', 'CEL-STATESYNC', 'CEL-STATEMERGE']);
    });
  });

  describe('Coordination', () => {
    it('should coordinate requests with Nigeria-first defaults', async () => {
      const request = {
        requestId: 'test-747f69b9-001',
        sourceCell: 'CEL-STATESTORE',
        targetCells: ['CEL-STATESTORE', 'CEL-STATESYNC', 'CEL-STATEMERGE'],
        payload: { action: 'test' },
        timeout: NIGERIA_FIRST_CONFIG.DEFAULT_TIMEOUT_MS,
        locale: NIGERIA_FIRST_CONFIG.DEFAULT_LOCALE,
        offlineCapable: true,
      };
      const result = await tissue.coordinate(request);
      expect(result.requestId).toBe('test-747f69b9-001');
      expect(['completed', 'partial', 'queued']).toContain(result.status);
    });

    it('should enforce 30s Nigeria-first timeout', () => {
      expect(NIGERIA_FIRST_CONFIG.DEFAULT_TIMEOUT_MS).toBe(30_000);
    });

    it('should use en-NG locale by default', () => {
      expect(NIGERIA_FIRST_CONFIG.DEFAULT_LOCALE).toBe('en-NG');
    });
  });

  describe('Offline First (NON-NEGOTIABLE)', () => {
    it('should queue requests when offline', async () => {
      const request = {
        requestId: 'offline-747f69b9-001',
        sourceCell: 'CEL-STATESTORE',
        targetCells: ['CEL-STATESTORE'],
        payload: { action: 'offline-test' },
        timeout: 30000,
        locale: 'en-NG',
        offlineCapable: true,
      };
      const result = await tissue.coordinateOffline(request);
      expect(result.status).toBe('queued');
      expect(result.offlineQueued).toBe(true);
    });

    it('should report queue depth in health check', async () => {
      const health = await tissue.getHealth();
      expect(health.tissueId).toBe('TIS-STATEAGG-v0.1.0');
      expect(typeof health.queueDepth).toBe('number');
    });
  });

  describe('Sync', () => {
    it('should sync offline queue', async () => {
      const context = {
        syncId: 'sync-747f69b9-001',
        lastSyncTimestamp: Date.now() - 60000,
        vectorClock: new Map(),
        conflictStrategy: 'last-write-wins' as const,
      };
      const result = await tissue.sync(context);
      expect(result.syncId).toBe('sync-747f69b9-001');
      expect(typeof result.itemsSynced).toBe('number');
    });
  });
});
