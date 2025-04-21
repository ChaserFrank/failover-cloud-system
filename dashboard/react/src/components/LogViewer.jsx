import React, { useEffect, useState } from "react";
import { fetchSystemLogs } from "../api/monitorAPI";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await fetchSystemLogs();
      setLogs(data.logs || []);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => filter === "All" || log.level === filter);

  return (
    <div className="p-4 bg-gray-800 rounded-xl text-white mt-4">
      <h2 className="text-xl font-semibold mb-2">System Logs</h2>
      <div className="flex gap-4 mb-2">
        {["All", "Info", "Warn", "Error"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-3 py-1 rounded ${filter === lvl ? "bg-blue-600" : "bg-gray-600"}`}
          >
            {lvl}
          </button>
        ))}
      </div>
      <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
        {filteredLogs.map((log, idx) => (
          <div key={idx} className={`p-2 rounded bg-gray-700 ${log.level === "Error" ? "text-red-400" : ""}`}>
            [{log.timestamp}] {log.level}: {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
