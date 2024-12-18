export type projectType = {
        id: number;
        name: string;
        startDate: string | null;
        endDate: string | null;
        collapsed:boolean;
};
    
export type taskType = {
        id: number;
        projectId: number;
        name: string;
        startDate: string;
        endDate: string;
        inchargeUser: string;
        progress: number;
};
