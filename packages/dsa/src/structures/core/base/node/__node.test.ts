import { describe, expect, it } from 'vitest';
import * as Node from './node.js';

describe('Node Module', () => {
  describe('Singly Node', () => {
    it('creates a singly-linked node with correct properties', () => {
      const data = { value: 42 };
      const node = Node.create.singly({ id: 'node1', data });

      expect(node.id).toBe('node1');
      expect(node.data).toEqual(data);
      expect(node.next).toBeUndefined();
      expect(node.detail).toEqual({ id: 'node1', data });
    });

    it('links nodes and updates next via setter', () => {
      const node2 = Node.create.singly({ id: 'node2', data: { value: 2 } });

      const node1 = Node.create.singly({ id: 'node1', data: { value: 1 } });

      node1.next = node2;
      expect(node1.next).toBe(node2);

      node1.next = undefined;
      expect(node1.next).toBeUndefined();
    });

    it('allows updating data property via setter', () => {
      const node = Node.create.singly({ id: 'node1', data: { value: 1 } });
      const newData = { value: 99 };

      node.data = newData;
      expect(node.data).toEqual(newData);
      expect(node.detail).toEqual({ id: 'node1', data: newData });
    });

    it('is immutable: cannot add or remove properties', () => {
      const node = Node.create.singly({ id: 'node1', data: { value: 1 } });

      expect(() => {
        (node as any).foo = 123;
      }).toThrow();
      expect(() => {
        delete (node as any).id;
      }).toThrow();
    });

    it('is immutable: cannot redefine accessors', () => {
      const node = Node.create.singly({ id: 'node1', data: { value: 1 } });

      expect(() =>
        Object.defineProperty(node, 'id', { value: 'other' })
      ).toThrow();
    });
  });
  describe('Doubly Node', () => {
    it('creates a doubly-linked node with correct properties', () => {
      const node2 = Node.create.doubly({ id: 'node2', data: { value: 2 } });

      const node1 = Node.create.doubly({
        id: 'node1',
        data: { value: 1 },
        pointers: { next: node2, prev: undefined }
      });

      expect(node1.id).toBe('node1');
      expect(node1.data).toEqual({ value: 1 });
      expect(node1.next).toBe(node2);
      expect(node1.prev).toBeUndefined();
      expect(node1.detail).toEqual({ id: 'node1', data: { value: 1 } });
    });

    it('allows updating next and prev via setters', () => {
      const node1 = Node.create.doubly({ id: 'node1', data: { value: 1 } });
      const node2 = Node.create.doubly({ id: 'node2', data: { value: 2 } });

      node1.next = node2;
      expect(node1.next).toBe(node2);

      node2.prev = node1;
      expect(node2.prev).toBe(node1);

      node1.next = undefined;
      expect(node1.next).toBeUndefined();

      node2.prev = undefined;
      expect(node2.prev).toBeUndefined();
    });

    it('allows updating data property via setter', () => {
      const node = Node.create.doubly({ id: 'node1', data: { value: 1 } });
      const newData = { value: 99 };

      node.data = newData;
      expect(node.data).toEqual(newData);
      expect(node.detail).toEqual({ id: 'node1', data: newData });
    });

    it('is immutable: cannot add or remove properties', () => {
      const node = Node.create.doubly({ id: 'node1', data: { value: 1 } });

      expect(() => {
        (node as any).foo = 123;
      }).toThrow();
      expect(() => {
        delete (node as any).id;
      }).toThrow();
    });

    it('is immutable: cannot redefine accessors', () => {
      const node = Node.create.doubly({ id: 'node1', data: { value: 1 } });

      expect(() =>
        Object.defineProperty(node, 'id', { value: 'other' })
      ).toThrow();
    });
  });
  describe('Type Discrimination', () => {
    it('correctly narrows types based on type property', () => {
      const linkedNode = Node.create.singly({
        id: 'linked1',
        data: { value: 1 }
      });

      const doublyNode = Node.create.doubly({
        id: 'double1',
        data: { value: 2 }
      });
      expect(linkedNode.next).toBeUndefined();
      expect(doublyNode.prev).toBeUndefined();
    });
  });
});
