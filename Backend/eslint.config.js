"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = __importDefault(require("@eslint/js"));
const typescript_eslint_1 = __importDefault(require("typescript-eslint"));
const config = [
    js_1.default.configs.recommended,
    ...typescript_eslint_1.default.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: typescript_eslint_1.default.parser,
        },
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];
exports.default = config;
