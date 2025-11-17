'use client';
import { useState } from 'react';
import { Stethoscope, Download } from 'lucide-react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

export default function CompleteDiagnostic() {
  const [objectId, setObjectId] = useState('');
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostic = async () => {
    if (!objectId) {
      alert('Please enter proof object ID');
      return;
    }

    setIsLoading(true);
    let diagnosticReport = '=== TRUTHVAULT DIAGNOSTIC REPORT ===\n\n';
    diagnosticReport += `Timestamp: ${new Date().toISOString()}\n`;
    diagnosticReport += `Proof Object ID: ${objectId}\n\n`;

    try {
      const sui = new SuiClient({ url: getFullnodeUrl('testnet') });

      // Get object data
      diagnosticReport += '--- FETCHING OBJECT DATA ---\n';
      const object = await sui.getObject({
        id: objectId,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });

      if (!object.data) {
        diagnosticReport += '❌ Object not found!\n';
        setReport(diagnosticReport);
        setIsLoading(false);
        return;
      }

      diagnosticReport += '✅ Object found\n';
      diagnosticReport += `Object Type: ${object.data.type}\n`;
      diagnosticReport += `Owner: ${JSON.stringify(object.data.owner)}\n\n`;

      if (object.data.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;

        diagnosticReport += '--- PROOF FIELDS ---\n';
        diagnosticReport += `Owner Address: ${fields.owner}\n`;
        diagnosticReport += `Blob ID: ${fields.blob_id}\n`;
        diagnosticReport += `Result Blob ID: ${fields.result_blob_id}\n`;
        diagnosticReport += `Created At: ${fields.created_at}\n\n`;

        diagnosticReport += '--- APPROVED_VIEWERS ANALYSIS ---\n';
        diagnosticReport += `Raw Value: ${JSON.stringify(fields.approved_viewers, null, 2)}\n`;
        diagnosticReport += `Type: ${typeof fields.approved_viewers}\n`;
        diagnosticReport += `Is Array: ${Array.isArray(fields.approved_viewers)}\n`;

        if (fields.approved_viewers) {
          const av = fields.approved_viewers;
          
          if (typeof av === 'object') {
            diagnosticReport += `\nObject Keys: ${Object.keys(av).join(', ')}\n`;
            
            if (av.type) {
              diagnosticReport += `VecSet Type: ${av.type}\n`;
            }
            
            if (av.fields) {
              diagnosticReport += `\nFields Keys: ${Object.keys(av.fields).join(', ')}\n`;
              diagnosticReport += `Fields Data: ${JSON.stringify(av.fields, null, 2)}\n`;
              
              if (av.fields.contents) {
                diagnosticReport += `\nContents (fields.contents): ${JSON.stringify(av.fields.contents)}\n`;
                diagnosticReport += `Contents Length: ${av.fields.contents?.length || 0}\n`;
              }
              
              // Check all fields for arrays
              for (const [key, value] of Object.entries(av.fields)) {
                if (Array.isArray(value)) {
                  diagnosticReport += `\n✅ FOUND ARRAY in fields.${key}: ${JSON.stringify(value)}\n`;
                }
              }
            }
            
            if (av.contents) {
              diagnosticReport += `\nContents (direct): ${JSON.stringify(av.contents)}\n`;
              diagnosticReport += `Contents Length: ${av.contents?.length || 0}\n`;
            }
          } else if (Array.isArray(av)) {
            diagnosticReport += `\n✅ Direct Array: ${JSON.stringify(av)}\n`;
            diagnosticReport += `Length: ${av.length}\n`;
          }
        } else {
          diagnosticReport += '\n⚠️ approved_viewers is null/undefined\n';
        }

        diagnosticReport += '\n--- FULL OBJECT JSON ---\n';
        diagnosticReport += JSON.stringify(object.data, null, 2);
      }

    } catch (err: any) {
      diagnosticReport += `\n❌ ERROR: ${err.message}\n`;
      diagnosticReport += `Stack: ${err.stack}\n`;
    }

    setReport(diagnosticReport);
    setIsLoading(false);
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truthvault-diagnostic-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">Complete Diagnostic</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Run a complete diagnostic on a Proof object to see EXACTLY how approved_viewers is structured on-chain.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Proof Object ID"
          value={objectId}
          onChange={(e) => setObjectId(e.target.value.trim())}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
        />

        <button
          onClick={runDiagnostic}
          disabled={isLoading || !objectId}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isLoading ? 'Running Diagnostic...' : 'Run Complete Diagnostic'}
        </button>
      </div>

      {report && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Diagnostic Report</h4>
            <button
              onClick={downloadReport}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
          
          <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded border overflow-auto max-h-96 font-mono">
            {report}
          </pre>
        </div>
      )}
    </div>
  );
}
