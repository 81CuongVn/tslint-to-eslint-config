import { ConfigurationError } from "../../errors/configurationError";
import { ESLintRuleOptions } from "../../rules/types";
import { createEmptyConversionResults } from "../../conversion/conversionResults.stubs";
import { simplifyPackageRules } from "./simplifyPackageRules";

const createStubDependencies = () => ({
    removeExtendsDuplicatedRules: jest.fn(),
    retrieveExtendsValues: async () => ({
        configurationErrors: [],
        importedExtensions: [],
    }),
});

const createStubESLintConfiguration = (fullExtends: string[]) => ({
    full: {
        env: {},
        extends: fullExtends,
        rules: {},
    },
});

const createStubTSLintConfiguration = () => ({
    full: {},
    raw: {},
});

describe("simplifyPackageRules", () => {
    it("returns the conversion results directly when there is no loaded ESLint configuration and no TSLint extensions", async () => {
        // Arrange
        const dependencies = createStubDependencies();
        const eslint = undefined;
        const tslint = createStubTSLintConfiguration();
        const ruleConversionResults = createEmptyConversionResults();

        // Act
        const simplifiedResults = await simplifyPackageRules(
            dependencies,
            eslint,
            tslint,
            ruleConversionResults,
        );

        // Assert
        expect(simplifiedResults).toBe(ruleConversionResults);
    });

    it("returns the conversion results directly when there is an empty ESLint configuration and no TSLint extensions", async () => {
        // Arrange
        const dependencies = createStubDependencies();
        const eslint = createStubESLintConfiguration([]);
        const tslint = createStubTSLintConfiguration();
        const ruleConversionResults = createEmptyConversionResults();

        // Act
        const simplifiedResults = await simplifyPackageRules(
            dependencies,
            eslint,
            tslint,
            ruleConversionResults,
        );

        // Assert
        expect(simplifiedResults).toBe(ruleConversionResults);
    });

    it("includes deduplicated rules and extension failures when the ESLint configuration extends", async () => {
        // Arrange
        const configurationErrors = [new ConfigurationError(new Error("oh no"), "darn")];
        const deduplicatedRules = new Map<string, ESLintRuleOptions>([
            [
                "rule-name",
                {
                    ruleArguments: [],
                    ruleName: "rule-name",
                    ruleSeverity: "warn",
                },
            ],
        ]);
        const dependencies = {
            removeExtendsDuplicatedRules: () => deduplicatedRules,
            retrieveExtendsValues: async () => ({
                configurationErrors,
                importedExtensions: [],
            }),
        };
        const eslintExtends = ["extension-name"];
        const eslint = createStubESLintConfiguration(eslintExtends);
        const tslint = createStubTSLintConfiguration();
        const ruleConversionResults = createEmptyConversionResults();

        // Act
        const simplifiedResults = await simplifyPackageRules(
            dependencies,
            eslint,
            tslint,
            ruleConversionResults,
        );

        // Assert
        expect(simplifiedResults).toEqual({
            converted: deduplicatedRules,
            extends: eslintExtends,
            failed: configurationErrors,
        });
    });
});
