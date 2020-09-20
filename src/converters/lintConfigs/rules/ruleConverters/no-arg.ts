import { RuleConverter } from "../ruleConverter";

export const convertNoArg: RuleConverter = () => {
    return {
        notices: ["`arguments.callee` will now also be banned."],
        rules: [
            {
                ruleName: "no-caller",
            },
        ],
    };
};
