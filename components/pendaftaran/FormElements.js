// components/pendaftaran/FormElements.js

export const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-100 pb-3 mb-6">
            {title}
        </h2>
        {children}
    </div>
);

export const Input = ({ label, name, errors = [], schoolCheckStatus = 'idle', ...props }) => {
    const isError = errors.includes(name);
    
    // Tentukan class dinamis berdasarkan status
    let statusClass = '';
    if (isError) {
        statusClass = 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500';
    } else if (schoolCheckStatus === 'valid') {
        statusClass = 'border-green-500 ring-1 ring-green-500 focus:ring-green-500 focus:border-green-500';
    } else if (schoolCheckStatus === 'invalid') {
        statusClass = 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500';
    } else {
        statusClass = 'border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400';
    }
    
    return (
        <div>
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <input 
                id={name}
                name={name}
                {...props}
                className={`p-3 border rounded-lg w-full bg-gray-50 transition-all duration-200 ${statusClass}`}
            />
        </div>
    );
};

export const Select = ({ label, name, errors = [], children, ...props }) => {
    const isError = errors.includes(name);
    return (
        <div>
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <select 
                id={name}
                name={name}
                {...props}
                className={`p-3 border rounded-lg w-full bg-gray-50 appearance-none bg-no-repeat bg-right pr-8 transition-colors duration-200
                            ${isError 
                                ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400'
                            }`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.7rem center', backgroundSize: '1.2em 1.2em' }}
            >
                {children}
            </select>
        </div>
    );
};