import { jsx as _jsx } from "react/jsx-runtime";
import { classNames } from '../utils/classNames';
export const Card = ({ children, className, padding = 'md', shadow = 'md' }) => {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    const shadowClasses = {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    };
    return (_jsx("div", { className: classNames('bg-white rounded-lg border border-gray-200', paddingClasses[padding], shadowClasses[shadow], className), children: children }));
};
//# sourceMappingURL=Card.js.map