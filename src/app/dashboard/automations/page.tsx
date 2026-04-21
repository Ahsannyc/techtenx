'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Automation } from '@/types/automation';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('projectId') || '';
    setProjectId(id);
    fetchAutomations(id);
  }, []);

  const fetchAutomations = async (id: string) => {
    try {
      const response = await fetch(`/api/automations/list?projectId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setAutomations(data.automations || []);
      }
    } catch (error) {
      console.error('Failed to fetch automations:', error);
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
        <h1 className="text-3xl font-bold">Automations</h1>
        <Link
          href={`/dashboard/automations/new?projectId=${projectId}`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Automation
        </Link>
      </div>

      {automations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No automations yet</p>
          <Link
            href={`/dashboard/automations/new?projectId=${projectId}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Create your first automation
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {automations.map(automation => (
            <div
              key={automation.id}
              className="p-4 border rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{automation.name}</h3>
                  {automation.description && (
                    <p className="text-sm text-gray-600 mt-1">{automation.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span>Trigger: {automation.trigger.type}</span>
                    <span>Actions: {automation.actions.length}</span>
                    <span>Executions: {automation.execution_count}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      automation.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {automation.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <Link
                    href={`/dashboard/automations/${automation.id}/edit?projectId=${projectId}`}
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
