import { SansDependencies } from "../../../binding";
import { ConfigurationError } from "../../../errors/configurationError";
import { ESLintConfiguration } from "../../../input/findESLintConfiguration";
import { importer } from "../../../input/importer";
import { resolveExtensionNames } from "./resolveExtensionNames";

export type RetrieveExtendsValuesDependencies = {
    importer: SansDependencies<typeof importer>;
};

export type RetrievedExtensionValues = {
    configurationErrors: ConfigurationError[];
    importedExtensions: Partial<ESLintConfiguration>[];
};

const builtInExtensions = new Map([
    ["eslint:all", "eslint/conf/eslint-all"],
    ["eslint:recommended", "eslint/conf/eslint-recommended"],
]);

const pluginExtensions = new Map([
    ["eslint-plugin-prettier", "node_modules/eslint-config-prettier/index.js"],
    [
        "plugin:@typescript-eslint/all",
        "node_modules/@typescript-eslint/eslint-plugin/dist/configs/all.json",
    ],
    [
        "plugin:@typescript-eslint/recommended",
        "node_modules/@typescript-eslint/eslint-plugin/dist/configs/recommended.json",
    ],
    [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "node_modules/@typescript-eslint/eslint-plugin/dist/configs/recommended-requiring-type-checking.json",
    ],
    ["plugin:react/recommended", "node_modules/eslint-plugin-react/index.js"],
]);

/**
 * Imports any extended ESLint rulesets as ESLint configurations.
 */
export const retrieveExtendsValues = async (
    dependencies: RetrieveExtendsValuesDependencies,
    rawExtensionNames: string | string[],
): Promise<RetrievedExtensionValues> => {
    const importedExtensions: Partial<ESLintConfiguration>[] = [];
    const configurationErrors: ConfigurationError[] = [];
    const extensionNames = resolveExtensionNames(rawExtensionNames);

    await Promise.all(
        extensionNames.map(async (extensionName) => {
            const builtInExtension = builtInExtensions.get(extensionName);
            if (builtInExtension !== undefined) {
                importedExtensions.push(
                    (await dependencies.importer(builtInExtension)) as ESLintConfiguration,
                );
                return;
            }

            const pluginExtension = pluginExtensions.get(extensionName);
            if (pluginExtension !== undefined) {
                const importedTypeScriptPlugin = (await dependencies.importer(
                    pluginExtension,
                )) as ESLintConfiguration;
                importedExtensions.push({
                    rules: importedTypeScriptPlugin.rules,
                });
                return;
            }

            const imported = await dependencies.importer(extensionName);

            if (imported instanceof Error) {
                configurationErrors.push(
                    new ConfigurationError(
                        imported,
                        `Could not resolve ESLint extension '${extensionName}'.`,
                    ),
                );
            } else {
                importedExtensions.push(imported as Partial<ESLintConfiguration>);
            }
        }),
    );

    return { configurationErrors, importedExtensions };
};
