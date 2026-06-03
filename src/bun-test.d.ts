// Minimal ambient types for Bun's built-in test runner (`bun test`). The project
// uses Bun as its package manager and runtime but does not install `@types/bun`,
// so this declares only the small surface used by our unit tests.
declare module "bun:test" {
  interface Matchers {
    toBe(expected: unknown): void;
    toBeGreaterThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toContain(expected: unknown): void;
  }
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export const it: typeof test;
  export function expect(value: unknown): Matchers;
}
