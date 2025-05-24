import { describe, it, expect, beforeEach } from 'vitest';
import { Node } from '../node/index.js';
import { create, ErrorMsgs, Config, Core, API } from './structure.js';

interface Data {
  value: number;
}
type K = 'head' | 'tail';

describe('structure.create (current context)', () => {
  describe('singly linked', () => {
    let structure: ReturnType<typeof create<Data, 'singly', K>>;

    beforeEach(() => {
      structure = create<Data, 'singly', K>({
        nodeType: 'singly',
        root: [
          { key: 'head', opts: { id: 'head', data: { value: 5 } } },
          { key: 'tail' }
        ],
        primaryRootKey: 'head',
        maxSize: 5,
        errorMsgs: {
          overflow: 'of',
          underflow: 'uf',
          inBounds: 'ib',
          empty: 'e'
        }
      });
    });

    it('exposes correct API and core', () => {
      const { api, core } = structure;
      expect(api.get.maxSize).toBe(5);
      expect(api.get.type).toBe('fixed');
      expect(api.get.size).toBe(1);
      expect(api.get.capacity).toBe(4);
      expect(api.get.errorMsgs).toEqual({
        overflow: 'of',
        underflow: 'uf',
        inBounds: 'ib',
        empty: 'e'
      });
      expect(api.get.primaryRootKey).toBe('head');
      expect(core.get.rootNode('head')).toBeDefined();
      expect(core.get.rootNode('tail')).toBeUndefined();
      expect(typeof core.createNode).toBe('function');
      expect(typeof core.sideEffects.inc).toBe('function');
      expect(typeof core.sideEffects.dec).toBe('function');
      expect(structure.core.iterators.forward).toBeInstanceOf(Function);
    });

    it('set.errorMsgs updates error messages', () => {
      structure.core.set.errorMsgs = { overflow: 'new' };
      expect(structure.api.get.errorMsgs.overflow).toBe('new');
      expect(structure.core.get.errorMsgs.overflow).toBe('new');
    });

    it('set.maxSize updates maxSize and type', () => {
      structure.core.set.maxSize = 2;
      expect(structure.api.get.maxSize).toBe(2);
      expect(structure.core.get.type).toBe('fixed');
      structure.core.set.maxSize = Infinity;
      expect(structure.core.get.maxSize).toBe(Infinity);
      expect(structure.core.get.type).toBe('dynamic');
    });

    it('set.maxSize throws if < 0 || < current size ', () => {
      structure.core.set.maxSize = 2;
      console.log(structure.core.get.size);
      expect(() => (structure.core.set.maxSize = -1)).toThrow();
      structure.core.set.rootNode(
        'head',
        Node.create.singly({ id: 'h', data: { value: 1 } })
      );
      expect(() => (structure.core.set.maxSize = 0)).toThrow();
    });

    it('is.full, is.empty, is.inBounds', () => {
      structure.core.set.rootNode(
        'tail',
        Node.create.singly({ id: 't', data: { value: 5 } })
      );
      expect(structure.core.is.full()).toBe(false);
      expect(structure.core.is.empty()).toBe(false);
      expect(structure.core.is.inBounds(0)).toBe(true);
      expect(structure.core.is.inBounds(1)).toBe(true);
      expect(structure.core.is.inBounds(2)).toBe(true);
      expect(structure.core.is.inBounds(3)).toBe(false);
      structure.core.set.rootNode('head');
      structure.core.set.rootNode('tail');
      console.log(structure.core.get.size);
      expect(structure.core.is.empty()).toBe(true);
    });

    // it('assert.inBounds, notFull, notEmpty', () => {
    //   expect(structure.core.assert.inBounds(0)).toBe(true);
    //   expect(() => structure.core.assert.inBounds(10)).toThrow();
    //   expect(structure.core.assert.notFull()).toBe(true);
    //   // Simulate full
    //   (structure as any).core.size = 5;
    //   expect(() => structure.core.assert.notFull()).toThrow();
    //   (structure as any).core.size = 0;
    //   expect(structure.core.assert.notEmpty()).toBe(true);
    //   // Simulate empty
    //   (structure as any).core.size = 0;
    //   expect(() => structure.core.assert.notEmpty()).toThrow();
    // });

    // it('withSize.inc and dec adjust size', () => {
    //   let ran = false;
    //   structure.core.withSize.inc(() => {
    //     ran = true;
    //     expect(structure.core.size).toBe(1);
    //     return 123;
    //   });
    //   expect(ran).toBe(true);
    //   expect(structure.core.size).toBe(1);

    //   structure.core.withSize.dec(() => {
    //     expect(structure.core.size).toBe(0);
    //   });
    //   expect(structure.core.size).toBe(0);
    // });

    // it('createNode creates a node of correct type', () => {
    //   const node = structure.core.createNode({ id: 'x', data: { value: 99 } });
    //   expect(node.id).toBe('x');
    //   expect(node.data).toEqual({ value: 99 });
    //   expect(node.next).toBeUndefined();
    // });

    // it('iterators.forward yields nodes from current root', () => {
    //   // Should yield head node
    //   const nodes = Array.from(
    //     structure.core.iterators.forward(structure.core.root.head)
    //   );
    //   expect(nodes.length).toBe(1);
    //   expect(nodes[0].node?.id).toBe('h');

    //   // If we change root.head, iterator should reflect it
    //   const newNode = Node.create.singly({ id: 'z', data: { value: 42 } });
    //   structure.core.root.head = newNode;
    //   const nodes2 = Array.from(
    //     structure.core.iterators.forward(structure.core.root.head)
    //   );
    //   expect(nodes2.length).toBe(1);
    //   expect(nodes2[0].node?.id).toBe('z');
    // });
  });
  // describe('doubly linked', () => {
  //   let structure: ReturnType<typeof create<Data, 'doubly', K, any>>;

  //   beforeEach(() => {
  //     structure = create<Data, 'doubly', K, any>({
  //       nodeType: 'doubly',
  //       rootKeys: ['head', 'tail'],
  //       primaryRootKey: 'head',
  //       maxSize: 2
  //     });
  //   });

  //   it('exposes correct API and core for doubly', () => {
  //     expect(structure.api.maxSize).toBe(2);
  //     expect(structure.api.type).toBe('dynamic');
  //     expect(structure.api.size).toBe(0);
  //     expect(structure.api.capacity).toBe(2);
  //     expect(structure.api.primaryRootKey).toBe('head');
  //     expect(typeof structure.core.createNode).toBe('function');
  //     expect(typeof structure.core.withSize.inc).toBe('function');
  //     expect(typeof structure.core.withSize.dec).toBe('function');
  //     expect(structure.core.iterators.forward).toBeInstanceOf(Function);
  //     expect(structure.core.iterators.backward).toBeInstanceOf(Function);
  //   });

  //   it('createNode creates a doubly node', () => {
  //     const node = structure.core.createNode({ id: 'x', data: { value: 99 } });
  //     expect(node.id).toBe('x');
  //     expect(node.data).toEqual({ value: 99 });
  //     expect(node.next).toBeUndefined();
  //     expect(node.prev).toBeUndefined();
  //   });

  //   it('iterators.forward and backward yield nodes from current root', () => {
  //     // Should yield head node
  //     const nodesFwd = Array.from(
  //       structure.core.iterators.forward(structure.core.root.head)
  //     );
  //     expect(nodesFwd.length).toBe(1);
  //     expect(nodesFwd[0].node?.id).toBe('h');
  //     const nodesBwd = Array.from(
  //       structure.core.iterators.backward(structure.core.root.head)
  //     );
  //     expect(nodesBwd.length).toBe(1);
  //     expect(nodesBwd[0].node?.id).toBe('h');

  //     // If we change root.head, iterator should reflect it
  //     const newNode = Node.create.doubly({ id: 'z', data: { value: 42 } });
  //     structure.core.root.head = newNode;
  //     const nodes2 = Array.from(
  //       structure.core.iterators.forward(structure.core.root.head)
  //     );
  //     expect(nodes2.length).toBe(1);
  //     expect(nodes2[0].node?.id).toBe('z');
  //   });
  // });
  // describe('immutability and freezing', () => {
  //   it('api and core objects are frozen', () => {
  //     const structure = create<Data, 'singly', K, any>({
  //       nodeType: 'singly',
  //       rootKeys: ['head', 'tail'],
  //       primaryRootKey: 'head'
  //     });
  //     expect(Object.isFrozen(structure.api)).toBe(true);
  //     expect(Object.isFrozen(structure.core)).toBe(true);
  //   });
  // });
});
