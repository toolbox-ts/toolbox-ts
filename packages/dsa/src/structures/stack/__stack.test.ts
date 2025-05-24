import { describe, it, expect } from 'vitest';

import { create } from './stack.js';

describe('Dynamic Stack', () => {
  it('initializes empty', () => {
    const stack = create<string>();

    expect(stack.size).toBe(0);
    expect(stack.head).toBeUndefined();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.pop()).toBeUndefined();
  });

  it('Adds and pops values (LIFO)', () => {
    const stack = create<string>();
    stack.push({ id: 'A', data: 'A' });
    stack.push({ id: 'B', data: 'B' });
    expect(stack.size).toBe(2);
    expect(stack.head).toEqual({ data: 'B', id: 'B' });
    expect(stack.isEmpty).toBe(false);

    const popped1 = stack.pop();
    expect(popped1).toEqual({ data: 'B', id: 'B' });
    expect(stack.size).toBe(1);
    expect(stack.head).toEqual({ data: 'A', id: 'A' });

    const popped2 = stack.pop();
    expect(popped2).toEqual({ data: 'A', id: 'A' });
    expect(stack.size).toBe(0);
    expect(stack.head).toBeUndefined();
    expect(stack.isEmpty).toBe(true);

    expect(stack.pop()).toBeUndefined();
  });

  it('handles custom DataNode.Detail', () => {
    const stack = create<{ x: number }>();
    stack.push({ data: { x: 1 }, id: 'one' });
    expect(stack.head).toEqual({ data: { x: 1 }, id: 'one' });
    expect(stack.pop()).toEqual({ data: { x: 1 }, id: 'one' });
  });
  it('to.string method', () => {
    const stack = create<string>();
    stack.push({ id: 'A', data: 'A' });
    stack.push({ id: 'B', data: 'B' });
    expect(stack.toString()).toBe('[{ id: B, data: B }, { id: A, data: A }]');
    stack.pop();
    expect(stack.toString()).toBe('[{ id: A, data: A }]');
    stack.pop();
    expect(stack.toString()).toBe('[]');
  });
  it('to.array method', () => {
    const stack = create<string>();
    stack.push({ id: 'A', data: 'A' });
    stack.push({ id: 'B', data: 'B' });
    expect(stack.toArray()).toEqual([
      { id: 'B', data: 'B' },
      { id: 'A', data: 'A' }
    ]);
    stack.pop();
    expect(stack.toArray()).toEqual([{ id: 'A', data: 'A' }]);
    stack.pop();
    expect(stack.toArray()).toEqual([]);
  });
  it('resets stack', () => {
    const stack = create<string>();
    stack.push({ id: 'A', data: 'A' });
    stack.push({ id: 'B', data: 'B' });
    expect(stack.size).toBe(2);
    stack.reset();
    expect(stack.size).toBe(0);
    expect(stack.head).toBeUndefined();
  });
});

describe('Fixed Stack', () => {
  it('initializes with max size', () => {
    const stack = create<number>(2);
    expect(stack.maxSize).toBe(2);
    expect(stack.size).toBe(0);
    expect(stack.isFull).toBe(false);
    expect(stack.isEmpty).toBe(true);
  });

  it('addes up to max size and throws on overflow', () => {
    const stack = create<number>(2);
    stack.push({ id: '1', data: 1 });
    stack.push({ id: '2', data: 2 });
    expect(stack.size).toBe(2);
    expect(stack.isFull).toBe(true);
    expect(() => {
      stack.push({ id: '3', data: 3 });
    }).toThrow(/Stack Overflow/);
  });

  it('pops and allows reuse after pop', () => {
    const stack = create<number>(2);
    stack.push({ id: '1', data: 1 });
    stack.push({ id: '2', data: 2 });
    expect(stack.isFull).toBe(true);
    expect(stack.pop()).toEqual({ data: 2, id: '2' });
    expect(stack.isFull).toBe(false);
    stack.push({ id: '3', data: 3 });
    expect(stack.isFull).toBe(true);
    expect(stack.head).toEqual({ data: 3, id: '3' });
  });
  it('gets remaining space', () => {
    const stack = create<number>(3);
    expect(stack.capacity).toBe(3);
    stack.push({ id: '1', data: 1 });
    expect(stack.capacity).toBe(2);
    stack.push({ id: '2', data: 2 });
    expect(stack.capacity).toBe(1);
    stack.push({ id: '3', data: 3 });
    expect(stack.capacity).toBe(0);
  });
});

describe('create factory', () => {
  it('returns correct instance for each type', () => {
    const dyn = create<string>();
    const fix = create<string>(1);
    expect(dyn.isEmpty).toBe(true);
    expect(fix.maxSize).toBe(1);
  });
});
