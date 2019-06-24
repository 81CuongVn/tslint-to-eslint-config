import { convertNoUnnecessaryTypeAssertion } from "../no-unnecessary-type-assertion";

describe(convertNoUnnecessaryTypeAssertion, () => {
    test("conversion without arguments", () => {
        const result = convertNoUnnecessaryTypeAssertion({
            ruleArguments: [],
        });

        expect(result).toEqual({
            rules: [
                {
                    ruleName: "@typescript-eslint/no-unnecessary-type-assertion",
                },
            ],
        });
    });
});
