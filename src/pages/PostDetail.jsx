// src/pages/PostDetail.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function PostDetail({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    fetchPost()
    fetchComments()
    decodeToken()
  }, [])

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserId(payload.id)
    } catch {
      setUserId(null)
    }
  }

  const fetchPost = async () => {
    const res = await fetch(`http://localhost:3000/posts`)
    const data = await res.json()
    const match = data.find((p) => p.id === parseInt(id))
    setPost(match)
  }

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:3000/posts/${id}/comments`)
    const data = await res.json()
    setComments(data)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    await fetch(`http://localhost:3000/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: comment }),
    })
    setComment('')
    fetchComments()
  }

  const handleDeleteComment = async (commentId) => {
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    fetchComments()
  }

  if (!post) return <p className="text-center mt-10">Cargando post...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <button onClick={() => navigate(-1)} className="text-sm underline text-blue-600 mb-4">
        Volver
      </button>
      <div className="p-4 border rounded mb-6">
        <p className="text-sm text-gray-700">{post.content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(post.created_at).toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleComment} className="space-y-2 mb-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Escribí un comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button className="bg-black text-white p-2 rounded">Comentar</button>
      </form>

      <div className="space-y-3">
        {comments.map((c, i) => (
          <div key={i} className="p-3 border rounded">
            <p className="text-sm text-gray-700">{c.content}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
              {c.user_id === userId && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-xs text-red-600 underline"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
