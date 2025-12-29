import { GitHubRepo, FileNode, GitHubUser } from '../types';

const BASE_URL = 'https://api.github.com';

export const validateToken = async (token: string): Promise<GitHubUser> => {
  const response = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Invalid Personal Access Token');
  }

  return response.json();
};

export const fetchRepos = async (token: string, username: string): Promise<GitHubRepo[]> => {
  // Fetching user's repos, sorting by updated
  const response = await fetch(`${BASE_URL}/user/repos?sort=updated&per_page=100`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  return response.json();
};

export const fetchRepoContents = async (
  token: string,
  owner: string,
  repo: string,
  path: string = ''
): Promise<FileNode[]> => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    // If 404, it might be an empty repo or invalid path. Return empty array to handle gracefully.
    if (response.status === 404) return [];
    throw new Error('Failed to fetch file contents');
  }

  return response.json();
};

export const getFileContent = async (
  token: string,
  downloadUrl: string
): Promise<string> => {
  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download file content');
  }

  return response.text();
};

export const updateFile = async (
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  sha: string | undefined, // Make SHA optional for new files
  message: string
): Promise<void> => {
  // Convert content to base64
  // Note: Using btoa implies standard ASCII. For UTF-8, need text encoder.
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  const base64Content = btoa(binary);

  const body: any = {
    message,
    content: base64Content,
  };

  // Only attach SHA if we are updating an existing file
  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update file');
  }
};