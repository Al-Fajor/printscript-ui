import {CreateSnippet} from "./snippet.ts";


export class SnippetAdapter {
    createSnippet(createSnippet: CreateSnippet): FormData {
        console.log(createSnippet)
        const formData = new FormData();
        const fileBlob = new Blob([createSnippet.content], { type: 'text/plain' });

        formData.append('name', createSnippet.name);
        formData.append('description', "");
        formData.append('language', createSnippet.language);
        formData.append('version', "1.1");
        formData.append('file', fileBlob, createSnippet.name + "." + createSnippet.extension);
        return formData;

    }
}