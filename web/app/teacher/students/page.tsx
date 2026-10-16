'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Users, Loader, Star, Mail } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  image?: string;
  studentProfile?: {
    lessonBalance: number;
    monthlyLessonsUsed: number;
    generalGoal?: string;
  };
  classCount: number;
}

interface StudentStats {
  students: Student[];
  stats: {
    totalStudents: number;
    totalClasses: number;
    completedClasses: number;
  };
}

export default function TeacherStudentsPage() {
  const { user } = useUser();
  const [data, setData] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/teacher/students');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user]);

  const filteredStudents = data?.students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} />
            <h1 className="text-5xl font-black">Meus Alunos</h1>
          </div>
          <p className="text-lg opacity-90">Gerencie seus alunos e acompanhe o progresso deles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
              <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Total de Alunos</p>
              <p className="text-4xl font-black text-blue-600">{data.stats.totalStudents}</p>
            </div>
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
              <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Aulas Agendadas</p>
              <p className="text-4xl font-black text-green-600">{data.stats.totalClasses}</p>
            </div>
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
              <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Aulas Completadas</p>
              <p className="text-4xl font-black text-[#7732A6]">{data.stats.completedClasses}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Pesquisar aluno por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none focus:border-blue-500 font-bold"
          />
        </div>

        {/* Students List */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--card-border)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="divide-y divide-[var(--card-border)]">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-6 hover:bg-[var(--background-secondary)] transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        {student.image ? (
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                            {student.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[var(--foreground)]">{student.name}</p>
                          <p className="text-sm text-[var(--foreground-muted)] flex items-center gap-1">
                            <Mail size={14} />
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-[var(--foreground-muted)] font-bold">Aulas</p>
                      <p className="text-2xl font-black text-blue-600">{student.classCount}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-[var(--foreground-muted)] font-bold">Saldo</p>
                      <p className="text-2xl font-black text-green-600">
                        {student.studentProfile?.lessonBalance || 0}
                      </p>
                    </div>

                    <div className="text-right">
                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--foreground-muted)] font-bold">Nenhum aluno encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
