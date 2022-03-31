import { test, expect, describe, vi } from "vitest";
import { waitFor } from "./wait-for";

const SucceedResult = Symbol("succeed");
const RejectedError = new Error('Assertion fails')

function createAssertionFunction({
  succeedsAfterTries,
}: {
  succeedsAfterTries: number;
}) {
  let currentTry = 0;

  return vi.fn(() => {
    currentTry++;

    if (currentTry < succeedsAfterTries) {
      throw RejectedError;
    }

    return SucceedResult;
  });
}

describe("Wait for", () => {
  test("Waits for an assertion to succeed before timeout is reached", async () => {
    const assertion = createAssertionFunction({
      succeedsAfterTries: 3,
    });

    const promise = waitFor(assertion, {
      timeout: 1_000,
      delayBetweenAssertions: 10,
    });

    await expect(promise).resolves.toBe(SucceedResult);
  });

  test("Rejects when assertion does not succeed before timeout is reached", async () => {
    const assertion = createAssertionFunction({
      succeedsAfterTries: Infinity,
    });

    const promise = waitFor(assertion, {
      timeout: 1_000,
      delayBetweenAssertions: 10,
    });

    await expect(promise).rejects.toMatchObject({
      cause: RejectedError,
    })
  });
});
