declare const toggle: JQuery<HTMLInputElement>;
declare const courseSelect: JQuery<HTMLSelectElement>;
declare const id: JQuery<HTMLInputElement>;
declare const ul: JQuery<HTMLUListElement>;
declare const button: JQuery<HTMLButtonElement>;
declare const textBox: JQuery<HTMLTextAreaElement>;
declare const lightDark: JQuery<HTMLLabelElement>;
interface Logs {
    courseId: string;
    uvuId: string;
    date: string;
    text: string;
    id: string;
}
declare function changeTheme(): void;
declare function loadTheme(): void;
declare function setMode(input: HTMLInputElement): void;
declare function LoadCourse(): Promise<void>;
declare function displayUVUID(value: HTMLSelectElement): void;
declare function idInput(value: string): Promise<void>;
declare function hideLog(obj: HTMLUListElement): void;
declare function postLog(): void;
declare function submitButton(event: Event): Promise<void>;
//# sourceMappingURL=script.d.ts.map