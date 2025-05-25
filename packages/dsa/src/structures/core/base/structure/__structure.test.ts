import { describe, it, expect, beforeEach } from 'vitest';
import { create, type API, type Core } from './structure.js';
import { Node } from '../node/index';

interface Data {
  value: number;
}
type NodeType = 'singly';
type RootKey = 'head' | 'tail';

const mockNode = (id: string, value: number) =>
  Node.create.singly({ id, data: { value } });

describe('structure module', () => {
  let structure: ReturnType<typeof create<NodeType, Data, RootKey>>;
  let api: API<NodeType, Data, RootKey>;
  let core: Core<NodeType, Data, RootKey>;

  beforeEach(() => {
    structure = create<NodeType, Data, RootKey>({
      nodeType: 'singly',
      root: [
        { key: 'head', opts: { id: 'head', data: { value: 1 } } },
        { key: 'tail', opts: undefined }
      ],
      primaryRootKey: 'head',
      primaryIteratorKey: 'forward',
      maxSize: 3,
      errorMsgs: { overflow: 'of', underflow: 'uf', inBounds: 'ib', empty: 'e' }
    });
    api = structure.api;
    core = structure.core;
  });

  it('exposes correct API and core', () => {
    expect(api.get.maxSize).toBe(3);
    expect(api.get.type).toBe('fixed');
    expect(typeof api.get.size).toBe('function');
    expect(api.get.capacity).toBe(2);
    expect(api.get.errorMsgs).toEqual({
      overflow: 'of',
      underflow: 'uf',
      inBounds: 'ib',
      empty: 'e'
    });
    expect(typeof core.createNode).toBe('function');
    expect(typeof core.iterators.forward).toBe('function');
    expect(core.root.get('head')).toBeDefined();
    expect(core.root.get('tail')).toBeUndefined();
    expect(core.root.primaryKey).toBe('head');
    expect(core.root.keys).toContain('head');
    expect(core.root.keys).toContain('tail');
    expect(core.root.has('head')).toBe(true);
    expect(core.root.has('tail')).toBe(true);
  });

  it('root.set/get/reset/has works as expected', () => {
    // set/get
    const node = mockNode('tail', 2);
    core.root.set('tail', node);
    expect(core.root.get('tail')).toBe(node);
    // reset
    core.root.reset();
    expect(core.root.get('head')).toBeUndefined();
    expect(core.root.get('tail')).toBeUndefined();
    // has
    expect(core.root.has('head')).toBe(true);
    expect(core.root.has('tail')).toBe(true);
    // error on invalid key
    expect(() => core.root.get('nope' as any)).toThrow();
    expect(() => core.root.set('nope' as any, node)).toThrow();
  });

  it('set.errorMsgs and set.maxSize work and throw as expected', () => {
    // set.errorMsgs
    core.set.errorMsgs = { overflow: 'newOverflow' };
    expect(api.get.errorMsgs.overflow).toBe('newOverflow');
    // set.maxSize
    core.set.maxSize = 2;
    expect(api.get.maxSize).toBe(2);
    expect(api.get.type).toBe('fixed');
    core.set.maxSize = Infinity;
    expect(api.get.type).toBe('dynamic');
    // throws if < 0
    expect(() => (core.set.maxSize = -1)).toThrow();
    // throws if < current size
    core.root.set('tail', mockNode('tail', 2));
    expect(() => (core.set.maxSize = 1)).toThrow();
  });

  it('is.full, is.empty, is.inBounds', () => {
    expect(core.is.full()).toBe(false);
    expect(core.is.empty()).toBe(false);
    expect(core.is.inBounds(0)).toBe(true);
    expect(core.is.inBounds(1)).toBe(true);
    expect(core.is.inBounds(2)).toBe(false);
    // fill up
    core.root.set('tail', mockNode('tail', 2));
    expect(core.is.full()).toBe(true);
    // empty all
    core.root.reset();
    expect(core.is.empty()).toBe(true);
  });

  it('assert.inBounds, notFull, notEmpty', () => {
    expect(core.assert.inBounds(0)).toBe(true);
    expect(() => core.assert.inBounds(2)).toThrow();
    expect(core.assert.notFull()).toBe(true);
    // fill up
    core.root.set('tail', mockNode('tail', 2));
    expect(() => core.assert.notFull()).toThrow();
    // empty all
    core.root.reset();
    expect(core.assert.notEmpty()).toBe(true);
    core.root.reset();
    expect(() => core.assert.notEmpty()).toThrow();
  });

  it('size is always computed from iterator', () => {
    // Add a node to tail, should increase size
    core.root.set('tail', mockNode('tail', 2));
    expect(api.get.size()).toBe(2);
    // Remove head, should decrease size
    core.root.set('head', undefined);
    expect(api.get.size()).toBe(1);
    // Remove tail, should be 0
    core.root.set('tail', undefined);
    expect(api.get.size()).toBe(0);
  });
});
