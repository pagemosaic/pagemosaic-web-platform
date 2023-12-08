export type ChatGPTAgent = 'user' | 'system' | 'assistant';

export interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

export interface OpenAIStreamPayload {
    model: string;
    messages: Array<ChatGPTMessage>;
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    max_tokens: number;
    stream: boolean;
    stop?: string[];
    user?: string;
    n: number;
}

export type FileObject = {
    id: string;
    url: string;
    size?: number;
    timestamp?: number;
};

export type AsyncStatus = {
    isUninitialized?: boolean;
    isLoading?: boolean;
    loadingProgress?: number;
    loadingTotal?: number;
    cancel?: () => void;
    isSuccess?: boolean;
    isError?: boolean;
    isAborted?: boolean;
    error?: string;
};
