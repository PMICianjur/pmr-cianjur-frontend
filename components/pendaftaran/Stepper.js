// components/pendaftaran/Stepper.js
import { FiCheck } from 'react-icons/fi';

const steps = [
  "Data Sekolah",
  "Data Peserta",
  "Tenda & Kavling",
  "Konfirmasi" // Mengubah "Konfirmasi & Bayar" menjadi lebih singkat
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      <div className="flex items-start">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex-1 flex items-center group">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 relative z-10
                    ${isCompleted ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : ''}
                    ${isActive ? 'bg-white border-2 border-red-600 text-red-600 scale-110 shadow-lg' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <FiCheck size={24} /> : stepNumber}
                </div>
                <p className={`mt-2 text-xs md:text-sm font-semibold transition-all duration-300 w-20
                  ${isActive ? 'text-red-600' : 'text-gray-500'}
                `}>
                  {label}
                </p>
              </div>

              {/* Connector line */}
              {stepNumber < steps.length && (
                <div className={`flex-1 h-1 transition-colors duration-500 -mx-1
                  ${isCompleted ? 'bg-red-600' : 'bg-gray-200'}
                `}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;