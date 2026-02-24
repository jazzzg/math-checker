import { useState } from "react";
import axios from "axios";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const API = "https://math-checker-backend.onrender.com";

const theme = {
  bg: "#f5f0e0",
  surface: "#ffffff",
  border: "#e8d5b0",
  accent: "#c85e0a",
  accentLight: "#f97316",
  text: "#3d2000",
  muted: "#8a6a40",
  error: "#c0392b",
  success: "#c85e0a",
};

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: theme.bg,
    color: theme.text,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    padding: "0 0 80px 0",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: `1px solid ${theme.border}`,
    padding: "16px 40px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  logoCircle: {
    width: 48,
    height: 48,
    backgroundColor: theme.accent,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.text,
    margin: 0,
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: 12,
    color: theme.muted,
    margin: 0,
  },
  hero: {
    backgroundColor: theme.bg,
    padding: "48px 40px 32px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: theme.muted,
    maxWidth: 500,
    margin: "0 auto",
  },
  main: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "32px 24px 0",
  },
  card: {
    backgroundColor: theme.surface,
    border: `1.5px solid ${theme.border}`,
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.accent,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.muted,
    display: "block",
    marginBottom: 6,
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    backgroundColor: theme.bg,
    border: `1.5px solid ${theme.border}`,
    borderRadius: 10,
    color: theme.text,
    fontSize: 14,
    fontFamily: "'Georgia', serif",
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    backgroundColor: theme.bg,
    border: `1.5px solid ${theme.border}`,
    borderRadius: 10,
    color: theme.text,
    fontSize: 14,
    fontFamily: "'Georgia', serif",
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    height: 160,
  },
  btn: (color) => ({
    padding: "11px 26px",
    backgroundColor: color,
    color: "#fff",
    border: "none",
    borderRadius: 30,
    fontSize: 13,
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  }),
  resultBox: (ok) => ({
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: ok ? "#f5f0e0" : "#fdf0e0",
    border: `1.5px solid ${ok ? "#8a5c2a" : theme.border}`,
  }),
  stepBox: (ok) => ({
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: ok ? "#f5f0e0" : "#fdf0e0",
    borderLeft: `4px solid ${ok ? "#8a5c2a" : theme.accent}`,
  }),
  pre: {
    backgroundColor: theme.bg,
    border: `1.5px solid ${theme.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 13,
    color: theme.muted,
    marginBottom: 16,
    fontFamily: "'Georgia', serif",
  }
};

const simbolos = [
  {
    seccion: "Operaciones básicas",
    items: [
      { codigo: "x + y", desc: "Suma" },
      { codigo: "x - y", desc: "Resta" },
      { codigo: "x * y", desc: "Multiplicación" },
      { codigo: "x / y", desc: "División" },
      { codigo: "x**2", desc: "Potencia (x²)" },
      { codigo: "x**n", desc: "Potencia n-ésima" },
    ]
  },
  {
    seccion: "Raíces",
    items: [
      { codigo: "sqrt(x)", desc: "Raíz cuadrada (√x)" },
      { codigo: "root(x, 3)", desc: "Raíz cúbica (∛x)" },
      { codigo: "root(x, n)", desc: "Raíz n-ésima" },
    ]
  },
  {
    seccion: "Logaritmos",
    items: [
      { codigo: "log(x)", desc: "Logaritmo natural" },
      { codigo: "log(x, 10)", desc: "Log base 10" },
      { codigo: "log(x, 2)", desc: "Log base 2" },
    ]
  },
  {
    seccion: "Trigonometría",
    items: [
      { codigo: "sin(x)", desc: "Seno" },
      { codigo: "cos(x)", desc: "Coseno" },
      { codigo: "tan(x)", desc: "Tangente" },
      { codigo: "pi", desc: "π = 3.14159..." },
      { codigo: "E", desc: "e = 2.71828..." },
    ]
  },
  {
    seccion: "Otros",
    items: [
      { codigo: "abs(x)", desc: "Valor absoluto" },
      { codigo: "factorial(n)", desc: "Factorial" },
      { codigo: "oo", desc: "Infinito" },
    ]
  },
];


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

  const [funcion, setFuncion] = useState("");
  const [variableFuncion, setVariableFuncion] = useState("x");
  const [inversaResult, setInversaResult] = useState(null);

  const [funcionTransf, setFuncionTransf] = useState("");
  const [transformacion, setTransformacion] = useState("");
  const [variableTransf, setVariableTransf] = useState("x");
  const [transfResult, setTransfResult] = useState(null);

  const [funcionesGrafico, setFuncionesGrafico] = useState ([]);
  const [nuevaFuncion, setNuevaFuncion] = useState ("")

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

  const calcularInversa = async () => {
    try {
      const res = await axios.post(`${API}/inversa`, { funcion, variable: variableFuncion });
      setInversaResult(res.data);
    } catch {
      setInversaResult({ mensaje: "⚠️ Error al conectar con el servidor" });
    }
  };

  const calcularTransformacion = async () => {
    try {
      const res = await axios.post(`${API}/transformar`, { funcion: funcionTransf, transformacion, variable: variableTransf });
      setTransfResult(res.data);
    } catch {
      setTransfResult({ mensaje: "⚠️ Error al conectar con el servidor" });
    }
  };

  const agregarFuncionesGrafico = () => {
    if (nuevaFuncion.trim()) {
      setFuncionesGrafico([...funcionesGrafico, nuevaFuncion.trim()]);
      setNuevaFuncion("");
    }
  };

  const eliminarfuncionGrafico = (index) => {
    setFuncionesGrafico(funcionesGrafico.filter((_, i) => i !==index));
  };
}


  return (
    <div style={styles.app}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoCircle}>∑</div>
        <div>
          <h1 style={styles.title}>MathChecker</h1>
          <p style={styles.subtitle}>Verificador de cuentas matemáticas</p>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Verificá tus cuentas matemáticas</h2>
        <p style={styles.heroSub}>Ingresá ecuaciones, resolvé incógnitas y verificá procesos paso a paso con detección automática de errores.</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 0", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* COLUMNA PRINCIPAL */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* VERIFICAR */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <div style={styles.cardIcon}>✅</div>
              Verificar ecuación
            </div>
            <label style={styles.label}>Lado izquierdo</label>
            <input style={styles.input} value={izquierda} onChange={e => setIzquierda(e.target.value)} placeholder="ej: log(100, 10)" />
            <label style={styles.label}>Lado derecho</label>
            <input style={styles.input} value={derecha} onChange={e => setDerecha(e.target.value)} placeholder="ej: 2" />
            <button style={styles.btn(theme.accent)} onClick={verificar}>Verificar</button>
            {resultado && (
              <div style={styles.resultBox(resultado.correcto)}>
                <p style={{ margin: 0, fontWeight: "bold", color: resultado.correcto ? theme.success : theme.error }}>{resultado.mensaje}</p>
                {resultado.resultado_izquierda && <p style={{ margin: "8px 0 0", fontSize: 13 }}>Izquierdo: <InlineMath math={resultado.resultado_izquierda} /></p>}
                {resultado.resultado_derecha && <p style={{ margin: "4px 0 0", fontSize: 13 }}>Derecho: <InlineMath math={resultado.resultado_derecha} /></p>}
                {resultado.diferencia && <p style={{ margin: "4px 0 0", fontSize: 13, color: theme.error }}>Diferencia: <InlineMath math={resultado.diferencia} /></p>}
              </div>
            )}
          </div>

          {/* RESOLVER */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <div style={styles.cardIcon}>🔍</div>
              Resolver incógnita
            </div>
            <label style={styles.label}>Ecuación igualada a 0</label>
            <input style={styles.input} value={ecuacion} onChange={e => setEcuacion(e.target.value)} placeholder="ej: x**2 - 4" />
            <label style={styles.label}>Incógnita</label>
            <input style={styles.input} value={incognita} onChange={e => setIncognita(e.target.value)} placeholder="ej: x" />
            <button style={styles.btn(theme.accentLight)} onClick={resolver}>Resolver</button>
            {solucion && (
              <div style={styles.resultBox(solucion.exito)}>
                <p style={{ margin: 0, fontWeight: "bold", color: solucion.exito ? theme.success : theme.error }}>{solucion.mensaje}</p>
                {solucion.soluciones && solucion.soluciones.map((s, i) => (
                  <p key={i} style={{ margin: "8px 0 0", fontSize: 13 }}>{incognita} = <InlineMath math={s} /></p>
                ))}
              </div>
            )}
          </div>

          {/* PROCESO */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <div style={styles.cardIcon}>📋</div>
              Verificar proceso completo
            </div>
            <p style={{ fontSize: 12, color: theme.muted, marginBottom: 12, fontWeight:"600" }}>Una línea por paso, formato: <code style={{ color: theme.accent }}>expresión = expresión</code></p>
            <pre style={styles.pre}>{`2*x + 4 = 10\n2*x = 10 - 4\n2*x = 6\nx = 3`}</pre>
            <label style={styles.label}>Proceso</label>
            <textarea style={styles.textarea} value={proceso} onChange={e => setProceso(e.target.value)} placeholder={"2*x + 4 = 10\n2*x = 10 - 4\n2*x = 6\nx = 3"} />
            <label style={styles.label}>Incógnita</label>
            <input style={styles.input} value={incognitaProceso} onChange={e => setIncognitaProceso(e.target.value)} placeholder="ej: x" />
            <button style={styles.btn(theme.accent)} onClick={verificarProceso}>Verificar proceso</button>

            {resultadoProceso && (
              <div style={{ marginTop: 16 }}>
                <div style={styles.resultBox(resultadoProceso.todos_correctos)}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: 15, color: resultadoProceso.todos_correctos ? theme.success : theme.error }}>{resultadoProceso.resumen}</p>
                  {resultadoProceso.soluciones_finales && resultadoProceso.soluciones_finales.length > 0 && (
                    <p style={{ margin: "8px 0 0", fontSize: 13 }}>Solución: <InlineMath math={`${incognitaProceso} = ${resultadoProceso.soluciones_finales[0]}`} /></p>
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

          {/* INVERSA */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <div style={styles.cardIcon}>🔄</div>
              Inversa de una función
            </div>
            <p style={{ fontSize: 12, color: theme.muted, marginBottom: 12, fontWeight: "600" }}>Ingresá f(x) y calculamos f⁻¹(x). Ej: <code style={{ color: theme.accent }}>(3*x + 4) / 7</code></p>
            <label style={styles.label}>f(x)</label>
            <input style={styles.input} value={funcion} onChange={e => setFuncion(e.target.value)} placeholder="ej: (3*x + 4) / 7" />
            <label style={styles.label}>Variable</label>
            <input style={styles.input} value={variableFuncion} onChange={e => setVariableFuncion(e.target.value)} placeholder="x" />
            <button style={styles.btn(theme.accent)} onClick={calcularInversa}>Calcular inversa</button>
            {inversaResult && (
              <div style={styles.resultBox(inversaResult.exito)}>
                <p style={{ margin: 0, fontWeight: "bold", color: inversaResult.exito ? theme.success : theme.error }}>{inversaResult.mensaje}</p>
                {inversaResult.pasos && (
                  <div style={{ marginTop: 12 }}>
                    {inversaResult.pasos.map((paso, i) => (
                      <div key={i} style={{ padding: "6px 10px", borderLeft: `3px solid ${theme.accent}`, marginBottom: 6, backgroundColor: theme.bg, borderRadius: 4 }}>
                        <p style={{ margin: 0, fontSize: 13, color: theme.text }}>{paso}</p>
                      </div>
                    ))}
                  </div>
                )}
                {inversaResult.inversas && inversaResult.inversas.map((inv, i) => (
                  <p key={i} style={{ margin: "8px 0 0", fontSize: 14, fontWeight: "bold", color: theme.accent }}>f⁻¹(x) = <InlineMath math={inv} /></p>
                ))}
              </div>
            )}
          </div>

          {/* TRANSFORMACIONES */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <div style={styles.cardIcon}>📐</div>
              Transformaciones de funciones
            </div>
            <p style={{ fontSize: 12, color: theme.muted, marginBottom: 12, fontWeight: "600" }}>Ingresá f(x) y la transformación a aplicar. Ej: f(x) = <code style={{ color: theme.accent }}>x**2 + 2</code>, transformación: <code style={{ color: theme.accent }}>3*x</code> → calcula f(3x)</p>
            <label style={styles.label}>f(x)</label>
            <input style={styles.input} value={funcionTransf} onChange={e => setFuncionTransf(e.target.value)} placeholder="ej: x**2 + 2" />
            <label style={styles.label}>Transformación (reemplaza x por)</label>
            <input style={styles.input} value={transformacion} onChange={e => setTransformacion(e.target.value)} placeholder="ej: 3*x" />
            <label style={styles.label}>Variable</label>
            <input style={styles.input} value={variableTransf} onChange={e => setVariableTransf(e.target.value)} placeholder="x" />
            <button style={styles.btn(theme.accentLight)} onClick={calcularTransformacion}>Calcular transformación</button>
            {transfResult && (
              <div style={styles.resultBox(transfResult.exito)}>
                <p style={{ margin: 0, fontWeight: "bold", color: transfResult.exito ? theme.success : theme.error }}>{transfResult.mensaje}</p>
                {transfResult.resultado && (
                  <p style={{ margin: "8px 0 0", fontSize: 13 }}>Resultado: <InlineMath math={transfResult.resultado} /></p>
                )}
              </div>
            )}
          </div>

          {/* GRAFICADOR */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <div style={styles.cardIcon}>📈</div>
              Graficador de funciones
            </div>
            <p style={{ fontSize: 12, color: theme.muted, marginBottom: 12, fontWeight: "600" }}>
              Ingresá funciones para graficar. Usá la sintaxis de GeoGebra: <code style={{ color: theme.accent }}>x^2 + 2</code>, <code style={{ color: theme.accent }}>sqrt(x)</code>
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                value={nuevaFuncion}
                onChange={e => setNuevaFuncion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && agregarFuncionGrafico()}
                placeholder="ej: x^2 + 2"
              />
              <button style={styles.btn(theme.accent)} onClick={agregarFuncionGrafico}>Agregar</button>
            </div>
            {funcionesGrafico.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {funcionesGrafico.map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", backgroundColor: theme.bg, borderRadius: 6, marginBottom: 4, border: `1px solid ${theme.border}` }}>
                    <code style={{ color: theme.accent, fontSize: 13 }}>{f}</code>
                    <button onClick={() => eliminarFuncionGrafico(i)} style={{ background: "none", border: "none", color: theme.error, cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1.5px solid ${theme.border}` }}>
              <iframe
                src={`https://www.geogebra.org/graphing?lang=es`}
                width="100%"
                height="500px"
                style={{ border: "none", display: "block" }}
                title="GeoGebra Graficador"
              />
            </div>
            {funcionesGrafico.length > 0 && (
              <p style={{ fontSize: 11, color: theme.muted, marginTop: 8 }}>
                💡 Ingresá estas funciones directamente en GeoGebra: {funcionesGrafico.join(", ")}
              </p>
            )}
          </div>

        </div>

        {/* COLUMNA LATERAL */}
        <div style={{ width: 260, flexShrink: 0, minWidth:"100%", maxWidth:260 }}>
          <div style={{ backgroundColor: theme.surface, border: `1.5px solid ${theme.border}`, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 24 }}>
            <div style={{ fontSize: 14, fontWeight: "800", color: theme.accent, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${theme.border}` }}>📖 Referencia de símbolos</div>
            {simbolos.map((seccion, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: "700", color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{seccion.seccion}</div>
                {seccion.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <code style={{ backgroundColor: "#fff3e0", color: theme.accent, padding: "2px 7px", borderRadius: 5, fontFamily: "monospace", fontSize: 12, fontWeight: "600" }}>{item.codigo}</code>
                    <span style={{ color: theme.muted, fontSize: 12 }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
