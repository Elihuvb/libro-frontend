import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login') // 'login' or 'register'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = mode === 'login' ? '/login' : '/register'
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Error')
      return
    }

    if (mode === 'register') {
      setMode('login')
      setError('Cuenta registrada, ahora podés iniciar sesión')
    } else {
      onLogin(data.token)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4 text-center">
        {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          {mode === 'login' ? 'Entrar' : 'Registrarme'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 text-sm text-center">{error}</p>}

      <p className="mt-4 text-center text-sm">
        {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
        >
          {mode === 'login' ? 'Registrate' : 'Iniciá sesión'}
        </button>
      </p>
    </div>
  )
}