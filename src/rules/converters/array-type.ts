import { RuleConverter } from "../converter";

export const convertArrayType: RuleConverter = (tslintRule) => {
    return {
        rules: [
            {
                ...(tslintRule.ruleArguments.length > 0 && {
                    ruleArguments: [{ default: tslintRule.ruleArguments[0] }],
                }),
                ruleName: "@typescript-eslint/array-type",
            },
        ],
    };
};
