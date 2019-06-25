export type TSLintConfiguration = {
    ruleDirectories: string[];
    rules: {
        [i: string]: any;
    };
};

export type ChildProcessExec = (command: string) => Promise<{ stderr: string; stdout: string }>;

export const findTslintConfiguration = async (
    config: string,
    childProcessExec: ChildProcessExec,
): Promise<TSLintConfiguration | Error> => {
    const command = buildCommand(config);
    const { stderr, stdout } = await childProcessExec(command);

    if (stderr) {
        return new Error(stderr);
    }

    try {
        return JSON.parse(stdout) as TSLintConfiguration;
    } catch (error) {
        return new Error(`Error parsing TSLint configuration: ${error}`);
    }
};

const buildCommand = (config: string) => {
    return ["tslint --print-config", config].filter(Boolean).join(" ");
};
