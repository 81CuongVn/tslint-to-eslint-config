import isEqual from "lodash/isEqual";

import { ConversionError } from "../../../errors/conversionError";
import { ErrorSummary } from "../../../errors/errorSummary";
import { TSLintConfigurationRules } from "../../../input/findTSLintConfiguration";
import { Entries, uniqueFromSources } from "../../../utils";
import { convertRule } from "./convertRule";
import { convertTSLintRuleSeverity } from "./formats/convertTSLintRuleSeverity";
import { formatRawTslintRule } from "./formats/formatRawTslintRule";
import { RuleConverter } from "./ruleConverter";
import { RuleMerger } from "./ruleMerger";
import { ESLintRuleOptions, TSLintRuleOptions } from "./types";

export type ConvertRulesDependencies = {
    ruleConverters: Map<string, RuleConverter>;
    ruleMergers: Map<string, RuleMerger>;
};

export type RuleConversionResults = {
    converted: Map<string, ESLintRuleOptions>;
    failed: ErrorSummary[];
    missing: TSLintRuleOptions[];
    plugins: Set<string>;
    obsolete: Set<string>;
    ruleEquivalents: Map<string, string[]>;
};

/**
 * Converts raw TSLint rules to their ESLint equivalents.
 * @see `/docs/Architecture/Linters.md` for documentation.
 */
export const convertRules = (
    dependencies: ConvertRulesDependencies,
    rawTslintRules: TSLintConfigurationRules | undefined,
    ruleEquivalents: Map<string, string[]>,
): RuleConversionResults => {
    const converted = new Map<string, ESLintRuleOptions>();
    const failed: ConversionError[] = [];
    const missing: TSLintRuleOptions[] = [];
    const obsolete = new Set<string>();
    const plugins = new Set<string>();

    if (rawTslintRules !== undefined) {
        for (const [ruleName, value] of Object.entries(
            rawTslintRules,
        ) as Entries<TSLintConfigurationRules>) {
            // 1. The raw TSLint rule is converted to a standardized format.
            const tslintRule = formatRawTslintRule(ruleName, value);

            // 2. The appropriate converter is run for the rule.
            const conversion = convertRule(tslintRule, dependencies.ruleConverters);

            // 3. If the rule is missing or obsolete, or the conversion failed, this is marked.
            if (conversion === undefined) {
                if (tslintRule.ruleSeverity !== "off") {
                    missing.push(tslintRule);
                }

                continue;
            }

            if (conversion instanceof ConversionError) {
                failed.push(conversion);
                continue;
            }

            if (!conversion.rules) {
                obsolete.add(tslintRule.ruleName);
                continue;
            }

            const equivalents = new Set<string>();

            // 4. For each output rule equivalent given by the conversion:
            for (const changes of conversion.rules) {
                // 4a. The output rule name is added to the TSLint rule's equivalency set.
                equivalents.add(changes.ruleName);

                // 4b. The TSLint rule's config severity is mapped to its ESLint equivalent.
                const existingConversion = converted.get(changes.ruleName);
                const newConversion = {
                    ...changes,
                    ruleSeverity: convertTSLintRuleSeverity(tslintRule.ruleSeverity),
                };

                // 4c. If this is the first time the output ESLint rule is seen, it's directly marked as converted.
                if (existingConversion === undefined) {
                    converted.set(changes.ruleName, newConversion);
                    continue;
                }

                // 4d. Notices are merged and deduplicated.
                existingConversion.notices = uniqueFromSources(
                    existingConversion.notices,
                    newConversion.notices,
                );
                converted.set(changes.ruleName, existingConversion);

                // 4e. If the existing output has the same arguments as the new output, merge lookups are skipped.
                if (isEqual(existingConversion.ruleArguments, newConversion.ruleArguments)) {
                    continue;
                }

                // 4f. If not, a rule merger is run to combine it with its existing output settings.
                const merger = dependencies.ruleMergers.get(changes.ruleName);
                if (merger === undefined) {
                    failed.push(ConversionError.forMerger(changes.ruleName));
                } else {
                    converted.set(changes.ruleName, {
                        ...existingConversion,
                        ruleArguments: merger(
                            existingConversion.ruleArguments,
                            newConversion.ruleArguments,
                        ),
                    });
                }
            }

            if (conversion.plugins !== undefined) {
                for (const newPlugin of conversion.plugins) {
                    plugins.add(newPlugin);
                }
            }

            ruleEquivalents.set(tslintRule.ruleName, Array.from(equivalents));
        }
    }

    return { converted, failed, missing, obsolete, plugins, ruleEquivalents };
};
