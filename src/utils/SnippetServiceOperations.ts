import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers, User} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";
import {SnippetAdapter} from "./snippetAdapter.ts";
import axios from "axios";
import {ApiRule} from "./apiTypes.ts";

const BACKEND_URL = process.env.BACKEND_URL ?? "__BACKEND_URL__";

export class SnippetServiceOperations implements SnippetOperations {
    private token: Promise<string>

    constructor(stringPromise: Promise<string>) {
        this.token= stringPromise
        }


    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const url = `${BACKEND_URL}/snippet`;
        const adapter = new SnippetAdapter();
        const formData = adapter.createSnippet(createSnippet);

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
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
        const url = `${BACKEND_URL}/snippet/${id}`;
        try {
            await axios.delete(url,{
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                }
            })
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
                headers: { 'Authorization': `Bearer ${await this.token}` },
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
            console.error('Failed to format snippet:', error);
            return Promise.resolve(snippet);
        }
    }

    getFileTypes(): Promise<FileType[]> {
        // Extend this for all languages we're going to support
        const fileTypes: FileType[] = [
            { language : 'Python', extension: 'py' },
            { language: 'Printscript/1.0', extension: 'ps' },
            { language: 'Printscript/1.1', extension: 'ps' },
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
                headers: { 'Authorization': `Bearer ${await this.token}` },
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
            console.error('Failed to get rules:', error);
            return Promise.resolve([]);
        }
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        console.log('getSnippetById called with id:', id);
        const url = `${BACKEND_URL}/snippet/${id}`;

        const getExtension = async (language: string): Promise<string> => {
            const fileTypes = await this.getFileTypes()
            return Promise.resolve(fileTypes.find((f) => f.language.split("/")[0] === language)?.extension!)
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
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
            console.error('Failed to get snippet:', error);
            return Promise.resolve(undefined);
        }
    }

    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const response = await axios.get(`${BACKEND_URL}/snippet/${snippetId}/test/all`, {
            headers: {
                Authorization: `Bearer ${await this.token}`
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
        const response= await axios.get(`${BACKEND_URL}/user-data/users`, {
            params: {
                name,
                pageNumber: page,
                pageSize
            },
            headers: {
                Authorization: `Bearer ${await this.token}`
            }
        })

        const usersFromBackend: User[] = response.data.snippets.map((user: { userId: string, name: string }) => ({ // Prop name is incorrect
            id: user.userId,
            name: user.name
        }));

        const users: PaginatedUsers = {users: usersFromBackend, page: response.data.pageNumber, count: response.data.count, page_size: response.data.pageSize};
        return Promise.resolve(users);
    }

    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
        console.log('listSnippetDescriptors called with page:', page, 'pageSize:', pageSize, 'snippetName:', snippetName);
        const ownedSnippets= await axios.get(`${BACKEND_URL}/user/snippets`, {
            params: {
                isOwner: true,
                isShared: false,
                name: snippetName,
                pageNumber: page,
                pageSize
            },
            headers: {
                Authorization: `Bearer ${await this.token}`
            }
        })

        function transformToSnippet(snippetJson: { id: never; name: never; content: never; language: never; compliance: never; author: never; }): Snippet {
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

        const sharedSnippets= await axios.get(`${BACKEND_URL}/user/snippets`, {
            params: {
                isOwner: false,
                isShared: true,
                name: snippetName,
                pageNumber: page,
                pageSize
            },
            headers: {
                Authorization: `Bearer ${await this.token}`
            }
        })

        const snippetsArray: Snippet[] = ownedSnippets.data.snippets.map((resItem: { id: never; name: never; content: never; language: never; compliance: never; author: never; }) => transformToSnippet(resItem))
        const sharedSnippetSArray: Snippet[] = sharedSnippets.data.snippets.map((resItem: { id: never; name: never; content: never; language: never; compliance: never; author: never; }) => transformToSnippet(resItem))
        const allSnippets = snippetsArray.concat(sharedSnippetSArray)


        const snippets: PaginatedSnippets = {snippets: allSnippets , page: ownedSnippets.data.page, count: ownedSnippets.data.count, page_size: ownedSnippets.data.pageSize}
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
                { headers: { 'Authorization': `Bearer ${await this.token}` } }
            )

            if (!response) {
                throw new Error('Could not save rules');
            }

            return newRules
        } catch (error) {
            console.error('Failed to get rules:', error);
            return Promise.resolve([]);
        }
    }
    async postTestCase(testCase: Partial<TestCase>, snippetId: string): Promise<TestCase> {
        console.log('postTestCase called with testCase:', testCase);
        const emptyTestCase = Promise.resolve({} as TestCase)
         //This only saves the test, we need the update case
        const url = `${BACKEND_URL}/snippet/test/`;
        let response;
        try {
            if (!testCase.id) {
                response = await axios.post(url + snippetId, {
                    inputs: testCase.input,
                    expectedOutput: testCase.output,
                    name: testCase.name,
                }, {
                    headers: {
                        'Authorization': `Bearer ${await this.token}`
                    }
                })

                if (response.status === 500) return emptyTestCase
            }
            else {
                //This is the update case
                response = await axios.put(url + testCase.id, {
                    id: testCase.id,
                    inputs: testCase.input,
                    expectedOutput: testCase.output,
                    name: testCase.name
                }, {
                    headers: {
                        'Authorization': `Bearer ${await this.token}`
                    }
                })
            }
            const body: {id: string, name: string, inputs?: [], expectedOutput?: []} = response.data.body

            return Promise.resolve(
                {
                    id: body.id,
                    name: body.name,
                    input: body.inputs,
                    output: body.expectedOutput
                } as TestCase
            )

        } catch (err) {return emptyTestCase}
    }

    async removeTestCase(id: string): Promise<string> {
        console.log('removeTestCase called with id:', id);
        const url = `${BACKEND_URL}/snippet/test/${id}`;
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${await this.token}`
            }
        })
        // This endpoint MUST return a string in its body, independently if the test exists
        return Promise.resolve(response.data.body)

    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        console.log('shareSnippet called with snippetId:', snippetId, 'userId:', userId);
        const url = `${BACKEND_URL}/snippet/${snippetId}/share`;
        // Create permission, share to this user
        await axios.post(url,
            {userId: userId},{
            headers: {
                'Authorization': `Bearer ${await this.token}`
            }
        })

        return this.getSnippetById(snippetId) as Promise<Snippet>;
    }

    async testSnippet(testCase: Partial<TestCase>, snippetId: string): Promise<TestCaseResult> {
        console.log('testSnippet called with testCase:', testCase);
        try {
            const testUrl = testCase.id ? `snippet/test/${testCase.id!}` : `snippet/${snippetId}/test`
            const url = `${BACKEND_URL}/${testUrl}/get-results`;

            const testResult = testCase.id ? await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`
                }
            }) : await axios.post(url,
                {
                    name: testCase.name,
                    inputs:testCase.input,
                    expectedOutput: testCase.output
                },
                {
                headers: {
                    'Authorization': `Bearer ${await this.token}`
                }
            });

            if (!testResult || !testResult.data) {
                throw new Error('Empty response from server');
            }

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
        } catch (err) {
            console.error('Error testing snippet:', err);
            return Promise.resolve('fail' as TestCaseResult);
        }
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        console.log('updateSnippetById called with id:', id, 'updateSnippet:', updateSnippet);

        const url = `${BACKEND_URL}/snippet/${id}`;
        const snippet = await this.getSnippetById(id)
        if (!snippet) return Promise.resolve({} as Snippet)

        const formData = new FormData();
        formData.append('id', id);
        const file = new Blob([updateSnippet.content], { type: 'text/plain' });
        formData.append('file', file, 'snippet.txt');

        try {
            const response = await axios.put(url, formData, {
                headers: {
                    'Authorization': `Bearer ${await this.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update snippet:', error);
            return Promise.resolve({} as Snippet);
        }
    }
}
