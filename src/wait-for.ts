import { assign, createMachine, interpret, StateFrom } from "xstate";

interface WaitForOptions {
  /**
   * @default 1_000
   */
  timeout?: number;
  /**
   * @default 10
   */
  delayBetweenAssertions?: number;
}

export function waitFor<ExpectResult>(
  expect: () => ExpectResult | Promise<ExpectResult>,
  options?: WaitForOptions
) {
  const { timeout = 1_000, delayBetweenAssertions = 10 } = options ?? {};

  return new Promise<ExpectResult>((resolve, reject) => {
    const machine = createWaitForMachine<ExpectResult>().withConfig({
      delays: {
        Timeout: timeout,
        "Delay between two assertions": delayBetweenAssertions,
      },
      services: {
        "Run assertion": async () => {
          return await expect();
        },
      },
    });
    let state: StateFrom<typeof machine> = machine.initialState;

    interpret(machine)
      .onTransition((updatedState) => {
        state = updatedState;
      })
      .onDone(() => {
        if (state.matches("Timed out") === true) {
          reject(
            new Error("Assertion timed out", {
              cause: state.context.thrownError,
            })
          );

          return;
        }

        resolve(state.context.expectResult as ExpectResult);
      })
      .start();
  });
}

function createWaitForMachine<ExpectResult>() {
  const machine =
    /** @xstate-layout N4IgpgJg5mDOIC5QHUCGBLALgAgGYHsAnAOgEFZYxDN0A7KYgJQFdba6ptUKqb9aAxBH5hidAG74A1qLRY8RMj2ocmrdvS7K+tBBPwBjVDoDaABgC6iUAAd8sLOn7WQAD0QBGAJwA2YgFYAdjNAgGYPACYPYIAWHw8AGhAAT0RQrxjiMwAOL1Cg-38vQIjsgF8ypLkcAhJyShV6NTYOLQadASpCRRsAG2NagFtiaoU67VUWFs1udqddfSNTSxc7Bx0XdwQPGNDiH3DQ3ZiQj3y4pNSEH0DA4myYh7MPM3zinxiKqowaxXreVQAETAACN8KwDBwBK5YJhjKJULhMFQABTA-rJbAgsCYADuYDAtGwePwbQB-FgAEoBKNako5k1gWCIRxVvZHM4kG5EFE-BEgoEgmcvB4bmYYpdEP44vcotkSj4fNkIoqviBaX8JvQhCJiLD4SMfmN6QD6Gz1vNNogwn5BYEXvzBR8Il5JQh-C99mYcl5vYF4l4vP4fGqNYRofrkcREcjCCiACroQZgcGYalh80c2hWhD2-wBXIRfLS5WvUJuiIlYihb3+UI+EXB+0PCqVEC0fAQOAuMMmxoMKYaTizcnZrlrLM5gC0iuItzi2TMpUCMSiZh8bpiQeIMQ8HmydfrtwOQVDRrp-37xCZ4NokLN4-ZGy5WxiwSyu5K-gP8Vu4rdAbEBkW45EUvirh4Z7yBeWoMAAyswBgGASECZs+oCvtkHhzquJw+M8RzPIkKSICcdz+K82ShNkSoeP4LoZFBvzjAyUBoZaL6IFOvpziuSpLvKEHrm6oRRFkXgPBRQY3L6rxMcal46NgsCIchkCQOxnIYYgIrYTkETegJgQHmY-huhRmRUQcSrhIKoqfG2vaJsmEDYKmmljtpCBBns+SGVuIpFqEgQVhJ1YxBFokGb4+4ho555EB5057pk878cuQkbiR2zytWZi+F4USFfyoqBK2ZRAA */
    createMachine(
      {
        context: { expectResult: undefined, thrownError: undefined },
        tsTypes: {} as import("./wait-for.typegen").Typegen0,
        schema: {
          context: {} as {
            expectResult: ExpectResult | undefined;
            thrownError: Error | undefined;
          },
          services: {} as {
            "Run assertion": {
              data: ExpectResult;
            };
          },
        },
        after: {
          Timeout: {
            target: ".Timed out",
          },
        },
        initial: "Asserting",
        states: {
          Asserting: {
            initial: "Running assertion",
            states: {
              "Running assertion": {
                invoke: {
                  src: "Run assertion",
                  onDone: [
                    {
                      actions: "Assign assertion result to context",
                      target: "Succeed",
                    },
                  ],
                  onError: [
                    {
                      actions: "Assign thrown error to context",
                      target: "Debouncing",
                    },
                  ],
                },
              },
              Debouncing: {
                after: {
                  "Delay between two assertions": {
                    target: "Running assertion",
                  },
                },
              },
              Succeed: {
                type: "final",
              },
            },
            onDone: {
              target: "Assertion succeeded",
            },
          },
          "Assertion succeeded": {
            type: "final",
          },
          "Timed out": {
            type: "final",
          },
        },
        id: "Wait for",
      },
      {
        actions: {
          "Assign assertion result to context": assign({
            expectResult: (_ctx, event) => event.data,
          }),
          "Assign thrown error to context": assign({
            thrownError: (_ctx, event) => event.data as Error,
          }),
        },
      }
    );

  return machine;
}
