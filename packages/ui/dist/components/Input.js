import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { classNames } from '../utils/classNames';
export const Input = ({ label, error, helperText, className, id, ...props }) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsx("input", { id: inputId, className: classNames('block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm', error && 'border-red-300 focus:ring-red-500 focus:border-red-500', className), ...props }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: error })), helperText && !error && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText }))] }));
};
//# sourceMappingURL=Input.js.map