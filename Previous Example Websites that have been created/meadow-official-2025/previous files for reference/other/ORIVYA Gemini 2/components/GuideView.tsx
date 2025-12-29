import React from 'react';
import { Download, Terminal, Upload, ArrowRight, Github, AlertTriangle } from 'lucide-react';

interface GuideViewProps {
  onTryClient: () => void;
}

const GuideView: React.FC<GuideViewProps> = ({ onTryClient }) => {
  return (
    <div className="mx-auto max-w-4xl overflow-y-auto p-8 text-github-text h-full">
      <div className="mb-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0" />
          <div>
            <h3 className="font-bold">Understanding the Environment</h3>
            <p className="mt-1 text-sm text-yellow-100/80">
              This AI coding environment is isolated. It cannot directly push to your GitHub repositories by default for security reasons. 
              However, you can use the built-in <strong>Live Client</strong> (in the next tab) to manually bridge this gap using your Personal Access Token, or follow the standard workflow below.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-3xl font-bold text-white">How to Sync AI Code to GitHub</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Step 1 */}
        <div className="rounded-xl border border-github-border bg-github-panel p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            <Download size={24} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">1. Export</h3>
          <p className="text-sm text-gray-400">
            In the AI chat, ask to "Export code" or look for a download button to get your project files as a ZIP archive or individual files.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-github-border bg-github-panel p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
            <Terminal size={24} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">2. Local Setup</h3>
          <p className="text-sm text-gray-400">
            Unzip the files into a folder on your computer. Open your terminal in that folder and initialize git.
          </p>
          <div className="mt-3 rounded bg-github-dark p-2 text-xs font-mono text-gray-300">
            git init<br/>
            git add .<br/>
            git commit -m "Initial commit"
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-github-border bg-github-panel p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400">
            <Upload size={24} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">3. Push</h3>
          <p className="text-sm text-gray-400">
            Create a new repository on GitHub, then link it to your local folder and push your changes.
          </p>
          <div className="mt-3 rounded bg-github-dark p-2 text-xs font-mono text-gray-300">
            git remote add origin [URL]<br/>
            git push -u origin main
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-github-border bg-gradient-to-br from-github-panel to-github-dark p-8 text-center">
        <Github className="mx-auto mb-4 h-12 w-12 text-white" />
        <h2 className="mb-2 text-2xl font-bold text-white">Want to edit directly from here?</h2>
        <p className="mx-auto mb-6 max-w-lg text-gray-400">
          We built a <strong>Live Client</strong> that connects to the GitHub API. 
          You can browse your private repos, view files, and even make quick edits/commits directly from this web interface.
        </p>
        <button
          onClick={onTryClient}
          className="inline-flex items-center gap-2 rounded-lg bg-github-success px-6 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-green-600"
        >
          Launch Live Client <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default GuideView;