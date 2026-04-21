'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Website } from '@/types/website';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('projectId') || '';
    setProjectId(id);
    fetchWebsites(id);
  }, []);

  const fetchWebsites = async (id: string) => {
    try {
      const response = await fetch(`/api/websites/list?projectId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setWebsites(data.websites || []);
      }
    } catch (error) {
      console.error('Failed to fetch websites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Websites</h1>
        <Link
          href={`/dashboard/websites/new?projectId=${projectId}`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Website
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No websites yet</p>
          <Link
            href={`/dashboard/websites/new?projectId=${projectId}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Create your first website
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {websites.map(website => (
            <div
              key={website.id}
              className="p-4 border rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{website.name}</h3>
                  {website.description && (
                    <p className="text-sm text-gray-600 mt-1">{website.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span>Pages: {website.pages.length}</span>
                    {website.custom_domain && <span>Domain: {website.custom_domain}</span>}
                    <span>Version: {website.version}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {website.published_at && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                      Published
                    </span>
                  )}
                  <Link
                    href={`/dashboard/websites/${website.id}/edit?projectId=${projectId}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
