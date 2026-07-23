import { expect } from "vitest";
import { axe } from "vitest-axe";

/**
 * Run axe against a container and assert zero violations.
 * Use on every component test suite.
 */
export async function expectNoA11yViolations(container: HTMLElement): Promise<void> {
  const results = await axe(container);
  expect(results.violations).toHaveLength(0);
}
