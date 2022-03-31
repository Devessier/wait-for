// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    "Assign assertion result to context": "done.invoke.Wait for.Asserting.Running assertion:invocation[0]";
    "Assign thrown error to context": "error.platform.Wait for.Asserting.Running assertion:invocation[0]";
  };
  internalEvents: {
    "done.invoke.Wait for.Asserting.Running assertion:invocation[0]": {
      type: "done.invoke.Wait for.Asserting.Running assertion:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.Wait for.Asserting.Running assertion:invocation[0]": {
      type: "error.platform.Wait for.Asserting.Running assertion:invocation[0]";
      data: unknown;
    };
    "xstate.after(Delay between two assertions)#Wait for.Asserting.Debouncing": {
      type: "xstate.after(Delay between two assertions)#Wait for.Asserting.Debouncing";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "Run assertion": "done.invoke.Wait for.Asserting.Running assertion:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: "Run assertion";
    guards: never;
    delays: "Timeout" | "Delay between two assertions";
  };
  eventsCausingServices: {
    "Run assertion": "xstate.after(Delay between two assertions)#Wait for.Asserting.Debouncing";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {
    Timeout: "xstate.init";
    "Delay between two assertions": "xstate.init";
  };
  matchesStates:
    | "Asserting"
    | "Asserting.Running assertion"
    | "Asserting.Debouncing"
    | "Asserting.Succeed"
    | "Assertion succeeded"
    | "Timed out"
    | { Asserting?: "Running assertion" | "Debouncing" | "Succeed" };
  tags: never;
}
