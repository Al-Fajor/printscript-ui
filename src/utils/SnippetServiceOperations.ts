import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";
import {SnippetAdapter} from "./snippetAdapter.ts";
import axios from "axios";

export class SnippetServiceOperations implements SnippetOperations {

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const url = `${process.env.BACKEND_URL}/snippet`;
        const adapter = new SnippetAdapter();
        const formData = adapter.createSnippet(createSnippet);

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status !== 200) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.data;
        } catch (error) {
            console.error('Failed to create snippet:', error);
            throw error;
        }

    }

    deleteSnippet(id: string): Promise<string> {
        console.log('deleteSnippet called with id:', id);
        return Promise.resolve('deleteSnippet not implemented');
    }

    formatSnippet(snippet: string): Promise<string> {
        console.log('formatSnippet called with snippet:', snippet);
        return Promise.resolve('formatSnippet not implemented');
    }

    getFileTypes(): Promise<FileType[]> {
        const fileTypes: FileType[] = [
            { language : 'Python', extension: 'py' },
            {language: 'Printscript', extension: 'ps'},
        ]
        return Promise.resolve(fileTypes);
    }

    getFormatRules(): Promise<Rule[]> {
        console.log('getFormatRules called');
        return Promise.resolve([]);
    }

    getLintingRules(): Promise<Rule[]> {
        console.log('getLintingRules called');
        return Promise.resolve([]);
    }

    getSnippetById(id: string): Promise<Snippet | undefined> {
        console.log('getSnippetById called with id:', id);
        return Promise.resolve(undefined);
    }

    getTestCases(snippetId: string): Promise<TestCase[]> {
        console.log('getTestCases called with snippetId:', snippetId);
        return Promise.resolve([]);
    }

    getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        console.log('getUserFriends called with name:', name, 'page:', page, 'pageSize:', pageSize);
        return Promise.resolve({users: [], total: 0});
    }

    listSnippetDescriptors(page: number, pageSize: number, sippetName?: string): Promise<PaginatedSnippets> {
        console.log('listSnippetDescriptors called with page:', page, 'pageSize:', pageSize, 'sippetName:', sippetName);
        return Promise.resolve({snippets: [], total: 0});
    }

    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        console.log('modifyFormatRule called with newRules:', newRules);
        return Promise.resolve([]);
    }

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        console.log('modifyLintingRule called with newRules:', newRules);
        return Promise.resolve([]);
    }

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        console.log('postTestCase called with testCase:', testCase);
        return Promise.resolve({} as TestCase);
    }

    removeTestCase(id: string): Promise<string> {
        console.log('removeTestCase called with id:', id);
        return Promise.resolve('removeTestCase not implemented');
    }

    shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        console.log('shareSnippet called with snippetId:', snippetId, 'userId:', userId);
        return Promise.resolve({} as Snippet);
    }

    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        console.log('testSnippet called with testCase:', testCase);
        return Promise.resolve({} as TestCaseResult);
    }

    updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        console.log('updateSnippetById called with id:', id, 'updateSnippet:', updateSnippet);
        return Promise.resolve({} as Snippet);
    }

}