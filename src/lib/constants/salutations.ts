export interface Salutation {
    code: string;
    displayName: string;
    gender?: 'male' | 'female' | 'other';
    order: number;
}

export const SALUTATIONS: Salutation[] = [
    { code: 'mr', displayName: 'Mr.', gender: 'male', order: 1 },
    { code: 'mrs', displayName: 'Mrs.', gender: 'female', order: 2 },
    { code: 'ms', displayName: 'Ms.', gender: 'female', order: 3 },
    { code: 'miss', displayName: 'Miss', gender: 'female', order: 4 },
    { code: 'dr', displayName: 'Dr.', order: 5 },
    { code: 'prof', displayName: 'Prof.', order: 6 },
    { code: 'rev', displayName: 'Rev.', order: 7 },
    { code: 'capt', displayName: 'Capt.', order: 8 }
];

export const getSalutationByCode = (code: string): Salutation | undefined => {
    return SALUTATIONS.find(s => s.code === code);
};

export const getSalutationsByGender = (gender: 'male' | 'female' | 'other'): Salutation[] => {
    return SALUTATIONS.filter(s => s.gender === gender || !s.gender)
        .sort((a, b) => a.order - b.order);
};  