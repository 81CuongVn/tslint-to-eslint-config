import { describe, expect, test } from "@jest/globals";

import { convertObjectLiteralKeyQuotes } from "../object-literal-key-quotes";

describe("convertObjectLiteralKeyQuotes", () => {
    test("conversion without arguments", () => {
        const result = convertObjectLiteralKeyQuotes({
            ruleArguments: [],
        });

        expect(result).toEqual({
            rules: [
                {
                    ruleName: "quote-props",
                },
            ],
        });
    });

    test("conversion with an argument", () => {
        const result = convertObjectLiteralKeyQuotes({
            ruleArguments: ["always"],
        });

        expect(result).toEqual({
            rules: [
                {
                    ruleArguments: ["always"],
                    ruleName: "quote-props",
                },
            ],
        });
    });
});
