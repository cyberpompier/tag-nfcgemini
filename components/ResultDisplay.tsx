
import React from 'react';
import { NFCMessage, NFCRecord } from '../types';

interface ResultDisplayProps {
  result: NFCMessage | null;
}

const RecordCard: React.FC<{ record: NFCRecord; index: number }> = ({ record, index }) => {
  const isUrl = record.recordType === 'url' || (record.recordType === 'text' && (record.data.startsWith('http://') || record.data.startsWith('https://')));

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-lg hover:shadow-brand-primary/20">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-brand-primary">Record {index + 1}</h4>
        <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded">
          {record.recordType}
        </span>
      </div>
      <div className="break-words whitespace-pre-wrap font-mono text-gray-300 bg-gray-900 p-3 rounded">
        {isUrl ? (
          <a href={record.data} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            {record.data}
          </a>
        ) : (
          record.data
        )}
      </div>
      {record.mediaType && <p className="text-sm mt-2 text-gray-500">Media Type: {record.mediaType}</p>}
      {record.encoding && <p className="text-sm mt-1 text-gray-500">Encoding: {record.encoding}</p>}
    </div>
  );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result || result.records.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-2xl font-bold text-center text-white mb-4">Tag Content</h3>
      {result.serialNumber && (
        <div className="mb-4 text-center text-gray-400">
            <span className="font-semibold">Serial Number:</span>
            <span className="font-mono ml-2 bg-gray-700 px-2 py-1 rounded-md">{result.serialNumber}</span>
        </div>
      )}
      <div className="space-y-4">
        {result.records.map((record, index) => (
          <RecordCard key={index} record={record} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay;
