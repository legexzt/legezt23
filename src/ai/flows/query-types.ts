export type QueryInput = {
    query: string;
};

export type QueryResult = {
    title?: string;
    summary?: string;
    bulletPoints?: string[];
    table?: Record<string, any>[];
    links?: { title: string; url: string }[];
    favicon?: string;
    sourceURL?: string;
};
