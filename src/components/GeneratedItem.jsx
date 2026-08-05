// Preview of one generated study item, shared by the AI Generate page and the
// "from my own material" flow so the two can't drift apart.
export default function GeneratedItem({ kind, item }) {
  return (
    <div className="card gen-item">
      <div className="gen-meta">
        {item.topic && <span className="pill">{item.topic}</span>}
        {item.private && <span className="pill private">private</span>}
        {item.source && <span className="muted gen-src">from: {item.source}</span>}
      </div>

      {kind === 'flashcards' && (
        <>
          <p className="gen-q">{item.front}</p>
          <p className="muted" style={{ margin: 0 }}>{item.back}</p>
        </>
      )}

      {kind === 'cloze' && <p style={{ margin: 0 }}>{item.cloze}</p>}

      {kind === 'viva' && (
        <>
          <p className="gen-q">{item.question}</p>
          <p className="muted" style={{ margin: 0 }}>{item.answer}</p>
        </>
      )}

      {kind === 'mcqs' && (
        <>
          <p className="gen-q">{item.question}</p>
          <ol type="A" style={{ margin: '0 0 6px', paddingLeft: 20 }}>
            {item.options?.map((o, j) => (
              <li
                key={j}
                style={{
                  fontWeight: j === item.answer ? 700 : 400,
                  color: j === item.answer ? 'var(--good)' : 'inherit',
                }}
              >
                {o}
              </li>
            ))}
          </ol>
          <p className="muted" style={{ margin: 0 }}>{item.explanation}</p>
        </>
      )}
    </div>
  )
}
