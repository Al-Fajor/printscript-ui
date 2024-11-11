import {CreateSnippet} from "./snippet.ts";


export class SnippetAdapter {
    createSnippet(createSnippet: CreateSnippet): FormData {
        const formData = new FormData();
        const fileBlob = new Blob([createSnippet.content], { type: 'text/plain' });
        const splitLanguage: string[] = createSnippet.language.split("/")

        formData.append('name', createSnippet.name);
        formData.append('description', "");
        formData.append('language', splitLanguage[0]);
        formData.append('version', splitLanguage[1]);
        formData.append('file', fileBlob, createSnippet.name + "." + createSnippet.extension);
        return formData;

    }
}