import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";

export class SnippetServiceOperations implements SnippetOperations {
    createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        throw new Error("Method not implemented. Please implement createSnippet.");
    }

    deleteSnippet(id: string): Promise<string> {
        throw new Error("Method not implemented. Please implement deleteSnippet.");
    }

    formatSnippet(snippet: string): Promise<string> {
        throw new Error("Method not implemented. Please implement formatSnippet.");
    }

    getFileTypes(): Promise<FileType[]> {
        throw new Error("Method not implemented. Please implement getFileTypes.");
    }

    getFormatRules(): Promise<Rule[]> {
        throw new Error("Method not implemented. Please implement getFormatRules.");
    }

    getLintingRules(): Promise<Rule[]> {
        throw new Error("Method not implemented. Please implement getLintingRules.");
    }

    getSnippetById(id: string): Promise<Snippet | undefined> {
        throw new Error("Method not implemented. Please implement getSnippetById.");
    }

    getTestCases(snippetId: string): Promise<TestCase[]> {
        throw new Error("Method not implemented. Please implement getTestCases.");
    }

    getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        throw new Error("Method not implemented. Please implement getUserFriends.");
    }

    listSnippetDescriptors(page: number, pageSize: number, sippetName?: string): Promise<PaginatedSnippets> {
        throw new Error("Method not implemented. Please implement listSnippetDescriptors.");
    }

    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error("Method not implemented. Please implement modifyFormatRule.");
    }

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error("Method not implemented. Please implement modifyLintingRule.");
    }

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        throw new Error("Method not implemented. Please implement postTestCase.");
    }

    removeTestCase(id: string): Promise<string> {
        throw new Error("Method not implemented. Please implement removeTestCase.");
    }

    shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        throw new Error("Method not implemented. Please implement shareSnippet.");
    }

    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        throw new Error("Method not implemented. Please implement testSnippet.");
    }

    updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        throw new Error("Method not implemented. Please implement updateSnippetById.");
    }
}