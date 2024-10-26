import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";
import {SnippetAdapter} from "./snippetAdapter.ts";
import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

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

    async deleteSnippet(id: string): Promise<string> {
        console.log('deleteSnippet called with id:', id);
        const url = `${process.env.BACKEND_URL}/snippet/${id}`;
        try {
            await axios.delete(url,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
            console.log('Snippet deleted successfully');
            return 'Snippet deleted successfully';
        } catch (error) {
            console.error('Failed to delete snippet:', error);
            throw error;
        }
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

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        console.log('getSnippetById called with id:', id);
        const url = `${process.env.BACKEND_URL}/snippet/${id}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response?.data) {
                throw new Error('Snippet not found');
            }

            return {
                id: response.data.id,
                name: response.data.name,
                content: response.data.content,
                language: response.data.language,
                extension: response.data.extension,
                compliance: response.data.compliance,
                author: response.data.author
            };
        } catch (error) {
            console.log('Failed to get snippet:', error);
            return Promise.resolve(undefined);
        }
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
    async postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        console.log('postTestCase called with testCase:', testCase);
        const emptyTestCase = Promise.resolve({} as TestCase)

        const url = `${process.env.BACKEND_URL}/snippet/${testCase.id}/test`;
        try {
            const response = await axios.post(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 500) return emptyTestCase

            const body: {snippetId: string, name: string, input?: [], output?: []} = response.data.body

            return Promise.resolve(
                {
                    id: body.snippetId,
                    name: body.name,
                    input: body.input,
                    output: body.output
                } as TestCase
            )

        } catch (err) {return emptyTestCase}
    }

    async removeTestCase(id: string): Promise<string> {
        console.log('removeTestCase called with id:', id);
        const url = `${process.env.BACKEND_URL}/snippet/test/${id}`;
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        // This endpoint MUST return a string in its body, independently if the test exists
        return Promise.resolve(response.data.body)

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
