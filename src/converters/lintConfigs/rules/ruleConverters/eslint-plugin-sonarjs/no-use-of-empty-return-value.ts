import { RuleConverter } from "../../ruleConverter";

export const convertNoUseOfEmptyReturnValue: RuleConverter = () => {
    return {
        rules: [
            {
                ruleName: "sonarjs/no-use-of-empty-return-value",
            },
        ],
        plugins: ["sonarjs"],
    };
};
