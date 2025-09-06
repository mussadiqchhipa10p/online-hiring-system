import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { classNames } from '../utils/classNames';
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen)
        return null;
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: onClose }), _jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", children: "\u200B" }), _jsxs("div", { className: classNames('inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full', sizeClasses[size]), children: [title && (_jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: title }) })), _jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pt-0", children: children })] })] }) }));
};
//# sourceMappingURL=Modal.js.map