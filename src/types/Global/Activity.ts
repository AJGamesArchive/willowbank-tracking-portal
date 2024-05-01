// ADT declaration for a collection of activities
export type Activities = {
    [key: number]: {
        description: string;
        xpValue: number;
    };
};

// Type declaration for an individual activity
export type Activity = {
    id: number;
    description: string;
    xpValue: number;
    dateAdded: string;
    difficulty: string;
};

// Type declaration for an individual completed activity
export type CompletedActivity = {
    dateCompleted: string;
    id: number;
    description: string;
    xpValue: number;
    dateAdded: string;
    difficulty: string;
};

// Type declaration for an individual completed activity
export type PendingActivity = {
    dateSubmitted: string;
    id: number;
    description: string;
    xpValue: number;
    dateAdded: string;
    difficulty: string;
};

// Type declaration for the original base activity data
export type BaseActivity = {
    description: string;
    xpValue: number;
};