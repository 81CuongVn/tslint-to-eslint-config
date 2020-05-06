import { RuleConverter } from "../../converter";

export const convertComponentMaxInlineDeclarations: RuleConverter = (tslintRule) => {
    return {
        rules: [
            {
                ...(tslintRule.ruleArguments.length !== 0 && {
                    ruleArguments: [...tslintRule.ruleArguments],
                }),
                ruleName: "@angular-eslint/component-max-inline-declarations",
            },
        ],
        plugins: ["@angular-eslint/eslint-plugin"],
    };
};
