import { describe, it, expect } from 'vitest';
import * as Singly from './singly';

describe('singly module', () => {
  it('exports correct IteratorKey and PointerKey types', () => {
    type K = Singly.IteratorKey;
    type P = Singly.PointerKey;
    const key: K = 'forward';
    expect(key).toBe('forward');
    expect(typeof key).toBe('string');
  });

  it('create is a Factory with correct iterator config', () => {
    expect(Singly.create).toBeDefined();
    expect(typeof Singly.create.node).toBe('function');
    expect(typeof Singly.create.iterators).toBe('function');
    expect(typeof Singly.create.record).toBe('function');
    const iterators = Singly.create.iterators<number, Singly.Type<number>>();
    expect(typeof iterators.forward).toBe('function');
  });
});
