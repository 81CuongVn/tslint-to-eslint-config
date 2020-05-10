import { RuleConverter } from "../../converter";

export const convertUsePipeTransformInterface: RuleConverter = () => {
    return {
        rules: [
            {
                ruleName: "@angular-eslint/use-pipe-transform-interface",
            },
        ],
        plugins: ["@angular-eslint/eslint-plugin"],
    };
};
