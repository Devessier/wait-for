interface WaitForOptions {
    timeout?: number;
}

export async function waitFor<ExpectResult>(
    expect: () => ExpectResult | Promise<ExpectResult>,
    options?: WaitForOptions
) {}
