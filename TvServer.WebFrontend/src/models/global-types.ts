
export type BasicResult = {
    isSuccessful: boolean,
    error: string | undefined | null;
}

export type Result<TResult> = {
    isSuccessful : boolean;
    error ?: string;
    data ?: TResult;
}
