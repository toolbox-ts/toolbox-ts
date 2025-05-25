import { describe, it, expect } from 'vitest';
import * as Doubly from './doubly';

describe('doubly module', () => {
  it('exports correct IteratorKey and PointerKey types', () => {
    type K = Doubly.IteratorKey;
    const forward: K = 'forward';
    const backward: K = 'backward';
    expect(forward).toBe('forward');
    expect(backward).toBe('backward');
    expect(typeof forward).toBe('string');
  });

  it('create is a Factory with correct iterator configs', () => {
    expect(Doubly.create).toBeDefined();
    expect(typeof Doubly.create.node).toBe('function');
    expect(typeof Doubly.create.iterators).toBe('function');
    expect(typeof Doubly.create.record).toBe('function');
    const iterators = Doubly.create.iterators<number, Doubly.Type<number>>();
    expect(typeof iterators.forward).toBe('function');
    expect(typeof iterators.backward).toBe('function');
  });
});
