'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, User, Loader2, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  _id: string;
  author: {
    name: string;
    email: string;
    userId?: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentsProps {
  postId: string;
}

export default function BlogComments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentCommentId?: string) => {
    e.preventDefault();
    const commentContent = parentCommentId ? replyContent : content;
    
    if (!commentContent.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: commentContent,
          parentCommentId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        if (parentCommentId) {
          setReplyContent('');
          setReplyingTo(null);
        } else {
          setContent('');
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao enviar comentário' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="mt-12 pt-12 border-t border-[var(--card-border)]">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 flex items-center gap-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
        <MessageSquare size={24} className="text-[#7732A6]" />
        Comentários
        <span className="text-lg text-[var(--foreground-muted)]">({comments.length})</span>
      </h2>

      {/* Formulário de comentário */}
      <div className="bg-[var(--background-secondary)] rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#7732A6]/20 flex items-center justify-center text-[#7732A6] flex-shrink-0">
            {session?.user?.name ? (
              <span className="font-bold text-sm">{session.user.name[0].toUpperCase()}</span>
            ) : (
              <User size={18} />
            )}
          </div>
          <form onSubmit={(e) => handleSubmit(e)} className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={session ? "Deixe seu comentário..." : "Faça login para comentar..."}
              disabled={!session}
              className="w-full px-4 py-3 border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6] resize-none min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-[var(--foreground-muted)]">
                {content.length}/1000 caracteres
              </span>
              {session ? (
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-6 py-2 bg-[#7732A6] text-white rounded-full font-bold hover:bg-[#5B21B6] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Enviar
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-[#7732A6] text-white rounded-full font-bold hover:bg-[#5B21B6] transition-all"
                >
                  Fazer Login
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl font-bold ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={32} className="animate-spin text-[#7732A6]" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">Nenhum comentário ainda</p>
          <p className="text-sm">Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#7732A6]/20 flex items-center justify-center text-[#7732A6] flex-shrink-0">
                  <span className="font-bold text-sm">{comment.author.name[0].toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-[var(--foreground)]">{comment.author.name}</span>
                    <span className="text-xs text-[var(--foreground-muted)]">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  
                  {/* Botões de ação */}
                  <div className="flex items-center gap-4 mt-3">
                    {session && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="text-sm text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors flex items-center gap-1"
                      >
                        <Reply size={14} /> Responder
                      </button>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="text-sm text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors flex items-center gap-1"
                      >
                        {showReplies[comment._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {comment.replies.length} resposta(s)
                      </button>
                    )}
                  </div>

                  {/* Formulário de resposta */}
                  {replyingTo === comment._id && (
                    <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-4">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Responder a ${comment.author.name}...`}
                        className="w-full px-4 py-3 border border-[var(--card-border)] rounded-xl bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6] resize-none min-h-[80px]"
                        maxLength={1000}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                          className="px-4 py-2 text-[var(--foreground-muted)] rounded-full font-bold hover:bg-[var(--background-secondary)] transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || !replyContent.trim()}
                          className="px-4 py-2 bg-[#7732A6] text-white rounded-full font-bold hover:bg-[#5B21B6] transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          Responder
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Respostas */}
                  {showReplies[comment._id] && comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-[var(--card-border)] space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F252BA]/20 flex items-center justify-center text-[#F252BA] flex-shrink-0">
                            <span className="font-bold text-xs">{reply.author.name[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-[var(--foreground)]">{reply.author.name}</span>
                              <span className="text-xs text-[var(--foreground-muted)]">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm text-[var(--foreground)] leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
