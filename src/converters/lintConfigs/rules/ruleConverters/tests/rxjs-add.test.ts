import { describe, expect, test } from "@jest/globals";

import { convertRxjsAdd } from "../rxjs-add";

describe("convertRxjsAdd", () => {
    test("conversion without arguments", () => {
        const result = convertRxjsAdd({
            ruleArguments: [],
        });

        expect(result).toEqual({});
    });
});
