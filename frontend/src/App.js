import { useState } from "react";
import axios from "axios";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const API = "https://math-checker-backend.onrender.com";

const theme = {
  bg: "#1a0f00",
  surface: "#2a1a00",
  border: "#4a3010",
  accent: "#f5c842",
  accentDark: "#c49a1a",
  text: "#f2e0c0",
  muted: "#a07840",
  error: "#e06020",
  success: "#c8a020",
};

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: theme.bg,
    color: theme.text,
    fontFamily: "'Times New Roman', Times, serif",
    padding: "0 0 80px 0",
  },
  header: {
    borderBottom: `1px solid ${theme.border}`,
    padding: "32px 40px",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: theme.accent,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: theme.text,
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: theme.muted,
    margin: 0,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  main: {
    maxWidth: 700,
    margin: "0 auto",
    padding: "48px 24px 0",
  },
  card: {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: 28,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: theme.accent,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 11,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: theme.muted,
    display: "block",
    marginBottom: 6,
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    color: theme.text,
    fontSize: 14,
    fontFamily: "'Times New Roman', Times, serif",
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    color: theme.text,
    fontSize: 14,
    fontFamily: "'Times New Roman', Times, serif",
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    height: 160,
  },
  btn: (color) => ({
    padding: "10px 22px",
    backgroundColor: color,
    color: color === theme.accent ? "#000" : "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Times New Roman', Times, serif",
  }),
  resultBox: (ok) => ({
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: ok ? "#1a2a00" : "#2a1000",
    border: `1px solid ${ok ? "#3a5a00" : "#5a2000"}`,
  }),
  stepBox: (ok) => ({
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: ok ? "#1a2a00" : "#2a1000",
    borderLeft: `3px solid ${ok ? theme.success : theme.error}`,
  }),
  pre: {
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 13,
    color: theme.muted,
    marginBottom: 16,
    fontFamily: "'Times New Roman', Times, serif",
  }
};

