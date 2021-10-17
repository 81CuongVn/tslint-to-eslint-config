import { RuleConverter } from "../ruleConverter";

export const convertRxjsNoUnsafeSwitchmap: RuleConverter = ({ ruleArguments }) => {
    return {
        rules: [
            {
                ...(ruleArguments.length !== 0 && { ruleArguments }),
                ruleName: "rxjs/no-unsafe-switchmap",
            },
        ],
        plugins: ["eslint-plugin-rxjs"],
    };
};
