import React, { useState, useEffect } from 'react';
import { Activity, Database, HardDrive, Cpu, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { SystemHealth } from '../types';

export const DevDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getDevHealth();
      setHealth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !health) {
    return (
      <div className="p-8 text-center text-zinc-500 font-mono">
        Querying backend system diagnostics...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
            Infrastructure Diagnostics
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            System Health & Runtime Monitoring
          </h1>
        </div>
        <button
          onClick={loadHealth}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PHP Runtime */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>PHP ENGINE</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-100 block">
              PHP {health.php_version}
            </span>
            <span className="text-[10px] text-zinc-500">{health.os}</span>
          </div>
        </div>

        {/* Database */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>DATABASE LINK</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-400 block">
              {health.database.status}
            </span>
            <span className="text-[10px] text-zinc-500">
              Driver: {health.database.driver} ({health.database.latency_ms}ms latency)
            </span>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>ACTIVE MEMORY</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-100 block">
              {health.memory_usage_mb} MB
            </span>
            <span className="text-[10px] text-zinc-500">
              Limit: {health.memory_limit}
            </span>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>DISK SPACE</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-100 block">
              {health.disk_storage.free_gb} GB Free
            </span>
            <span className="text-[10px] text-zinc-500">
              Total: {health.disk_storage.total_gb} GB ({health.disk_storage.used_percent}% used)
            </span>
          </div>
        </div>
      </div>

      {/* Loaded Extensions & Environment Check */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded space-y-6">
        <h2 className="text-sm font-semibold text-zinc-200">
          Required Shared Hosting PHP Extensions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(health.loaded_extensions).map(([ext, isLoaded]) => (
            <div
              key={ext}
              className="p-3 bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs"
            >
              <span className="text-zinc-300 font-mono">{ext}</span>
              {isLoaded ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ACTIVE</span>
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>MISSING</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Server Execution Limits */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded space-y-4">
        <h2 className="text-sm font-semibold text-zinc-200">
          PHP Execution Limits & Configurations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-zinc-950 border border-zinc-800/60 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase">Max Execution Time</span>
            <p className="text-zinc-200 font-bold">{health.max_execution_time}</p>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800/60 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase">Upload Max Filesize</span>
            <p className="text-zinc-200 font-bold">{health.upload_max_filesize}</p>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800/60 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase">Post Max Size</span>
            <p className="text-zinc-200 font-bold">{health.post_max_size}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
