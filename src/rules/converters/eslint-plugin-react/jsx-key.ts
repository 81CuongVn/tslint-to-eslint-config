import { RuleConverter } from "../../converter";

export const convertJsxKey: RuleConverter = () => {
    return {
        rules: [
            {
                ruleName: "react/jsx-key",
            },
        ],
        plugins: ["eslint-plugin-react"],
    };
};