export default function App() {
  const [izquierda, setIzquierda] = useState("");
  const [derecha, setDerecha] = useState("");
  const [resultado, setResultado] = useState(null);

  const [ecuacion, setEcuacion] = useState("");
  const [incognita, setIncognita] = useState("x");
  const [solucion, setSolucion] = useState(null);

  const [proceso, setProceso] = useState("");
  const [incognitaProceso, setIncognitaProceso] = useState("x");
  const [resultadoProceso, setResultadoProceso] = useState(null);

  const verificar = async () => {
    try {
      const res = await axios.post(`${API}/verificar`, { izquierda, derecha });
      setResultado(res.data);
    } catch {
      setResultado({ mensaje: "⚠️ Error al conectar con el servidor" });
    }
  };

  const resolver = async () => {
    try {
      const res = await axios.post(`${API}/resolver`, { ecuacion, incognita });
      setSolucion(res.data);
    } catch {
      setSolucion({ mensaje: "⚠️ Error al conectar con el servidor" });
    }
  };

  const verificarProceso = async () => {
    try {
      const res = await axios.post(`${API}/verificar-proceso`, {
        pasos: proceso,
        incognita: incognitaProceso
      });
      setResultadoProceso(res.data);
    } catch {
      setResultadoProceso({ resumen: "⚠️ Error al conectar con el servidor" });
    }
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>∑</div>
        <div>
          <h1 style={styles.title}>MathChecker</h1>
          <p style={styles.subtitle}>Verificador de cuentas matemáticas</p>
        </div>
      </div>

      <div style={styles.main}>

        {/* VERIFICAR */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ color: theme.accent }}>01</span> Verificar ecuación
          </div>
          <label style={styles.label}>Lado izquierdo</label>
          <input style={styles.input} value={izquierda} onChange={e => setIzquierda(e.target.value)} placeholder="ej: log(100, 10)" />
          <label style={styles.label}>Lado derecho</label>
          <input style={styles.input} value={derecha} onChange={e => setDerecha(e.target.value)} placeholder="ej: 2" />
          <button style={styles.btn(theme.accent)} onClick={verificar}>Verificar</button>
          {resultado && (
            <div style={styles.resultBox(resultado.correcto)}>
              <p style={{ margin: 0, fontWeight: "bold", color: resultado.correcto ? theme.success : theme.error }}>{resultado.mensaje}</p>
              {resultado.resultado_izquierda && <p style={{ margin: "8px 0 0", fontSize: 13, color: theme.muted }}>Izquierdo: <InlineMath math={resultado.resultado_izquierda} /></p>}
              {resultado.resultado_derecha && <p style={{ margin: "4px 0 0", fontSize: 13, color: theme.muted }}>Derecho: <InlineMath math={resultado.resultado_derecha} /></p>}
              {resultado.diferencia && <p style={{ margin: "4px 0 0", fontSize: 13, color: theme.error }}>Diferencia: <InlineMath math={resultado.diferencia} /></p>}
            </div>
          )}
        </div>

        {/* RESOLVER */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ color: theme.accent }}>02</span> Resolver incógnita
          </div>
          <label style={styles.label}>Ecuación igualada a 0</label>
          <input style={styles.input} value={ecuacion} onChange={e => setEcuacion(e.target.value)} placeholder="ej: x**2 - 4" />
          <label style={styles.label}>Incógnita</label>
          <input style={styles.input} value={incognita} onChange={e => setIncognita(e.target.value)} placeholder="ej: x" />
          <button style={styles.btn("#c45e10")} onClick={resolver}>Resolver</button>
          {solucion && (
            <div style={styles.resultBox(solucion.exito)}>
              <p style={{ margin: 0, fontWeight: "bold", color: solucion.exito ? theme.success : theme.error }}>{solucion.mensaje}</p>
              {solucion.soluciones && solucion.soluciones.map((s, i) => (
                <p key={i} style={{ margin: "8px 0 0", fontSize: 13, color: theme.muted }}>{incognita} = <InlineMath math={s} /></p>
              ))}
            </div>
          )}
        </div>

        {/* PROCESO */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ color: theme.accent }}>03</span> Verificar proceso completo
          </div>
          <p style={{ fontSize: 12, color: theme.muted, marginBottom: 12 }}>Una línea por paso, formato: <code style={{ color: theme.accent }}>expresión = expresión</code></p>
          <pre style={styles.pre}>{`2*x + 4 = 10\n2*x = 10 - 4\n2*x = 6\nx = 3`}</pre>
          <label style={styles.label}>Proceso</label>
          <textarea style={styles.textarea} value={proceso} onChange={e => setProceso(e.target.value)} placeholder={"2*x + 4 = 10\n2*x = 10 - 4\n2*x = 6\nx = 3"} />
          <label style={styles.label}>Incógnita</label>
          <input style={styles.input} value={incognitaProceso} onChange={e => setIncognitaProceso(e.target.value)} placeholder="ej: x" />
          <button style={styles.btn(theme.error)} onClick={verificarProceso}>Verificar proceso</button>

          {resultadoProceso && (
            <div style={{ marginTop: 16 }}>
              <div style={styles.resultBox(resultadoProceso.todos_correctos)}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: 15, color: resultadoProceso.todos_correctos ? theme.success : theme.error }}>{resultadoProceso.resumen}</p>
                {resultadoProceso.soluciones_finales && resultadoProceso.soluciones_finales.length > 0 && (
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: theme.muted }}>Solución: <InlineMath math={`${incognitaProceso} = ${resultadoProceso.soluciones_finales[0]}`} /></p>
                )}
              </div>
              <div style={{ marginTop: 12 }}>
                {resultadoProceso.resultados && resultadoProceso.resultados.map((r, i) => (
                  <div key={i} style={styles.stepBox(r.correcto)}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: "600", color: r.correcto ? theme.success : theme.error }}>
                      Paso {r.paso}: <span style={{ color: theme.text }}>{r.linea}</span>
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: theme.muted }}>{r.mensaje}</p>
                    {r.detalle && <p style={{ margin: "4px 0 0", fontSize: 12, color: theme.error }}>💡 {r.detalle}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}