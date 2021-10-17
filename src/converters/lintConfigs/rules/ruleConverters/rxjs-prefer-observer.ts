import { RuleConverter } from "../ruleConverter";

export const convertRxjsPreferObserver: RuleConverter = ({ ruleArguments }) => {
    return {
        rules: [
            {
                ...(ruleArguments.length !== 0 && { ruleArguments }),
                ruleName: "rxjs/prefer-observer",
            },
        ],
        plugins: ["eslint-plugin-rxjs"],
    };
};
