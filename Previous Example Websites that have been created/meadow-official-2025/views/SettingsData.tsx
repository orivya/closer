import React, { useState } from 'react';
import { ViewState } from '../types';
import {
  ChevronLeft, Download, Trash2, Database, FileJson,
  Calendar, Loader2, Check, AlertTriangle,
  HardDrive, Cloud
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';
import { toast } from '../hooks/use-toast';

interface SettingsDataProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const SettingsData: React.FC<SettingsDataProps> = ({ onChangeView }) => {
  const { user, signOut } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('export-data', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      // Download the file
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meadow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastExport(new Date().toISOString());
      toast({
        title: 'Export complete',
        description: 'Your data has been downloaded.',
      });
    } catch (err: any) {
      toast({
        title: 'Export failed',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setIsDeleting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: 'Account deleted',
        description: 'Your account and all data have been permanently removed.',
      });

      await signOut();
      window.location.reload();
    } catch (err: any) {
      toast({
        title: 'Failed to delete account',
        description: err.message || 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="max-w-2xl mx-auto">
        {/* Data Overview */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-subtle flex items-center justify-center border border-sage-border">
              <Database size={20} className="text-sage" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Your Data</h2>
              <p className="text-xs text-text-muted">Overview of your stored data</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive size={16} className="text-sage" />
                <span className="text-xs text-text-muted">Storage Used</span>
              </div>
              <p className="text-2xl font-serif text-text-primary">—</p>
              <p className="text-xs text-text-muted">Calculating...</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Cloud size={16} className="text-sage" />
                <span className="text-xs text-text-muted">Sync Status</span>
              </div>
              <p className="text-lg font-medium text-sage flex items-center gap-2">
                <Check size={16} /> Synced
              </p>
              <p className="text-xs text-text-muted">All data backed up</p>
            </div>
          </div>
        </section>

        {/* Export Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-subtle flex items-center justify-center border border-sage-border">
              <Download size={20} className="text-sage" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Export Data</h2>
              <p className="text-xs text-text-muted">Download a copy of your data</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-6">
            {/* Format Info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-surface border border-dark-border">
              <FileJson size={24} className="text-sage" />
              <div>
                <p className="font-medium text-text-primary">JSON Format</p>
                <p className="text-xs text-text-muted">Complete data backup in standard JSON format</p>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Includes:</p>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• All journal entries and reflections</li>
                <li>• Mood logs and analytics</li>
                <li>• Threads and tags</li>
                <li>• Intentions and decisions</li>
                <li>• Time capsules</li>
                <li>• AI settings and artifacts</li>
              </ul>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-4 rounded-xl bg-sage text-white font-medium shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Preparing Export...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Export My Data
                </>
              )}
            </button>

            {lastExport && (
              <p className="text-xs text-text-muted text-center flex items-center justify-center gap-2">
                <Calendar size={12} />
                Last export: {new Date(lastExport).toLocaleDateString()}
              </p>
            )}
          </div>
        </section>

        {/* Delete Account Section */}
        <section className="pt-8 border-t border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Delete Account</h2>
              <p className="text-xs text-text-muted">Permanently remove your account and data</p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 font-medium"
            >
              Delete My Account
            </button>
          ) : (
            <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-300">This action cannot be undone</p>
                  <p className="text-sm text-red-400/80 mt-1">
                    All your journal entries, mood logs, reflections, and personal data will be permanently deleted.
                    We recommend exporting your data first.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-300 mb-2">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 rounded-xl border border-red-500/30 bg-dark-surface focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all text-text-primary placeholder:text-text-muted"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-dark-border bg-dark-surface text-text-secondary hover:bg-dark-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsData;
