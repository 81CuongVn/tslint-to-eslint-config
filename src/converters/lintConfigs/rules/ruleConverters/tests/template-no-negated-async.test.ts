import { describe, expect, test } from "@jest/globals";

import { convertTemplateNoNegatedAsync } from "../template-no-negated-async";

describe("convertTemplateNoNegatedAsync", () => {
    test("conversion without arguments", () => {
        const result = convertTemplateNoNegatedAsync({
            ruleArguments: [],
        });

        expect(result).toEqual({
            rules: [
                {
                    ruleName: "@angular-eslint/template/eqeqeq",
                },
                {
                    ruleName: "@angular-eslint/template/no-negated-async",
                },
            ],
            plugins: ["@angular-eslint/eslint-plugin-template"],
        });
    });
});
