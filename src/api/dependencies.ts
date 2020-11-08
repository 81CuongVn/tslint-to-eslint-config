import { childProcessExec } from "../adapters/childProcessExec";
import { fsFileSystem } from "../adapters/fsFileSystem";
import { globAsync } from "../adapters/globAsync";
import { nativeImporter } from "../adapters/nativeImporter";
import { processLogger } from "../adapters/processLogger";
import { bind } from "../binding";
import {
    collectCommentFileNames,
    CollectCommentFileNamesDependencies,
} from "../comments/collectCommentFileNames";
import {
    ReportCommentResultsDependencies,
    reportCommentResults,
} from "../converters/comments/reporting/reportCommentResults";
import {
    ConvertEditorConfigDependencies,
    convertEditorConfig,
} from "../converters/editorConfigs/convertEditorConfig";
import {
    ConvertLintConfigDependencies,
    convertLintConfig,
} from "../converters/lintConfigs/convertLintConfig";
import {
    ReportConversionResultsDependencies,
    reportConfigConversionResults,
} from "../converters/lintConfigs/reporting/reportConfigConversionResults";
import {
    ConvertCommentsDependencies,
    convertComments,
} from "../converters/comments/convertComments";
import {
    ConvertFileCommentsDependencies,
    convertFileComments,
} from "../converters/comments/convertFileComments";
import {
    ConvertRulesDependencies,
    convertRules,
} from "../converters/lintConfigs/rules/convertRules";
import { ruleConverters } from "../converters/lintConfigs/rules/ruleConverters";
import {
    RetrieveExtendsValuesDependencies,
    retrieveExtendsValues,
} from "../converters/lintConfigs/summarization/retrieveExtendsValues";
import {
    SummarizePackageRulesDependencies,
    summarizePackageRules,
} from "../converters/lintConfigs/summarization/summarizePackageRules";
import {
    ChoosePackageManagerDependencies,
    choosePackageManager,
} from "../converters/lintConfigs/reporting/packages/choosePackageManager";
import {
    LogMissingPackagesDependencies,
    logMissingPackages,
} from "../converters/lintConfigs/reporting/packages/logMissingPackages";
import { RunCliDependencies } from "../cli/runCli";
import { ruleMergers } from "../converters/lintConfigs/rules/ruleMergers";
import { removeExtendsDuplicatedRules } from "../converters/lintConfigs/pruning/removeExtendsDuplicatedRules";
import {
    ExtractGlobPathsDependencies,
    extractGlobPaths,
} from "../converters/comments/extractGlobPaths";
import { findESLintConfiguration } from "../input/findESLintConfiguration";
import {
    findOriginalConfigurations,
    FindOriginalConfigurationsDependencies,
} from "../input/findOriginalConfigurations";
import { findPackagesConfiguration } from "../input/findPackagesConfiguration";
import { findTSLintConfiguration } from "../input/findTSLintConfiguration";
import { findTypeScriptConfiguration } from "../input/findTypeScriptConfiguration";
import { importer, ImporterDependencies } from "../input/importer";
import { mergeLintConfigurations } from "../input/mergeLintConfigurations";
import {
    createESLintConfiguration,
    CreateESLintConfigurationDependencies,
} from "../converters/lintConfigs/createESLintConfiguration";
import { checkPrettierExtension } from "../converters/lintConfigs/summarization/prettier/checkPrettierExtension";
import {
    convertEditorConfigs,
    ConvertEditorConfigsDependencies,
} from "../converters/editorConfigs/convertEditorConfigs";
import { reportEditorConfigConversionResults } from "../converters/editorConfigs/reporting/reportEditorConfigConversionResults";
import { EditorConfigDescriptor } from "../converters/editorConfigs/types";
import { convertAtomConfig } from "../converters/editorConfigs/converters/convertAtomConfig";
import { convertVSCodeConfig } from "../converters/editorConfigs/converters/convertVSCodeConfig";
export const convertFileCommentsDependencies: ConvertFileCommentsDependencies = {
    converters: ruleConverters,
    fileSystem: fsFileSystem,
};

export const reportCommentResultsDependencies: ReportCommentResultsDependencies = {
    logger: processLogger,
};

export const convertRulesDependencies: ConvertRulesDependencies = {
    ruleConverters,
    ruleMergers,
};

export const nativeImporterDependencies: ImporterDependencies = {
    fileSystem: fsFileSystem,
    getCwd: () => process.cwd(),
    nativeImporter: nativeImporter,
};

