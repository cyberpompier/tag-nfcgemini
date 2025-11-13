
import React, { useState, useEffect, useCallback } from 'react';
import { ScanStatus, NFCMessage } from './types';
import StatusDisplay from './components/StatusDisplay';
import ResultDisplay from './components/ResultDisplay';
import { NfcIcon } from './components/icons';

// Fix: Add Web NFC API type definitions to resolve TypeScript errors.
// These types are not included in the default TS DOM lib.
interface NDEFRecord {
  readonly recordType: string;
  readonly mediaType?: string;
  readonly id?: string;
  readonly data?: DataView;
  readonly encoding?: string;
  lang?: string;
}

interface NDEFMessage {
  records: readonly NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

interface NDEFReader {
  scan: () => Promise<void>;
  onreading: (this: NDEFReader, ev: NDEFReadingEvent) => any;
  onreadingerror: (this: NDEFReader, ev: Event) => any;
}

declare var NDEFReader: {
  prototype: NDEFReader;
  new (): NDEFReader;
};

declare global {
  interface Window {
    NDEFReader?: typeof NDEFReader;
  }
}

const App: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.Idle);
  const [scanResult, setScanResult] = useState<NFCMessage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsSupported(true);
    }
  }, []);

  const parseRecord = (record: NDEFRecord): { recordType: string; data: string; mediaType?: string; encoding?: string; } => {
    const decoder = new TextDecoder(record.encoding);
    // Fix: The data property on an NDEFRecord can be undefined, so we must check for its existence before decoding.
    const data = record.data ? decoder.decode(record.data) : '';
    return {
      recordType: record.recordType,
      mediaType: record.mediaType,
      data: data,
      encoding: record.encoding,
    };
  }
  
  const handleScan = useCallback(async () => {
    if (!isSupported) {
      setErrorMessage('Web NFC is not supported on this device.');
      setScanStatus(ScanStatus.Error);
      return;
    }

    try {
      const reader = new NDEFReader();
      setScanStatus(ScanStatus.Scanning);
      setScanResult(null);
      setErrorMessage('');

      await reader.scan();

      reader.onreading = (event) => {
        const message: NFCMessage = {
          records: event.message.records.map(parseRecord),
          serialNumber: event.serialNumber
        };
        setScanResult(message);
        setScanStatus(ScanStatus.Success);
      };

      reader.onreadingerror = (event) => {
        setErrorMessage('Cannot read data from the NFC tag. Please try again.');
        setScanStatus(ScanStatus.Error);
      };

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
                setErrorMessage('NFC permission was denied. Please allow NFC access in your browser settings.');
            } else if (error.name === 'AbortError') {
                 setErrorMessage('Scan was cancelled by the user.');
                 setScanStatus(ScanStatus.Idle);
                 return; // Avoid setting error status for user cancellation
            } else {
                setErrorMessage(`An unexpected error occurred: ${error.message}`);
            }
        } else {
             setErrorMessage('An unknown error occurred.');
        }
      setScanStatus(ScanStatus.Error);
    }
  }, [isSupported]);
  
  const buttonDisabled = scanStatus === ScanStatus.Scanning || !isSupported;
  
  return (
    <div className="min-h-screen bg-brand-dark text-brand-light flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Web NFC Tag Reader
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Tap to scan NFC tags directly in your browser.
        </p>
      </header>

      <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
        <StatusDisplay status={scanStatus} isSupported={isSupported} errorMessage={errorMessage} />

        <button
          onClick={handleScan}
          disabled={buttonDisabled}
          className={`
            flex items-center justify-center gap-3 px-8 py-4 text-xl font-bold rounded-full
            text-white transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-brand-primary/50
            ${buttonDisabled 
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-brand-primary hover:bg-blue-600 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/50'
            }
          `}
        >
          <NfcIcon className="w-7 h-7" />
          {scanStatus === ScanStatus.Scanning ? 'Scanning...' : 'Scan NFC Tag'}
        </button>

        {scanStatus === ScanStatus.Success && <ResultDisplay result={scanResult} />}
      </main>
      
      <footer className="text-center text-gray-500 mt-12">
        <p>A modern web application demonstrating the Web NFC API.</p>
      </footer>
    </div>
  );
};

export default App;