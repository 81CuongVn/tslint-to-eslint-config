import { describe, expect, test } from "@jest/globals";

import { convertNewParens } from "../new-parens";

describe("convertNewParens", () => {
    test("conversion without arguments", () => {
        const result = convertNewParens({
            ruleArguments: [],
        });

        expect(result).toEqual({
            rules: [
                {
                    ruleName: "new-parens",
                },
            ],
        });
    });
});
