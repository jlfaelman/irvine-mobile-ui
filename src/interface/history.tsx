export interface HistoryData {
    id?: string | number;
    [key: string]: any;
}

export interface History {
    ref_user:number | string,
    data: HistoryData,
    status:string,
    created_at:string,
    finished_at:string | null,
    user_name?: string | null,
}
