import { useState } from "react";
import axios from "axios";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function App() {
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
      const res = await axios.post("https://math-checker-backend.onrender.com/verificar", { izquierda, derecha });
      setResultado(res.data);
    } catch {
      setResultado({ mensaje: "⚠️ Error al conectar con el servidor" });
    }
  };

  const resolver = async () => {
    try {
      const res = await axios.post("https://math-checker-backend.onrender.com/resolver", { ecuacion, incognita });
      setSolucion(res.data);
    } catch {
      setSolucion({ mensaje: "⚠️ Error al conectar con el servidor" });
    }
  };

const verificarProceso = async () => {
    try {
      const res = await axios.post("https://math-checker-backend.onrender.com/verificar-proceso", {
        pasos: proceso,
        incognita: incognitaProceso
      });
      console.log(res.data);
      setResultadoProceso(res.data);
    } catch {
      setResultadoProceso({ resumen: "⚠️ Error al conectar con el servidor" });
    }
  };

  const cardStyle = {
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 10,
    marginBottom: 32,
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: 8,
    marginTop: 4,
    marginBottom: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    boxSizing: "border-box"
  };

  const btnStyle = (color) => ({
    padding: "10px 24px",
    fontSize: 16,
    cursor: "pointer",
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: 6
  });

  return (
    <div style={{ maxWidth: 660, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>🔢 Verificador de Cuentas Matemáticas</h1>

      {/* VERIFICAR */}
      <div style={cardStyle}>
        <h2>✅ Verificar ecuación</h2>
        <p style={{ color: "#555" }}>Ejemplos: <code>log(100, 10)</code>, <code>sqrt(16)</code>, <code>sin(pi/2)</code></p>
        <label>Lado izquierdo:</label>
        <input style={inputStyle} value={izquierda} onChange={e => setIzquierda(e.target.value)} placeholder="ej: log(100, 10)" />
        <label>Lado derecho:</label>
        <input style={inputStyle} value={derecha} onChange={e => setDerecha(e.target.value)} placeholder="ej: 2" />
        <button style={btnStyle("#4f46e5")} onClick={verificar}>Verificar</button>
        {resultado && (
          <div style={{ marginTop: 16, padding: 16, borderRadius: 8, backgroundColor: resultado.correcto ? "#d1fae5" : "#fee2e2" }}>
            <p style={{ fontWeight: "bold" }}>{resultado.mensaje}</p>
            {resultado.resultado_izquierda && <p>Izquierdo: <InlineMath math={resultado.resultado_izquierda} /></p>}
            {resultado.resultado_derecha && <p>Derecho: <InlineMath math={resultado.resultado_derecha} /></p>}
            {resultado.diferencia && <p>Diferencia: <InlineMath math={resultado.diferencia} /></p>}
          </div>
        )}
      </div>

      {/* RESOLVER */}
      <div style={cardStyle}>
        <h2>🔍 Resolver incógnita</h2>
        <p style={{ color: "#555" }}>Ingresá la ecuación igualada a cero. Ej: <code>x**2 - 4</code></p>
        <label>Ecuación (igualada a 0):</label>
        <input style={inputStyle} value={ecuacion} onChange={e => setEcuacion(e.target.value)} placeholder="ej: x**2 - 4" />
        <label>Incógnita:</label>
        <input style={inputStyle} value={incognita} onChange={e => setIncognita(e.target.value)} placeholder="ej: x" />
        <button style={btnStyle("#059669")} onClick={resolver}>Resolver</button>
        {solucion && (
          <div style={{ marginTop: 16, padding: 16, borderRadius: 8, backgroundColor: solucion.exito ? "#d1fae5" : "#fee2e2" }}>
            <p style={{ fontWeight: "bold" }}>{solucion.mensaje}</p>
            {solucion.soluciones && solucion.soluciones.map((s, i) => (
              <p key={i}>{incognita} = <InlineMath math={s} /></p>
            ))}
          </div>
        )}
      </div>

{/* PROCESO COMPLETO */}
      <div style={cardStyle}>
        <h2>📋 Verificar proceso completo</h2>
        <p style={{ color: "#555" }}>Escribí cada paso en una línea separada con el formato <code>expresión = expresión</code>. Ejemplo:</p>
        <pre style={{ backgroundColor: "#e5e7eb", padding: 10, borderRadius: 6, fontSize: 14 }}>
{`2*x + 4 = 10
2*x = 10 - 4
2*x = 6
x = 3`}
        </pre>
        <label>Proceso:</label>
        <textarea
          style={{ ...inputStyle, height: 160, resize: "vertical", fontFamily: "monospace" }}
          value={proceso}
          onChange={e => setProceso(e.target.value)}
          placeholder={"2*x + 4 = 10\n2*x = 10 - 4\n2*x = 6\nx = 3"}
        />
        <label>Incógnita:</label>
        <input style={inputStyle} value={incognitaProceso} onChange={e => setIncognitaProceso(e.target.value)} placeholder="ej: x" />
        <button style={btnStyle("#dc2626")} onClick={verificarProceso}>Verificar proceso</button>

        {resultadoProceso && (
          <div style={{ marginTop: 16 }}>
            <div style={{ padding: 16, borderRadius: 8, backgroundColor: resultadoProceso.todos_correctos ? "#d1fae5" : "#fee2e2", marginBottom: 12 }}>
              <p style={{ fontWeight: "bold", fontSize: 18 }}>{resultadoProceso.resumen}</p>
              {resultadoProceso.soluciones_finales && resultadoProceso.soluciones_finales.length > 0 && (
                <p>Solución final: <InlineMath math={`${incognitaProceso} = ${resultadoProceso.soluciones_finales[0]}`} /></p>
              )}
            </div>

            {resultadoProceso.resultados && resultadoProceso.resultados.map((r, i) => (
              <div key={i} style={{
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: r.correcto ? "#f0fdf4" : "#fff1f2",
                borderLeft: `4px solid ${r.correcto ? "#22c55e" : "#ef4444"}`
              }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>Paso {r.paso}: <code>{r.linea}</code></p>
                <p style={{ margin: "4px 0 0 0", color: "#555" }}>{r.mensaje}</p>
                {r.detalle && <p style={{ margin: "4px 0 0 0", color: "#dc2626", fontSize: 14 }}>💡 {r.detalle}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
