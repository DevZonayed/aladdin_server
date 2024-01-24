export declare function getDefaultMailConnectionConfig(): {
    transport: {
        host: string;
        port: string;
        ignoreTLS: string;
        secure: string;
        auth: {
            user: string;
            pass: string;
        };
    };
    defaults: {
        from: string;
    };
};
