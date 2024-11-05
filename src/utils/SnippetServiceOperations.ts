import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";
import {SnippetAdapter} from "./snippetAdapter.ts";
import axios from "axios";
import {ApiRule} from "./apiTypes.ts";
import {BACKEND_URL} from "./constants.ts";

export class SnippetServiceOperations implements SnippetOperations {

    token = localStorage.getItem("token")

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const url = `${process.env.BACKEND_URL}/snippet`;
        const adapter = new SnippetAdapter();
        const formData = adapter.createSnippet(createSnippet);

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });
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
                    'Authorization': `Bearer ${this.token}`,
                }
            })
            console.log('Snippet deleted successfully');
            return 'Snippet deleted successfully';
        } catch (error) {
            console.error('Failed to delete snippet:', error);
            throw error;
        }
    }

    async formatSnippet(snippet: string): Promise<string> {
        console.log('formatSnippet called with snippet:', snippet);

        const url = `${BACKEND_URL}/action/format`;

        try {
            const response = await axios.post(url, null, {
                headers: { 'Authorization': `Bearer ${this.token}` },
                params: {
                    file: snippet,
                    language: 'Printscript',
                    version: '1.1'
                }
            })

            if (!response?.data) {
                throw new Error('Could not format snippet');
            }
            return response.data
        } catch (error) {
            console.log('Failed to format snippet:', error);
            return Promise.resolve(snippet);
        }
    }

    getFileTypes(): Promise<FileType[]> {
        // Extend this for all languages we're going to support
        const fileTypes: FileType[] = [
            { language : 'Python', extension: 'py' },
            { language: 'Printscript', extension: 'ps' },
            { language: 'Go', extension: 'go' },
            { language: 'Java', extension: 'java' },
            { language: 'JavaScript', extension: 'js' },
            { language: 'TypeScript', extension: 'ts' },
        ]
        return Promise.resolve(fileTypes);
    }

    getFormatRules(): Promise<Rule[]> {
        console.log('getFormatRules called');
        return this.getRules('FORMAT')
    }

    getLintingRules(): Promise<Rule[]> {
        console.log('getLintingRules called');
        return this.getRules('LINT')
    }

    async getRules(action: 'LINT' | 'FORMAT'): Promise<Rule[]> {
        const url = `${BACKEND_URL}/action/rules`;

        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${this.token}` },
                params: { language: 'Printscript', action: action }
            })

            if (!response?.data) {
                throw new Error('Rules not found');
            }

            return response.data.map((rule: ApiRule) => ({
                id: rule.id,
                name: rule.name,
                isActive: rule.isActive,
                value: rule. value
            }))
        } catch (error) {
            console.log('Failed to get rules:', error);
            return Promise.resolve([]);
        }
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        console.log('getSnippetById called with id:', id);
        const url = `${process.env.BACKEND_URL}/snippet/${id}`;

        const getExtension = async (language: string): Promise<string> => {
            const fileTypes = await this.getFileTypes()
            return fileTypes.filter(fileType => fileType.language === language)[0].extension
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
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
                extension: await getExtension(response.data.language),
                compliance: response.data.compliance,
                author: response.data.author
            };
        } catch (error) {
            console.log('Failed to get snippet:', error);
            return Promise.resolve(undefined);
        }
    }

    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const response = await axios.get(`${process.env.BACKEND_URL}/snippet/${snippetId}/test/all`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        const testCases: TestCase[] = response.data.map((testCase: {
            id: never;
            name: never;
            inputs: never;
            expectedOutput: never;
        }) => {
            return {
                id: testCase.id,
                name: testCase.name,
                input: testCase.inputs,
                output: testCase.expectedOutput
            }
        })
        return Promise.resolve(testCases);
    }

    async getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        console.log('getUserFriends called with name:', name, 'page:', page, 'pageSize:', pageSize);
        // Only need to send userId and name
        const response= await axios.get(`${process.env.BACKEND_URL}/user-data/users`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        const usersFromBackend: never[] = response.data


        const users: PaginatedUsers = {users: usersFromBackend, page: 0, count: 0, page_size: 0};
        return Promise.resolve(users);
    }

    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
        console.log('listSnippetDescriptors called with page:', page, 'pageSize:', pageSize, 'snippetName:', snippetName);
        const response= await axios.get(`${process.env.BACKEND_URL}/user/snippets`, {
            params: {
                isOwner: true,
                isShared: false,
                name: snippetName,
                pageNumber: page,
                pageSize
            },
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        console.log(response)

        function transformToSnippet(snippetJson: { id: never; name: never; content: never; language: never; compliance: never; author: never; }): Snippet {
            // TODO
            return {
                id: snippetJson.id,
                name: snippetJson.name,
                content: snippetJson.content,
                language: snippetJson.language,
                extension: "PrintScript", // All of these attributes are hardcoded due to further development needed
                compliance: snippetJson.compliance,
                author: snippetJson.author
            } as Snippet
        }

        const snippetArray: Snippet[] = response.data.snippets.map((resItem: { id: never; name: never; content: never; language: never; compliance: never; author: never; }) => transformToSnippet(resItem))

        const snippets: PaginatedSnippets = {snippets: snippetArray , page: response.data.page, count: response.data.count, page_size: response.data.pageSize}
        return Promise.resolve(snippets);
    }

    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        console.log('modifyFormatRule called with newRules:', newRules);
        return this.modifyRule(newRules, 'FORMAT');
    }

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        console.log('modifyLintingRule called with newRules:', newRules);
        return this.modifyRule(newRules, 'LINT');
    }

    async modifyRule(newRules: Rule[], action: 'LINT' | 'FORMAT'): Promise<Rule[]> {
        const url = `${BACKEND_URL}/action/rules`;

        try {
            const response = await axios.put(
                url,
                newRules.map(rule => ({...rule, action})),
                { headers: { 'Authorization': `Bearer ${this.token}` } }
            )

            if (!response) {
                throw new Error('Could not save rules');
            }

            return newRules
        } catch (error) {
            console.log('Failed to get rules:', error);
            return Promise.resolve([]);
        }
    }
    async postTestCase(testCase: Partial<TestCase>, snippetId: string): Promise<TestCase> {
        console.log('postTestCase called with testCase:', testCase);
        const emptyTestCase = Promise.resolve({} as TestCase)

        const url = `${process.env.BACKEND_URL}/snippet/${snippetId}/test`;
        try {
            const response = await axios.post(url,{
                inputs: testCase.input,
                expectedOutput: testCase.output,
                version: "1.1",
                name: testCase.name
            },{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })

            if (response.status === 500) return emptyTestCase

            const body: {snippetId: string, name: string, inputs?: [], expectedOutput?: []} = response.data.body

            return Promise.resolve(
                {
                    id: body.snippetId,
                    name: body.name,
                    input: body.inputs,
                    output: body.expectedOutput
                } as TestCase
            )

        } catch (err) {return emptyTestCase}
    }

    async removeTestCase(id: string): Promise<string> {
        console.log('removeTestCase called with id:', id);
        const url = `${process.env.BACKEND_URL}/snippet/test/${id}`;
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })
        // This endpoint MUST return a string in its body, independently if the test exists
        return Promise.resolve(response.data.body)

    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        console.log('shareSnippet called with snippetId:', snippetId, 'userId:', userId);
        const url = `${process.env.BACKEND_URL}/snippet/${snippetId}/share`;
        // Create permission, share to this user
        await axios.post(url,
            {userId},{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })

        return this.getSnippetById(snippetId) as Promise<Snippet>;
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        console.log('testSnippet called with testCase:', testCase);
        const url = `${process.env.BACKEND_URL}/snippet/${testCase.id}/test`
        // @ts-expect-error
        const testResult = await axios.get(url, testCase, {
            headers:{
                'Authorization': `Bearer ${this.token}`
            }
        });
        let testCaseResult: TestCaseResult;

        switch (testResult.data) {
            case 'SUCCESS':
                testCaseResult = 'success';
                break;
            case 'FAILURE':
                testCaseResult = 'fail';
                break;
            default:
                testCaseResult = 'fail';
        }

        return Promise.resolve(testCaseResult);
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        console.log('updateSnippetById called with id:', id, 'updateSnippet:', updateSnippet);

        const url = `${process.env.BACKEND_URL}/snippet/${id}`;
        const snippet = await this.getSnippetById(id)
        if (!snippet) return Promise.resolve({} as Snippet)
        // TODO: fix backend endpoints
        try {
            const response = await axios.put(url, {
                    id,
                    language: snippet.language,
                    content: updateSnippet.content
            }, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create snippet:', error);
            return Promise.resolve({} as Snippet);
        }
    }
}
