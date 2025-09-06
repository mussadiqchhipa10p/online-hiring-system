import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { classNames } from '../utils/classNames';
export function Table({ data, columns, className, loading = false, emptyMessage = 'No data available' }) {
    if (loading) {
        return (_jsx("div", { className: classNames('overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg', className), children: _jsx("div", { className: "bg-white px-4 py-5 sm:p-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-4" }), _jsx("div", { className: "space-y-3", children: [...Array(5)].map((_, i) => (_jsx("div", { className: "h-4 bg-gray-200 rounded" }, i))) })] }) }) }));
    }
    if (data.length === 0) {
        return (_jsx("div", { className: classNames('text-center py-12', className), children: _jsx("p", { className: "text-gray-500", children: emptyMessage }) }));
    }
    return (_jsx("div", { className: classNames('overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg', className), children: _jsxs("table", { className: "min-w-full divide-y divide-gray-300", children: [_jsx("thead", { className: "bg-gray-50", children: _jsx("tr", { children: columns.map((column) => (_jsx("th", { className: classNames('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', column.className), children: column.title }, String(column.key)))) }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: data.map((item, index) => (_jsx("tr", { children: columns.map((column) => (_jsx("td", { className: classNames('px-6 py-4 whitespace-nowrap text-sm text-gray-900', column.className), children: column.render
                                ? column.render(item[column.key], item)
                                : String(item[column.key] || '') }, String(column.key)))) }, index))) })] }) }));
}
//# sourceMappingURL=Table.js.map