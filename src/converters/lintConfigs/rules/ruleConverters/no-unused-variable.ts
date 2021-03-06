import { RuleConverter } from "../ruleConverter";

export const NO_UNUSED_VARIABLE_NOTICE =
    "Please read the following article as the rule behaviour may change on the short term: " +
    "https://github.com/typescript-eslint/typescript-eslint/issues/1856";

export const convertNoUnusedVariable: RuleConverter = () => {
    return {
        rules: [
            {
                ruleName: "no-unused-vars",
                ruleSeverity: "off",
            },
            {
                ruleName: "@typescript-eslint/no-unused-vars",
                notices: [NO_UNUSED_VARIABLE_NOTICE],
            },
        ],
    };
};
