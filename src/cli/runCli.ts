import chalk from "chalk";
import { EOL } from "os";
import { Command } from "commander";

import { version } from "../../package.json";
import { Logger } from "../adapters/logger";
import { SansDependencies } from "../binding";
import { convertConfig } from "../conversion/convertConfig";
import { TSLintToESLintSettings, TSLintToESLintResult, ResultStatus } from "../types";

export type RunCliDependencies = {
    convertConfig: SansDependencies<typeof convertConfig>;
    logger: Logger;
};

export const runCli = async (
    dependencies: RunCliDependencies,
    rawArgv: string[],
): Promise<ResultStatus> => {
    const command = new Command()
        .usage("[options] <file ...> --language [language]")
        .option("--config [config]", "eslint configuration file to output to")
        .option("--eslint [eslint]", "eslint configuration file to convert using")
        .option("--package [package]", "package configuration file to convert using")
        .option("--tslint [tslint]", "tslint configuration file to convert using")
        .option("--typescript [typescript]", "typescript configuration file to convert using")
        .option("-V --version", "output the package version");

    const parsedArgv = {
        config: "./.eslintrc.js",
        ...(command.parse(rawArgv) as Partial<TSLintToESLintSettings>),
    };

    if ({}.hasOwnProperty.call(parsedArgv, "version")) {
        dependencies.logger.stdout.write(`${version}${EOL}`);
        return ResultStatus.Succeeded;
    }

    let result: TSLintToESLintResult;

    try {
        result = await dependencies.convertConfig(parsedArgv);
    } catch (error) {
        result = {
            errors: [error as Error],
            status: ResultStatus.Failed,
        };
    }

    switch (result.status) {
        case ResultStatus.Succeeded:
            dependencies.logger.stdout.write(chalk.greenBright("✅ All is well! ✅\n"));
            break;

        case ResultStatus.ConfigurationError:
            dependencies.logger.stderr.write(chalk.redBright("❌ "));
            dependencies.logger.stderr.write(chalk.red("Could not start tslint-to-eslint:"));
            dependencies.logger.stderr.write(chalk.redBright(` ❌${EOL}`));
            for (const complaint of result.complaints) {
                dependencies.logger.stderr.write(chalk.yellowBright(`${complaint}${EOL}`));
            }
            break;

        case ResultStatus.Failed:
            dependencies.logger.stderr.write(chalk.redBright("❌ "));
            dependencies.logger.stderr.write(chalk.yellow(`${result.errors.length} error`));
            dependencies.logger.stderr.write(chalk.yellow(result.errors.length === 1 ? "" : "s"));
            dependencies.logger.stderr.write(chalk.yellow(" running tslint-to-eslint:"));
            dependencies.logger.stderr.write(chalk.redBright(` ❌${EOL}`));
            for (const error of result.errors) {
                dependencies.logger.stderr.write(chalk.yellowBright(`${error.stack}${EOL}`));
            }
            break;
    }

    return result.status;
};
