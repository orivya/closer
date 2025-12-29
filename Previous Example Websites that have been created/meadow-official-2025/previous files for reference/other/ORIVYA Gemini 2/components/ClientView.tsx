import React, { useState, useEffect } from 'react';
import { Key, LogOut, Loader2, Folder, FileCode, ChevronRight, Save, Bot, Sparkles, X, UploadCloud, AlertCircle, RefreshCw, FileJson, FileType, Image as ImageIcon, Eye, Code as CodeIcon, Copy, Check } from 'lucide-react';
import { validateToken, fetchRepos, fetchRepoContents, getFileContent, updateFile } from '../services/github';
import { generateCommitMessage, analyzeCode, refactorCode } from '../services/gemini';
import { GitHubUser, GitHubRepo, FileNode, FileStatus } from '../types';
import { PROJECT_FILES } from '../data/initialProject';

export default function ClientView() {
  // Auth State
  const [token, setToken] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Nav State
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  
  // Editor State
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>(''); // For diff
  const [fileStatus, setFileStatus] = useState<FileStatus>(FileStatus.IDLE);
  const [commitMessage, setCommitMessage] = useState('');
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [copySuccess, setCopySuccess] = useState(false);

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // AI Edit State
  const [showAiEdit, setShowAiEdit] = useState(false);
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);

  // Sync State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const userData = await validateToken(token);
      setUser(userData);
      const repoList = await fetchRepos(token, userData.login);
      setRepos(repoList);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setRepos([]);
    setSelectedRepo(null);
  };

  const handleRepoSelect = async (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setCurrentPath('');
    setPathHistory([]);
    loadPath(repo, '');
  };

  const loadPath = async (repo: GitHubRepo, path: string) => {
    setFileStatus(FileStatus.LOADING);
    try {
      const contents = await fetchRepoContents(token, repo.owner.login, repo.name, path);
      // Sort: Folders first, then files
      contents.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
      });
      setFiles(contents);
      setFileStatus(FileStatus.IDLE);
    } catch (err) {
      console.error(err);
      setFileStatus(FileStatus.ERROR);
    }
  };

  const handleRefresh = async () => {
    if (!selectedRepo) return;
    setIsRefreshing(true);
    await loadPath(selectedRepo, currentPath);
    setIsRefreshing(false);
  };

  const handleFileClick = async (file: FileNode) => {
    if (file.type === 'dir') {
      const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      setPathHistory([...pathHistory, currentPath]);
      setCurrentPath(newPath);
      loadPath(selectedRepo!, newPath);
    } else {
      setSelectedFile(file);
      setAiAnalysis(null); // Reset AI
      setShowAiEdit(false);
      setViewMode('code'); // Default to code view
      setFileStatus(FileStatus.LOADING);
      try {
        const content = await getFileContent(token, file.download_url);
        setFileContent(content);
        setOriginalContent(content);
        setFileStatus(FileStatus.IDLE);
      } catch (err) {
        setFileStatus(FileStatus.ERROR);
      }
    }
  };

  const handleGoBack = () => {
    if (pathHistory.length === 0) {
      setSelectedRepo(null);
      return;
    }
    const prevPath = pathHistory[pathHistory.length - 1];
    setPathHistory(pathHistory.slice(0, -1));
    setCurrentPath(prevPath);
    loadPath(selectedRepo!, prevPath);
  };

  const handleCommit = async () => {
    if (!selectedRepo || !selectedFile) return;
    setFileStatus(FileStatus.SAVING);
    try {
      await updateFile(
        token,
        selectedRepo.owner.login,
        selectedRepo.name,
        selectedFile.path,
        fileContent,
        selectedFile.sha,
        commitMessage || `Update ${selectedFile.name}`
      );
      // Refresh sha
      const newFiles = await fetchRepoContents(token, selectedRepo.owner.login, selectedRepo.name, currentPath);
      const updatedNode = newFiles.find(f => f.path === selectedFile.path);
      if (updatedNode) setSelectedFile(updatedNode);
      
      setOriginalContent(fileContent);
      setFileStatus(FileStatus.SUCCESS);
      setTimeout(() => setFileStatus(FileStatus.IDLE), 2000);
    } catch (err: any) {
      alert(`Commit Failed: ${err.message}`);
      setFileStatus(FileStatus.ERROR);
    }
  };

  // Upload the current project state to the connected repo
  const handleUploadProject = async () => {
    if (!selectedRepo) return;
    setIsUploading(true);
    setUploadProgress('Starting upload...');
    
    try {
      const filesToUpload = Object.entries(PROJECT_FILES);
      let count = 0;
      
      for (const [filename, content] of filesToUpload) {
        setUploadProgress(`Uploading ${filename}...`);
        
        // Check if file exists to get SHA (needed for update, omitted for create)
        let sha: string | undefined;
        const existingFile = files.find(f => f.name === filename);
        if (existingFile) {
            sha = existingFile.sha;
        }

        await updateFile(
          token,
          selectedRepo.owner.login,
          selectedRepo.name,
          filename,
          content,
          sha,
          existingFile ? `Update ${filename}` : `Initialize ${filename}`
        );
        count++;
      }
      
      setUploadProgress('Done!');
      // Refresh view
      loadPath(selectedRepo, '');
      
    } catch (e: any) {
      alert(`Upload failed: ${e.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleAiAnalyze = async () => {
    if (!selectedFile) return;
    setIsAiThinking(true);
    const analysis = await analyzeCode(fileContent, selectedFile.name);
    setAiAnalysis(analysis);
    setIsAiThinking(false);
  };

  const handleAiCommitMsg = async () => {
    if (!selectedFile) return;
    setIsAiThinking(true);
    const msg = await generateCommitMessage(selectedFile.name, originalContent, fileContent);
    setCommitMessage(msg);
    setIsAiThinking(false);
  };

  const handleAiRefactor = async () => {
    if (!selectedFile || !aiEditPrompt) return;
    setIsAiEditing(true);
    try {
      const newCode = await refactorCode(fileContent, aiEditPrompt, selectedFile.name);
      setFileContent(newCode);
      setShowAiEdit(false);
      setAiEditPrompt('');
    } catch (e) {
      alert("AI Edit Failed. Please try again.");
    } finally {
      setIsAiEditing(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(fileContent);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode size={16} className="text-blue-400" />;
      case 'css':
      case 'scss':
      case 'html':
        return <FileType size={16} className="text-orange-400" />;
      case 'json':
      case 'yml':
      case 'yaml':
        return <FileJson size={16} className="text-yellow-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'gif':
        return <ImageIcon size={16} className="text-pink-400" />;
      case 'md':
        return <FileType size={16} className="text-gray-300" />;
      default:
        return <FileCode size={16} className="text-gray-500" />;
    }
  };

  const isHtml = selectedFile?.name.endsWith('.html');

  // Renders
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 rounded-xl border border-github-border bg-github-panel p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-github-dark border border-github-border text-white">
              <Key size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Connect GitHub</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter a Personal Access Token (Classic) with <code>repo</code> scope to view and edit your repositories.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-gray-500">Personal Access Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full rounded-lg border border-github-border bg-github-dark px-4 py-3 text-white placeholder-gray-600 focus:border-github-accent focus:outline-none focus:ring-1 focus:ring-github-accent"
            />
          </div>

          {authError && <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">{authError}</div>}

          <button
            type="submit"
            disabled={!token || isAuthLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-github-success py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-50"
          >
            {isAuthLoading ? <Loader2 className="animate-spin" /> : 'Authenticate'}
          </button>
          
          <p className="text-center text-xs text-gray-500">
            Tokens are not stored on any server. They exist only in your browser session.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar: Repos & File Tree */}
      <div className="flex w-80 flex-col border-r border-github-border bg-github-panel">
        <div className="flex items-center justify-between border-b border-github-border p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={user.avatar_url} alt={user.login} className="h-8 w-8 rounded-full" />
            <span className="truncate font-semibold text-white">{user.login}</span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>

        {/* Repo List or File Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          {!selectedRepo ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold uppercase text-gray-500">Repositories</h3>
                <button 
                  onClick={() => fetchRepos(token, user.login).then(setRepos)} 
                  className="text-gray-500 hover:text-white"
                  title="Refresh Repositories"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
              {repos.map(repo => (
                <button
                  key={repo.id}
                  onClick={() => handleRepoSelect(repo)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-github-border hover:text-white"
                >
                  <Folder size={16} className="text-gray-500" />
                  <span className="truncate">{repo.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2 px-2">
                <button onClick={handleGoBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white flex-1 truncate">
                  <ChevronRight className="rotate-180" size={12} />
                  Back {currentPath ? 'to parent' : 'to repos'}
                </button>
                <button 
                  onClick={handleRefresh} 
                  disabled={isRefreshing}
                  className={`text-gray-400 hover:text-white ${isRefreshing ? 'animate-spin' : ''}`}
                  title="Refresh Files"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <div className="mb-2 px-2 text-xs font-bold text-github-accent truncate">
                {selectedRepo.name}/{currentPath}
              </div>
              <div className="space-y-0.5">
                {files.length === 0 && fileStatus !== FileStatus.LOADING ? (
                   <div className="p-4 text-center text-gray-500 text-xs">Empty directory</div>
                ) : (
                  files.map(file => (
                    <button
                      key={file.path}
                      onClick={() => handleFileClick(file)}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-github-border ${
                        selectedFile?.path === file.path ? 'bg-blue-500/20 text-blue-300' : 'text-gray-300'
                      }`}
                    >
                      {file.type === 'dir' ? <Folder size={16} className="text-blue-400" /> : getFileIcon(file.name)}
                      <span className="truncate">{file.name}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Upload Button for Empty/Small Repos */}
              {files.length < 3 && !currentPath && (
                <div className="mt-8 p-4">
                  <div className="rounded-lg border border-github-border bg-github-dark p-4">
                    <div className="flex items-center gap-2 mb-2 text-yellow-500">
                        <AlertCircle size={16} />
                        <span className="text-xs font-bold">Missing Files?</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      This repo looks empty. Want to upload the current project code here?
                    </p>
                    <button 
                      onClick={handleUploadProject}
                      disabled={isUploading}
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-github-border hover:bg-gray-700 py-2 text-xs font-semibold text-white transition-colors"
                    >
                      {isUploading ? <Loader2 className="animate-spin" size={14}/> : <UploadCloud size={14}/>}
                      {isUploading ? uploadProgress : 'Initialize Project'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main: Editor */}
      <div className="flex flex-1 flex-col bg-github-dark">
        {!selectedFile ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <FileCode size={48} className="mb-4 opacity-20" />
            <p>Select a file to view or edit</p>
          </div>
        ) : (
          <>
            {/* Editor Toolbar */}
            <div className="flex flex-col border-b border-github-border bg-github-panel">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-300">{selectedFile.path}</span>
                  {/* View Toggles for HTML */}
                  {isHtml && (
                    <div className="flex rounded-md bg-github-dark p-0.5 border border-github-border">
                       <button 
                         onClick={() => setViewMode('code')}
                         className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${viewMode === 'code' ? 'bg-github-border text-white' : 'text-gray-400 hover:text-white'}`}
                       >
                         <CodeIcon size={12} />
                         Code
                       </button>
                       <button 
                         onClick={() => setViewMode('preview')}
                         className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                       >
                         <Eye size={12} />
                         Preview
                       </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopyContent}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-github-border mr-1"
                    title="Copy content"
                  >
                    {copySuccess ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => setShowAiEdit(!showAiEdit)}
                    className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                       showAiEdit ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                    }`}
                  >
                    <Sparkles size={14} />
                    Magic Edit
                  </button>
                  <div className="h-4 w-px bg-github-border mx-1"></div>
                  <button
                    onClick={handleAiAnalyze}
                    disabled={isAiThinking}
                    className="flex items-center gap-2 rounded bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20"
                  >
                    <Bot size={14} />
                    {isAiThinking ? 'Thinking...' : 'Analyze'}
                  </button>
                </div>
              </div>
              
              {/* AI Edit Input Panel */}
              {showAiEdit && (
                <div className="border-t border-github-border bg-indigo-900/10 px-4 py-3 animate-[fadeIn_0.2s_ease-out]">
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       value={aiEditPrompt}
                       onChange={(e) => setAiEditPrompt(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleAiRefactor()}
                       placeholder="Describe your changes... (e.g., 'Change the button color to red' or 'Fix the logic error')"
                       className="flex-1 rounded-md border border-indigo-500/30 bg-github-dark px-3 py-2 text-sm text-white placeholder-indigo-300/30 focus:border-indigo-500 focus:outline-none"
                       autoFocus
                     />
                     <button
                       onClick={handleAiRefactor}
                       disabled={!aiEditPrompt || isAiEditing}
                       className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                     >
                       {isAiEditing ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                     </button>
                     <button onClick={() => setShowAiEdit(false)} className="p-2 text-gray-400 hover:text-white">
                        <X size={16} />
                     </button>
                   </div>
                </div>
              )}
            </div>

            {/* Split View: Editor & AI Panel */}
            <div className="flex flex-1 overflow-hidden">
              {/* Content Area (Code or Preview) */}
              <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
                {fileStatus === FileStatus.LOADING ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-github-dark">
                     <Loader2 className="animate-spin text-github-accent" />
                   </div>
                ) : (
                  <>
                    {viewMode === 'preview' && isHtml ? (
                      <iframe 
                        srcDoc={fileContent} 
                        className="w-full h-full bg-white border-0 block" 
                        title="Preview"
                        sandbox="allow-scripts allow-same-origin" 
                      />
                    ) : (
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="h-full w-full resize-none bg-github-dark p-4 font-mono text-sm text-gray-300 outline-none focus:bg-[#0f141a]"
                        spellCheck={false}
                      />
                    )}
                  </>
                )}
              </div>
              
              {/* AI Sidebar (if analysis exists) */}
              {aiAnalysis && (
                <div className="w-80 overflow-y-auto border-l border-github-border bg-github-panel p-4 text-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2 font-bold text-purple-400">
                        <Bot size={16} /> AI Analysis
                    </h3>
                    <button onClick={() => setAiAnalysis(null)} className="text-gray-500 hover:text-white">
                        <X size={14} />
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {aiAnalysis}
                  </div>
                </div>
              )}
            </div>

            {/* Commit Bar */}
            <div className="border-t border-github-border bg-github-panel p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      placeholder="Commit message description..."
                      className="w-full rounded-md border border-github-border bg-github-dark px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-github-accent focus:outline-none"
                    />
                    <button 
                       onClick={handleAiCommitMsg}
                       className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300"
                    >
                      ✨ Generate
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCommit}
                  disabled={fileStatus === FileStatus.SAVING || fileContent === originalContent}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
                    fileStatus === FileStatus.SUCCESS ? 'bg-green-600' : 'bg-github-success hover:bg-green-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {fileStatus === FileStatus.SAVING ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : fileStatus === FileStatus.SUCCESS ? (
                    'Saved!'
                  ) : (
                    <>
                      <Save size={16} />
                      Commit Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}