'use client';

import { useUser } from '@clerk/nextjs';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BriefingPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const classId = params.classId as string;
  const [briefing, setBriefing] = useState<any>(null);
  const [form, setForm] = useState({
    vocalFocus: '',
    emotionalState: '',
    physicalState: '',
    musicChoice: '',
    specificGoals: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && user && classId) {
      fetch(`/api/briefing?classId=${classId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            setBriefing(data);
            setForm({
              vocalFocus: data.vocalFocus || '',
              emotionalState: data.emotionalState || '',
              physicalState: data.physicalState || '',
              musicChoice: data.musicChoice || '',
              specificGoals: data.specificGoals || '',
            });
          }
        });
    }
  }, [isLoaded, user, classId]);

  if (!isLoaded) {
    return <div className="p-8">Carregando...</div>;
  }
  if (!user) {
    redirect('/login');
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, ...form }),
    });
    setSaving(false);
    alert('Briefing salvo!');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-4">Pré-Briefing da Aula</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-bold">Foco Vocal</label>
          <textarea
            name="vocalFocus"
            value={form.vocalFocus}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="font-bold">Estado Emocional</label>
          <textarea
            name="emotionalState"
            value={form.emotionalState}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="font-bold">Estado Físico</label>
          <textarea
            name="physicalState"
            value={form.physicalState}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="font-bold">Escolha Musical</label>
          <input
            type="text"
            name="musicChoice"
            value={form.musicChoice}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="font-bold">Objetivos Específicos</label>
          <textarea
            name="specificGoals"
            value={form.specificGoals}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
        >
          {saving ? 'Salvando...' : 'Salvar Briefing'}
        </button>
      </form>
    </div>
  );
}
