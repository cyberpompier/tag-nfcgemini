
import React from 'react';
import { ScanStatus } from '../types';
import { LoadingSpinner, CheckCircleIcon, XCircleIcon, InfoIcon } from './icons';

interface StatusDisplayProps {
  status: ScanStatus;
  isSupported: boolean;
  errorMessage?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, isSupported, errorMessage }) => {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center text-center p-6 bg-yellow-900/50 border border-yellow-700 rounded-lg text-yellow-300">
        <XCircleIcon className="w-12 h-12 mb-3" />
        <h3 className="text-xl font-semibold">Web NFC Not Supported</h3>
        <p className="mt-1 text-yellow-400">
          Your browser does not support the Web NFC API. Please try using Chrome on Android.
        </p>
      </div>
    );
  }

  let icon, text, subtext, bgColor, borderColor, textColor;

  switch (status) {
    case ScanStatus.Scanning:
      icon = <LoadingSpinner className="w-12 h-12 mb-3" />;
      text = 'Scanning...';
      subtext = 'Hold your NFC tag near the back of your device.';
      bgColor = 'bg-blue-900/50';
      borderColor = 'border-blue-700';
      textColor = 'text-blue-300';
      break;
    case ScanStatus.Success:
      icon = <CheckCircleIcon className="w-12 h-12 mb-3 text-green-400" />;
      text = 'Scan Successful';
      subtext = 'Tag data displayed below.';
      bgColor = 'bg-green-900/50';
      borderColor = 'border-green-700';
      textColor = 'text-green-300';
      break;
    case ScanStatus.Error:
      icon = <XCircleIcon className="w-12 h-12 mb-3 text-red-400" />;
      text = 'Scan Failed';
      subtext = errorMessage || 'An unknown error occurred.';
      bgColor = 'bg-red-900/50';
      borderColor = 'border-red-700';
      textColor = 'text-red-300';
      break;
    case ScanStatus.Idle:
    default:
      icon = <InfoIcon className="w-12 h-12 mb-3" />;
      text = 'Ready to Scan';
      subtext = 'Click the button below to start scanning for an NFC tag.';
      bgColor = 'bg-gray-800/50';
      borderColor = 'border-gray-700';
      textColor = 'text-gray-300';
      break;
  }

  return (
    <div className={`flex flex-col items-center text-center p-6 ${bgColor} border ${borderColor} rounded-lg ${textColor} transition-all duration-300`}>
      {icon}
      <h3 className={`text-xl font-semibold ${textColor === 'text-gray-300' ? 'text-white' : textColor}`}>{text}</h3>
      <p className="mt-1">{subtext}</p>
    </div>
  );
};

export default StatusDisplay;
