import chalk from "chalk";
import { EOL } from "os";

import { Logger } from "../adapters/logger";
import { EditorSetting } from "../editorSettings/types";
import { ErrorSummary } from "../errors/errorSummary";
import { ESLintRuleOptions } from "../rules/types";
import { PackageManager, installationMessages } from "./packages/packageManagers";

export type EditorSettingEntry = Pick<EditorSetting, "editorSettingName">;

export const logSuccessfulConversions = (
    conversionTypeName: string,
    converted: Map<string, EditorSetting | ESLintRuleOptions>,
    logger: Logger,
) => {
    logger.stdout.write(chalk.greenBright(`✨ ${converted.size}`));
    logger.stdout.write(
        converted.size === 1
            ? chalk.green(` ${conversionTypeName} replaced with its ESLint equivalent.`)
            : chalk.green(` ${conversionTypeName}s replaced with their ESLint equivalents.`),
    );
    logger.stdout.write(chalk.greenBright(` ✨${EOL}`));
};

export const logFailedConversions = (failed: ErrorSummary[], logger: Logger) => {
    logger.stderr.write(`${chalk.redBright(`${EOL}❌ ${failed.length}`)}`);
    logger.stderr.write(chalk.red(` error${failed.length === 1 ? "" : "s"}`));
    logger.stderr.write(chalk.red(" thrown."));
    logger.stderr.write(chalk.redBright(` ❌${EOL}`));
    logger.info.write(failed.map((failed) => failed.getSummary()).join("\n\n") + "\n\n");
    logger.stderr.write(chalk.gray(`  Check ${logger.debugFileName} for details.${EOL}`));
};

export const logMissingConversionTarget = <T>(
    conversionTypeName: string,
    missingOutputMapping: (missing: T) => string,
    missing: T[],
    logger: Logger,
    additionalWarnings: string[] = [],
) => {
    logger.stdout.write(chalk.yellowBright(`️${EOL}❓ ${missing.length}`));
    logger.stdout.write(
        chalk.yellow(
            missing.length === 1
                ? ` ${conversionTypeName} does not yet have an ESLint equivalent`
                : ` ${conversionTypeName}s do not yet have ESLint equivalents`,
        ),
    );
    logger.stdout.write(chalk.yellowBright(` ❓${EOL}`));
    logger.stdout.write(chalk.yellow(`  See generated log file`));

    if (additionalWarnings.length > 0) {
        logger.stdout.write(chalk.yellow("; "));

        for (const warning of additionalWarnings) {
            logger.stdout.write(chalk.yellow(warning));
        }
    } else {
        logger.stdout.write(chalk.yellow("."));
    }

    logger.info.write(
        chalk.yellow(missing.map((conversion) => missingOutputMapping(conversion)).join("")),
    );
    logger.stdout.write(chalk.yellow(EOL));
};

export const logMissingPackages = (
    plugins: Set<string>,
    packageManager: PackageManager,
    logger: Logger,
) => {
    const packageNames = [
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "eslint",
        ...Array.from(plugins),
    ].sort();

    logger.stdout.write(chalk.cyanBright(`${EOL}⚡ ${packageNames.length}`));
    logger.stdout.write(chalk.cyan(" packages are required for running with ESLint."));
    logger.stdout.write(chalk.cyanBright(" ⚡"));
    logger.stdout.write(`${EOL}  `);
    logger.stdout.write(chalk.cyan(installationMessages[packageManager](packageNames.join(" "))));
    logger.stdout.write(EOL.repeat(2));
};
