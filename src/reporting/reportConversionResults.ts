import chalk from "chalk";
import { EOL } from "os";

import { Logger } from "../adapters/logger";
import { SimplifiedResultsConfiguration } from "../creation/simplification/simplifyPackageRules";
import { ESLintRuleOptions, TSLintRuleOptions } from "../rules/types";
import {
    logFailedConversions,
    logMissingConversionTarget,
    logSuccessfulConversions,
} from "./reportOutputs";

export type ReportConversionResultsDependencies = {
    logger: Logger;
};

export const reportConversionResults = async (
    dependencies: ReportConversionResultsDependencies,
    outputPath: string,
    ruleConversionResults: SimplifiedResultsConfiguration,
) => {
    if (ruleConversionResults.converted.size !== 0) {
        logSuccessfulConversions("rule", ruleConversionResults.converted, dependencies.logger);
        logNotices(ruleConversionResults.converted, dependencies.logger);
    }

    if (ruleConversionResults.failed.length !== 0) {
        logFailedConversions(ruleConversionResults.failed, dependencies.logger);
    }

    if (ruleConversionResults.missing.length !== 0) {
        logMissingConversionTarget(
            "rule",
            (setting: TSLintRuleOptions) => setting.ruleName,
            ruleConversionResults.missing,
            dependencies.logger,
            [
                `The "@typescript-eslint/tslint/config" section of ${outputPath} configures eslint-plugin-tslint to run ${
                    ruleConversionResults.missing.length === 1 ? "it" : "them"
                } in TSLint within ESLint.`,
            ],
        );
    }

    if (!ruleConversionResults.extends?.join("").includes("eslint-config-prettier")) {
        logPrettierExtension(dependencies.logger);
    }
};

type RuleWithNotices = {
    notices: any[];
    ruleName: string;
};

const logNotices = (converted: Map<string, ESLintRuleOptions>, logger: Logger) => {
    const rulesWithNotices = Array.from(converted.values()).filter(
        (ruleOptions) => ruleOptions.notices && ruleOptions.notices.length >= 1,
    ) as RuleWithNotices[];

    if (rulesWithNotices.length === 0) {
        return;
    }

    const behavior =
        rulesWithNotices.length === 1
            ? " behaves differently from its TSLint counterpart"
            : "s behave differently from their TSLint counterparts";

    logger.stdout.write(chalk.blueBright(`${EOL}❗ ${rulesWithNotices.length}`));
    logger.stdout.write(chalk.blue(` ESLint rule${behavior} `));
    logger.stdout.write(chalk.blueBright(`❗${EOL}`));
    logger.stdout.write(chalk.blue(`  Check ${logger.debugFileName} for details.${EOL}`));
    logger.info.write(`${rulesWithNotices.length} ESLint rule${behavior}:${EOL}`);

    for (const rule of rulesWithNotices) {
        logger.info.write(`  * ${rule.ruleName}:${EOL}`);

        for (const notice of rule.notices) {
            logger.info.write(`    - ${notice}${EOL}`);
        }
    }

    logger.info.write(EOL);
};

const logPrettierExtension = (logger: Logger) => {
    logger.stdout.write(chalk.redBright(`${EOL}☠ Prettier`));
    logger.stdout.write(chalk.red(` plugins are missing from your configuration. `));
    logger.stdout.write(chalk.redBright(`☠${EOL}`));
    logger.stdout.write(chalk.red(`  We highly recommend running `));
    logger.stdout.write(chalk.redBright(`tslint-to-eslint-config --prettier`));
    logger.stdout.write(chalk.red(` to disable formatting ESLint rules.${EOL}`));
    logger.stdout.write(
        chalk.red(
            `  See https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md#should-i-use-prettier.${EOL}`,
        ),
    );
};
