'use client';

import React, { useState } from 'react';
import { Website, WebsitePage, WebsiteComponent } from '@/types/website';

interface WebsiteBuilderProps {
  website?: Website;
  projectId: string;
  onSave: (website: Website) => void;
}

export default function WebsiteBuilder({
  website,
  projectId,
  onSave,
}: WebsiteBuilderProps) {
  const [name, setName] = useState(website?.name || '');
  const [description, setDescription] = useState(website?.description || '');
  const [pages, setPages] = useState<WebsitePage[]>(
    website?.pages || [
      {
        id: '1',
        slug: 'home',
        title: 'Home',
        components: [],
        is_published: false,
      },
    ]
  );
  const [currentPageId, setCurrentPageId] = useState(pages[0]?.id || '1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentPage = pages.find(p => p.id === currentPageId) || pages[0];

  const addComponent = (type: WebsiteComponent['type']) => {
    const newComponent: WebsiteComponent = {
      id: Date.now().toString(),
      type,
      props: {},
      styles: {},
    };

    const updatedPages = pages.map(p => {
      if (p.id === currentPageId) {
        return {
          ...p,
          components: [...p.components, newComponent],
        };
      }
      return p;
    });

    setPages(updatedPages);
  };

  const removeComponent = (componentId: string) => {
    const updatedPages = pages.map(p => {
      if (p.id === currentPageId) {
        return {
          ...p,
          components: p.components.filter(c => c.id !== componentId),
        };
      }
      return p;
    });

    setPages(updatedPages);
  };

  const addPage = () => {
    const newPage: WebsitePage = {
      id: Date.now().toString(),
      slug: `page-${pages.length}`,
      title: `Page ${pages.length + 1}`,
      components: [],
      is_published: false,
    };

    setPages([...pages, newPage]);
    setCurrentPageId(newPage.id);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Website name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const endpoint = website
        ? `/api/websites/${website.id}`
        : '/api/websites/create';
      const method = website ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name,
          description,
          pages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save website');
      }

      const data = await response.json();
      onSave(data.website);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Website Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., My Business Website"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe your website..."
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Pages</h3>
          <div className="space-y-2 mb-4">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => setCurrentPageId(page.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  currentPageId === page.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border hover:bg-gray-100'
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
          <button
            onClick={addPage}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + Add Page
          </button>

          <h3 className="font-semibold mt-6 mb-4">Components</h3>
          <div className="space-y-2">
            {['hero', 'card', 'form', 'cta', 'testimonial', 'gallery'].map(
              type => (
                <button
                  key={type}
                  onClick={() => addComponent(type as any)}
                  className="w-full px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 capitalize"
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        <div className="col-span-3 bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{currentPage?.title}</h2>

          {currentPage?.components && currentPage.components.length === 0 ? (
            <p className="text-gray-500">No components yet. Add one from the left panel.</p>
          ) : (
            <div className="space-y-4">
              {currentPage?.components.map(component => (
                <div
                  key={component.id}
                  className="p-4 bg-gray-50 rounded border flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold capitalize">{component.type}</p>
                    <p className="text-xs text-gray-500">ID: {component.id}</p>
                  </div>
                  <button
                    onClick={() => removeComponent(component.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
      >
        {saving ? 'Saving...' : 'Save Website'}
      </button>
    </div>
  );
}
