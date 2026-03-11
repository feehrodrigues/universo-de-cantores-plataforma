import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Sanity client com token para escrita
const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// GET - Buscar comentários de um post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId é obrigatório' }, { status: 400 });
    }

    const comments = await client.fetch(`
      *[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt desc) {
        _id,
        author,
        content,
        createdAt,
        "replies": *[_type == "comment" && parentComment._ref == ^._id && approved == true] | order(createdAt asc) {
          _id,
          author,
          content,
          createdAt
        }
      }
    `, { postId });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
}

// POST - Criar novo comentário
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { postId, content, parentCommentId } = body;

    if (!postId || !content) {
      return NextResponse.json({ error: 'postId e content são obrigatórios' }, { status: 400 });
    }

    if (content.length < 3 || content.length > 1000) {
      return NextResponse.json({ error: 'Comentário deve ter entre 3 e 1000 caracteres' }, { status: 400 });
    }

    // Verificar se o post existe
    const post = await client.fetch(`*[_type == "blogPost" && _id == $postId][0]._id`, { postId });
    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    // Criar comentário
    const commentDoc: any = {
      _type: 'comment',
      post: { _type: 'reference', _ref: postId },
      author: {
        name: session?.user?.name || 'Anônimo',
        email: session?.user?.email || 'anonimo@example.com',
        userId: session?.user?.id || undefined,
      },
      content: content.trim(),
      approved: false, // Precisa de aprovação manual
      createdAt: new Date().toISOString(),
    };

    // Se for resposta a outro comentário
    if (parentCommentId) {
      commentDoc.parentComment = { _type: 'reference', _ref: parentCommentId };
    }

    const result = await writeClient.create(commentDoc);

    return NextResponse.json({ 
      success: true, 
      message: 'Comentário enviado! Aguardando aprovação.',
      commentId: result._id 
    });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return NextResponse.json({ error: 'Erro ao criar comentário' }, { status: 500 });
  }
}
