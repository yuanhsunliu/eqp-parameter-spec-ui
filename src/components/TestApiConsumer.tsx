import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:5001";

export function TestApiConsumer() {
  const [specs, setSpecs] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSpecs() {
      try {
        const resp = await fetch(`${API_BASE}/api/parameter-specs`);
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`HTTP ${resp.status}: ${text}`);
        }
        const data = await resp.json();
        if (!cancelled) setSpecs(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      }
    }
    fetchSpecs();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-4 max-w-2xl w-full bg-white rounded shadow">
      <h2 className="text-lg font-medium mb-2">測試：列出機台參數規格</h2>
      {error && <p className="text-red-600">錯誤：{error}</p>}
      {!error && specs === null && <p>載入中...</p>}
      {!error && specs && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left border-b py-1">Tool</th>
              <th className="text-left border-b py-1">Parameter</th>
              <th className="text-right border-b py-1">LSL</th>
              <th className="text-right border-b py-1">LCL</th>
              <th className="text-right border-b py-1">CL</th>
              <th className="text-right border-b py-1">UCL</th>
              <th className="text-right border-b py-1">USL</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((s) => (
              <tr key={`${s.tool_name}::${s.parameter_name}`} className="odd:bg-gray-50">
                <td className="py-1">{s.tool_name}</td>
                <td className="py-1">{s.parameter_name}</td>
                <td className="py-1 text-right">{s.lsl}</td>
                <td className="py-1 text-right">{s.lcl}</td>
                <td className="py-1 text-right">{s.cl}</td>
                <td className="py-1 text-right">{s.ucl}</td>
                <td className="py-1 text-right">{s.usl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