export const boundImporter = bind(importer, nativeImporterDependencies);

export const findConfigurationDependencies = {
    exec: childProcessExec,
    importer: boundImporter,
};

export const findOriginalConfigurationsDependencies: FindOriginalConfigurationsDependencies = {
    findESLintConfiguration: bind(findESLintConfiguration, findConfigurationDependencies),
    findPackagesConfiguration: bind(findPackagesConfiguration, findConfigurationDependencies),
    findTypeScriptConfiguration: bind(findTypeScriptConfiguration, findConfigurationDependencies),
    findTSLintConfiguration: bind(findTSLintConfiguration, findConfigurationDependencies),
    mergeLintConfigurations,
};

export const collectCommentFileNamesDependencies: CollectCommentFileNamesDependencies = {
    findTypeScriptConfiguration: bind(findTypeScriptConfiguration, findConfigurationDependencies),
};

export const extractGlobPathsDependencies: ExtractGlobPathsDependencies = {
    globAsync,
};

export const convertCommentsDependencies: ConvertCommentsDependencies = {
    collectCommentFileNames: bind(collectCommentFileNames, collectCommentFileNamesDependencies),
    convertFileComments: bind(convertFileComments, convertFileCommentsDependencies),
    extractGlobPaths: bind(extractGlobPaths, extractGlobPathsDependencies),
    reportCommentResults: bind(reportCommentResults, reportCommentResultsDependencies),
};

export const retrieveExtendsValuesDependencies: RetrieveExtendsValuesDependencies = {
    importer: boundImporter,
};

export const summarizePackageRulesDependencies: SummarizePackageRulesDependencies = {
    checkPrettierExtension,
    removeExtendsDuplicatedRules,
    retrieveExtendsValues: bind(retrieveExtendsValues, retrieveExtendsValuesDependencies),
};

export const choosePackageManagerDependencies: ChoosePackageManagerDependencies = {
    fileSystem: fsFileSystem,
};

export const createESLintConfigurationDependencies: CreateESLintConfigurationDependencies = {
    convertRules: bind(convertRules, convertRulesDependencies),
    summarizePackageRules: bind(summarizePackageRules, summarizePackageRulesDependencies),
};

export const logMissingPackagesDependencies: LogMissingPackagesDependencies = {
    choosePackageManager: bind(choosePackageManager, choosePackageManagerDependencies),
    logger: processLogger,
};

export const reportConversionResultsDependencies: ReportConversionResultsDependencies = {
    logger: processLogger,
};

export const reportEditorSettingConversionResultsDependencies = {
    logger: processLogger,
};

export const writeConversionResultsDependencies = {
    fileSystem: fsFileSystem,
};

export const convertEditorConfigDependencies: ConvertEditorConfigDependencies = {
    fileSystem: fsFileSystem,
};

export const editorConfigDescriptors: EditorConfigDescriptor[] = [
    [".atom/config.cson", convertAtomConfig],
    [".vscode/settings.json", convertVSCodeConfig],
];

export const reportEditorConfigConversionResultsDependencies = {
    logger: processLogger,
};

export const convertEditorConfigsDependencies: ConvertEditorConfigsDependencies = {
    convertEditorConfig: bind(convertEditorConfig, convertEditorConfigDependencies),
    editorConfigDescriptors,
    reportEditorConfigConversionResults: bind(
        reportEditorConfigConversionResults,
        reportEditorConfigConversionResultsDependencies,
    ),
};

export const convertLintConfigDependencies: ConvertLintConfigDependencies = {
    createESLintConfiguration: bind(
        createESLintConfiguration,
        createESLintConfigurationDependencies,
    ),
    fileSystem: fsFileSystem,
    logMissingPackages: bind(logMissingPackages, logMissingPackagesDependencies),
    reportConfigConversionResults: bind(
        reportConfigConversionResults,
        reportConversionResultsDependencies,
    ),
};

export const runCliDependencies: RunCliDependencies = {
    converters: [
        bind(convertLintConfig, convertLintConfigDependencies),
        bind(convertEditorConfigs, convertEditorConfigsDependencies),
        bind(convertComments, convertCommentsDependencies),
    ],
    findOriginalConfigurations: bind(
        findOriginalConfigurations,
        findOriginalConfigurationsDependencies,
    ),
    logger: processLogger,
};
