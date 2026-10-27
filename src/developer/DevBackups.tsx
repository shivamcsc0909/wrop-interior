import React, { useState } from 'react';
import { HardDriveDownload, Database, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export const DevBackups: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadBackup = () => {
    setDownloading(true);
    // Trigger download from backend endpoint /api/dev/backup/export
    window.location.href = '/api/dev/backup/export';
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono max-w-4xl">
      <div className="pb-4 border-b border-zinc-800">
        <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
          Disaster Recovery & Data Export
        </span>
        <h1 className="text-xl font-bold text-zinc-100 font-sans">
          Database Backup & Archive Workflows
        </h1>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-zinc-200">
              One-Click Full SQL Schema & Content Dump
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Exports all website settings, dynamic homepage sections, interior services, portfolio projects, journal articles, consultation inquiries, and media registry rows into a standard SQL script compatible with phpMyAdmin, MySQL CLI, and SQLite.
            </p>
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-zinc-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hostinger Shared Hosting Compatibility</span>
          </div>
          <p className="text-zinc-500 leading-relaxed text-[11px]">
            The exported <code className="text-zinc-300">.sql</code> file can be directly imported via Hostinger hPanel under <span className="text-zinc-300">Databases → phpMyAdmin → Import</span>.
          </p>
        </div>

        <div>
          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling SQL Dump...' : 'Download Complete SQL Backup'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
