import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
// import {SnippetOperations} from "./snippetOperations.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {SnippetServiceOperations} from "./SnippetServiceOperations.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {SnippetOperations} from "./snippetOperations.ts";


const useSnippetOperations = () => {
    const {getAccessTokenSilently} = useAuth0()

    useEffect(() => {
        getAccessTokenSilently({
            authorizationParams: {
                redirect_uri: window.location.origin,
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                scope: "read:snippets write:snippets"
            }
        })
            .then(token => {
                localStorage.setItem("authAccessToken", token)
            })
            .catch(error => console.error(error));
    });

    const snippetOperations: SnippetOperations = new SnippetServiceOperations(getAccessTokenSilently());
    return snippetOperations
};

export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string) => {
    const snippetOperations = useSnippetOperations()
    return useQuery<PaginatedSnippets, Error>(['listSnippets', page, pageSize, snippetName], () => snippetOperations.listSnippetDescriptors(page, pageSize, snippetName));
};

export const useGetSnippetById = (id: string) => {
    const snippetOperations = useSnippetOperations()
    return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
        enabled: !!id, // This query will not execute until the id is provided
    });
};

export const useCreateSnippet = ({onSuccess}: {
    onSuccess: () => void
}): UseMutationResult<Snippet, Error, CreateSnippet> => {
    const snippetOperations = useSnippetOperations()
    return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet), {onSuccess});
};

export const useUpdateSnippetById = ({onSuccess}: { onSuccess: () => void }): UseMutationResult<Snippet, Error, {
    id: string;
    updateSnippet: UpdateSnippet
}> => {
    const snippetOperations = useSnippetOperations()
    return useMutation<Snippet, Error, { id: string; updateSnippet: UpdateSnippet }>(
        ({id, updateSnippet}) => snippetOperations.updateSnippetById(id, updateSnippet), {
            onSuccess,
        }
    );
};

export const useGetUsers = (name: string = "", page: number = 0, pageSize: number = 10) => {
    const snippetOperations = useSnippetOperations()
    return useQuery<PaginatedUsers, Error>(['users', name, page, pageSize], () => snippetOperations.getUserFriends(name, page, pageSize));
};

export const useShareSnippet = () => {
    const snippetOperations = useSnippetOperations()
    return useMutation<Snippet, Error, { snippetId: string; userId: string }>(
        ({snippetId, userId}) => snippetOperations.shareSnippet(snippetId, userId)
    );
};


export const useGetTestCases = (snippetId: string) => {
    const snippetOperations = useSnippetOperations()
    return useQuery<TestCase[] | undefined, Error>('testCases', () => snippetOperations.getTestCases(snippetId), {});
};


export const usePostTestCase = (snippetId: string) => {
    const snippetOperations = useSnippetOperations()
    return useMutation<TestCase, Error, Partial<TestCase>>(
        (tc) => snippetOperations.postTestCase(tc, snippetId)
    );
};


export const useRemoveTestCase = ({onSuccess}: { onSuccess: () => void }) => {
    const snippetOperations = useSnippetOperations()
    return useMutation<string, Error, string>(
        ['removeTestCase'],
        (id) => snippetOperations.removeTestCase(id),
        {
            onSuccess,
        }
    );
};

export type TestCaseResult = "success" | "fail"

export const useTestSnippet = () => {
    const snippetOperations = useSnippetOperations()
    return useMutation<TestCaseResult, Error, Partial<TestCase>>(
        (tc) => snippetOperations.testSnippet(tc)
    )
}


export const useGetFormatRules = () => {
    const snippetOperations = useSnippetOperations()
    return useQuery<Rule[], Error>('formatRules', () => snippetOperations.getFormatRules());
}

export const useModifyFormatRules = ({onSuccess}: { onSuccess: () => void }) => {
    const snippetOperations = useSnippetOperations()!
    return useMutation<Rule[], Error, Rule[]>(
        rule => snippetOperations.modifyFormatRule(rule),
        {onSuccess}
    );
}


export const useGetLintingRules = () => {
    const snippetOperations = useSnippetOperations()
    return useQuery<Rule[], Error>('lintingRules', () => snippetOperations.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: { onSuccess: () => void }) => {
    const snippetOperations = useSnippetOperations()
    return useMutation<Rule[], Error, Rule[]>(
        rule => snippetOperations.modifyLintingRule(rule),
        {onSuccess}
    );
}

export const useFormatSnippet = () => {
    const snippetOperations = useSnippetOperations()
    return useMutation<string, Error, string>(
        snippetContent => snippetOperations.formatSnippet(snippetContent)
    );
}

export const useDeleteSnippet = ({onSuccess}: { onSuccess: () => void }) => {
    const snippetOperations = useSnippetOperations()
    return useMutation<string, Error, string>(
        id => snippetOperations.deleteSnippet(id),
        {
            onSuccess,
        }
    );
}


export const useGetFileTypes = () => {
    const snippetOperations = useSnippetOperations()
    return useQuery<FileType[], Error>('fileTypes', () => snippetOperations.getFileTypes());
}