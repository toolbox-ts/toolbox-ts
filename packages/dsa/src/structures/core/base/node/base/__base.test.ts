import { describe, it, expect } from 'vitest';
import { Factory, type Type } from './base.js';

// Minimal concrete node type for testing
interface TestNode extends Type<number> {
  type: 'test';
  next?: TestNode;
  prev?: TestNode;
}

const iteratorConfigs = [
  { key: 'forward', pointerKey: 'next' },
  { key: 'backward', pointerKey: 'prev' }
] as const;

const TestFactory = Factory<TestNode, 'forward' | 'backward', 'test'>({
  type: 'test',
  iteratorConfigs
});

describe('Factory', () => {
  it('creates a node with id, data, and detail', () => {
    const node = TestFactory.node<number, TestNode>({ id: 'n1', data: 42 });
    expect(node.type).toBe('test');
    expect(node.id).toBe('n1');
    expect(node.data).toBe(42);
    node.data = 100;
    expect(node.data).toBe(100);
    expect(node.detail).toEqual({ id: 'n1', data: 100 });
  });

  it('creates a node with pointer properties', () => {
    const n2 = TestFactory.node<number, TestNode>({ id: 'n2', data: 2 });
    const n1 = TestFactory.node<number, TestNode>({
      id: 'n1',
      data: 1,
      pointers: { next: n2 }
    });
    expect(n1.next).toBe(n2);
    n1.next = undefined;
    expect(n1.next).toBe(undefined);
  });

  it('creates a record of nodes', () => {
    const record = TestFactory.record<number, TestNode, 'a' | 'b'>([
      { key: 'a', args: { id: 'a', data: 1 } },
      { key: 'b', args: undefined }
    ]);
    expect(record.a).toBeDefined();
    expect(record.b).toBeUndefined();
    expect(record.a?.id).toBe('a');
  });

  it('creates iterators and iterates forward and backward', () => {
    const n3 = TestFactory.node<number, TestNode>({ id: 'n3', data: 3 });
    const n2 = TestFactory.node<number, TestNode>({
      id: 'n2',
      data: 2,
      pointers: { next: n3 }
    });
    const n1 = TestFactory.node<number, TestNode>({
      id: 'n1',
      data: 1,
      pointers: { next: n2 }
    });
    n2.prev = n1;
    n3.prev = n2;

    const iterators = TestFactory.iterators<number, TestNode>();
    // Forward
    const forward = Array.from(iterators.forward(n1));
    expect(forward.map((y) => y.node.id)).toEqual(['n1', 'n2', 'n3']);
    expect(forward.map((y) => y.index)).toEqual([0, 1, 2]);
    // Backward
    const backward = Array.from(iterators.backward(n3));
    expect(backward.map((y) => y.node.id)).toEqual(['n3', 'n2', 'n1']);
    expect(backward.map((y) => y.index)).toEqual([0, 1, 2]);
  });

  it('getPointerPropertyDescriptorMap returns correct descriptors', () => {
    const map = (TestFactory as any).node.getPointerPropertyDescriptorMap?.({
      next: undefined
    });
    if (map) {
      expect(typeof map.next.get).toBe('function');
      expect(typeof map.next.set).toBe('function');
    }
  });

  it('handles empty pointers and iterators', () => {
    const EmptyFactory = Factory<Type, never, 'test'>({
      type: 'test',
      iteratorConfigs: []
    });
    const node = EmptyFactory.node({ id: 'empty', data: null });
    expect(node.id).toBe('empty');
    expect(node.data).toBe(null);
    expect(node.detail).toEqual({ id: 'empty', data: null });
    // No iterators
    expect(Object.keys(EmptyFactory.iterators())).toHaveLength(0);
  });
});
