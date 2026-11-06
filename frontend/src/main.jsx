import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const topics = [
  ['01', 'Magnitudes y vectores', 'Escalares, vectoriales, componentes y operaciones'],
  ['02', 'Cinemática', 'MRU, MRUV, caída libre y movimiento parabólico'],
  ['03', 'Movimiento circular', 'Velocidad angular, período y aceleración centrípeta'],
  ['04', 'Dinámica', 'Fuerzas y leyes de Newton'],
  ['05', 'Trabajo y energía', 'Trabajo mecánico y conservación de energía'],
  ['06', 'Fluidos', 'Hidrostática, Arquímedes, Pascal e hidrodinámica'],
  ['07', 'Termodinámica', 'Calor, temperatura y principios térmicos'],
  ['08', 'Electricidad y magnetismo', 'Carga, corriente, circuitos y campos magnéticos'],
  ['09', 'Luz y óptica', 'Reflexión, refracción y formación de imágenes'],
]

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy FISICAI, Tu tutor especializado en Física. Puedes preguntarme sobre teoría o enviarme un ejercicio escrito. Te explicaré los procedimientos paso a paso.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('demo')

  async function send(text = input) {
    const question = text.trim()
    if (!question || loading) return
    const next = [...messages, { role: 'user', content: question }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      })
      if (!response.ok) throw new Error('API no disponible')
      const data = await response.json()
      setMode(data.mode)
      setMessages([...next, { role: 'assistant', content: data.answer }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'No puedo conectar con el servidor todavía. Cuando publiquemos el backend y configuremos la IA, podré responder tus ejercicios. Mientras tanto, puedes explorar los temas.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon">⚛</span><span>FISICAI<small>APRENDE FÍSICA CON IA</small></span></a>
        <div className="status"><i /> Tutor de Física <span className="mode">{mode === 'ai' ? 'IA conectada' : 'Vista previa'}</span></div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><span /> TU LABORATORIO DE APRENDIZAJE</div>
          <h1>La Física se entiende.<br /><em>Vamos paso a paso.</em></h1>
          <p>Pregunta, practica y descubre cómo funciona el mundo con tu tutor de Física.</p>
        </section>

        <section className="workspace">
          <aside className="sidebar">
            <div className="section-label">CONTENIDO</div>
            <h2>Explora la Física</h2>
            <div className="topic-list">
              {topics.map(([n, title, desc]) => (
                <button className="topic" key={n} onClick={() => send(`Explícame el tema ${title}: ${desc}. Incluye conceptos, fórmulas y un ejemplo resuelto paso a paso.`)}>
                  <span className="topic-number">{n}</span><span><b>{title}</b><small>{desc}</small></span><span className="arrow">↗</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="chat-panel">
            <div className="chat-heading"><div><span className="bot-avatar">⚛</span><span><b>Chat con FISICAI</b><small>Respuestas claras y guiadas</small></span></div><span className="live-dot">● Disponible</span></div>
            <div className="messages">
              {messages.map((m, i) => <div className={`message ${m.role}`} key={i}><span className="message-avatar">{m.role === 'assistant' ? '⚛' : 'TÚ'}</span><div className="bubble">{m.content}</div></div>)}
              {loading && <div className="typing">FISICAI está pensando...</div>}
            </div>
            <div className="suggestions"><button onClick={() => send('Explícame las leyes de Newton con ejemplos.')}>Leyes de Newton</button><button onClick={() => send('Resuelve un ejercicio de MRUV paso a paso.')}>Ejercicio de MRUV</button><button onClick={() => send('¿Qué diferencia hay entre masa y peso?')}>Masa y peso</button></div>
            <form className="composer" onSubmit={e => { e.preventDefault(); send() }}>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe tu pregunta de Física..." aria-label="Pregunta de Física" />
              <button type="submit" disabled={loading || !input.trim()}>Enviar <span>↑</span></button>
            </form>
            <p className="disclaimer">FISICAI es una herramienta educativa. Verifica los resultados y las unidades.</p>
          </section>
        </section>
      </main>
      <footer>© 2026 FISICAI · Hecho para aprender Física</footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
