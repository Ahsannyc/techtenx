'use client';

import React, { useState } from 'react';
import { Automation, AutomationTrigger, AutomationAction } from '@/types/automation';

interface AutomationBuilderProps {
  automation?: Automation;
  projectId: string;
  onSave: (automation: Automation) => void;
}

export default function AutomationBuilder({
  automation,
  projectId,
  onSave,
}: AutomationBuilderProps) {
  const [name, setName] = useState(automation?.name || '');
  const [description, setDescription] = useState(automation?.description || '');
  const [trigger, setTrigger] = useState<AutomationTrigger>(
    automation?.trigger || {
      id: '1',
      type: 'webhook',
      config: {},
    }
  );
  const [actions, setActions] = useState<AutomationAction[]>(
    automation?.actions || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addAction = () => {
    const newAction: AutomationAction = {
      id: Date.now().toString(),
      type: 'send_email',
      config: {},
      order: actions.length,
    };
    setActions([...actions, newAction]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const updateAction = (id: string, updates: Partial<AutomationAction>) => {
    setActions(
      actions.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Automation name is required');
      return;
    }

    if (actions.length === 0) {
      setError('At least one action is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const endpoint = automation
        ? `/api/automations/${automation.id}`
        : '/api/automations/create';
      const method = automation ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name,
          description,
          trigger,
          actions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save automation');
      }

      const data = await response.json();
      onSave(data.automation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Automation Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Welcome Email on Form Submit"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe what this automation does..."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Trigger</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Trigger Type</label>
          <select
            value={trigger.type}
            onChange={e =>
              setTrigger({
                ...trigger,
                type: e.target.value as AutomationTrigger['type'],
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="webhook">Webhook</option>
            <option value="schedule">Schedule</option>
            <option value="manual">Manual</option>
            <option value="form_submission">Form Submission</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Actions</h3>
          <button
            onClick={addAction}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + Add Action
          </button>
        </div>

        {actions.length === 0 ? (
          <p className="text-gray-500 text-sm">No actions yet. Add one to get started.</p>
        ) : (
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div key={action.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Action {index + 1}</span>
                  <button
                    onClick={() => removeAction(action.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <select
                  value={action.type}
                  onChange={e =>
                    updateAction(action.id, {
                      type: e.target.value as AutomationAction['type'],
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="send_email">Send Email</option>
                  <option value="save_database">Save to Database</option>
                  <option value="api_call">API Call</option>
                  <option value="slack_message">Slack Message</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>
            ))}
          </div>
        )}
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
        {saving ? 'Saving...' : 'Save Automation'}
      </button>
    </div>
  );
}
