// ADT declaration for a collection of activities
export type Activities = {
    [key: number]: {
        description: string;
        xpValue: number;
    };
};

// Type declaration for an individual activity
export type Activity = {
    description: string;
    xpValue: number;
};