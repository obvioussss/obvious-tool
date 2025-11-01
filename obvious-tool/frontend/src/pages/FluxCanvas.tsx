import { Link } from 'react-router-dom'
import { useFluxStore } from '../store/fluxStore'
import { useMemo, useRef } from 'react'

export default function FluxCanvas() {
  const {
    prompt,
    seed,
    previews,
    datasetFiles,
    isGenerating,
    isTraining,
    setPrompt,
    setSeed,
    addDatasetFiles,
    clearDataset,
    generate,
    train,
  } = useFluxStore()

  const latestPreview = useMemo(() => previews[0], [previews])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <h1 className="title" style={{ margin: 0, fontSize: 28 }}>Flux Canvas</h1>
        <span className="subtitle" style={{ margin: 0 }}>
          Prototype studio: prompt ? previews ? train LoRA (stubs)
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/" className="chip">? Retour</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 360px', gap: 16 }}>
        {/* Left panel */}
        <div style={{ background: 'var(--panel)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Prompt</div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image"
            rows={6}
            style={{ width: '100%', resize: 'vertical', background: 'transparent', color: 'var(--text)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', padding: 10 }}
          />

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Seed</label>
              <input
                type="number"
                value={seed ?? ''}
                onChange={(e) => setSeed(e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="random"
                style={{ width: '100%', background: 'transparent', color: 'var(--text)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', padding: '8px 10px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={generate}
              disabled={isGenerating || !prompt.trim()}
              style={{ flex: 1, padding: '10px 12px', background: 'var(--brand)', color: '#00122b', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: isGenerating ? 0.7 : 1 }}
            >
              {isGenerating ? 'Generating?' : 'Generate preview'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px -16px', height: 1 }} />

          <div style={{ fontWeight: 700, marginBottom: 8 }}>Dataset</div>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 10, padding: 12, cursor: 'pointer' }}
          >
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Click to select images (stub, not uploaded)</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && addDatasetFiles(Array.from(e.target.files))}
              style={{ display: 'none' }}
            />
          </div>
          {datasetFiles.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div className="chip">{datasetFiles.length} file(s) selected</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {datasetFiles.slice(0, 6).map((f, i) => (
                  <div key={i} className="chip" style={{ background: 'rgba(255,255,255,0.06)' }}>{f.name}</div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <button onClick={() => clearDataset()} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>Clear</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={() => train(1000)}
              disabled={isTraining}
              style={{ flex: 1, padding: '10px 12px', background: 'transparent', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: isTraining ? 0.7 : 1 }}
            >
              {isTraining ? 'Training?' : 'Start training'}
            </button>
          </div>
        </div>

        {/* Canvas preview */}
        <div style={{ background: 'var(--panel)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, minHeight: 360, display: 'grid', placeItems: 'center' }}>
          {latestPreview ? (
            <img src={latestPreview.previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 520, borderRadius: 10 }} />
          ) : (
            <div style={{ color: 'var(--muted)' }}>No preview yet. Enter a prompt and generate.</div>
          )}
        </div>

        {/* Right panel: history */}
        <div style={{ background: 'var(--panel)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>Previews</div>
            <div style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 12 }}>{previews.length}</div>
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr', gap: 10, maxHeight: 560, overflow: 'auto' }}>
            {previews.map((p) => (
              <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                <img src={p.previewUrl} alt="preview" style={{ width: '100%', display: 'block' }} />
                <div style={{ padding: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.prompt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
