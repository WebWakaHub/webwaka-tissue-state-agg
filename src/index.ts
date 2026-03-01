/**
 * StateAgg — Tissue Layer
 * Composes cells per BIOLOGICAL_GOVERNANCE_CONSTITUTION §4.1
 * Layer: tissue → depends on → cell
 */

import { StateStoreComposition } from "@webwaka/cell-state-store";
import { AggregateComposition } from "@webwaka/cell-aggregate";

export { StateStoreComposition } from '@webwaka/cell-state-store';
export { AggregateComposition } from '@webwaka/cell-aggregate';

/**
 * StateAgg Composition
 * Assembles cell-layer components into a cohesive tissue-layer capability.
 */
export class StateAggComposition {
  private stateStoreComposition: StateStoreComposition;
  private aggregateComposition: AggregateComposition;

  constructor() {
    this.stateStoreComposition = new StateStoreComposition();
    this.aggregateComposition = new AggregateComposition();
  }
}

export * from "./types";
