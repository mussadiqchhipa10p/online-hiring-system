import React from 'react';
export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: () => void;
}
export declare const Toast: React.FC<ToastProps>;
//# sourceMappingURL=Toast.d.ts.map