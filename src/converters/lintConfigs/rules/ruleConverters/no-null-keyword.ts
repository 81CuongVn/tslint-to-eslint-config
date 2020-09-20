import { RuleConverter } from "../ruleConverter";

export const convertNoNullKeyword: RuleConverter = () => {
    return {
        notices: ["Null types will no longer be handled."],
        rules: [
            {
                ruleName: "no-null/no-null",
            },
        ],
        plugins: ["eslint-plugin-no-null"],
    };
};
