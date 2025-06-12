import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FeedPage({ token, onLogout }) {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    decodeToken()
  }, [])

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserId(payload.id)
      setUsername(`Usuario #${payload.id}`)
    } catch {
      setUsername('Usuario desconocido')
    }
  }

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:3000/posts')
    const data = await res.json()
    setPosts(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return setError('El contenido no puede estar vacío')

    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Error al publicar')
      return
    }

    setContent('')
    setError('')
    fetchPosts()
  }

  const handleDelete = async (postId) => {
    const res = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.ok) fetchPosts()
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">Bienvenido, {username}</p>
        <button
          className="text-sm text-red-600 underline"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="¿Qué querés decir?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit" className="bg-black text-white p-2 rounded">
          Publicar
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <p className="text-sm text-gray-700 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
              {post.content}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleString()}
              </p>
              {userId && post.user_id === userId && (
                <button
                  onClick={() => handleDelete(post.id)}
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
