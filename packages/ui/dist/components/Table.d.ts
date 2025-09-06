import React from 'react';
export interface Column<T> {
    key: keyof T;
    title: string;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}
export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    loading?: boolean;
    emptyMessage?: string;
}
export declare function Table<T>({ data, columns, className, loading, emptyMessage }: TableProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Table.d.ts.map