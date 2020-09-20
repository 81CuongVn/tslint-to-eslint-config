import { RuleConverter } from "../../ruleConverter";

export const convertNoInputsMetadataProperty: RuleConverter = () => {
    return {
        rules: [
            {
                ruleName: "@angular-eslint/no-inputs-metadata-property",
            },
        ],
        plugins: ["@angular-eslint/eslint-plugin"],
    };
};
