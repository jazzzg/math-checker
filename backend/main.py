from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sympy import sympify, simplify, solve, symbols, SympifyError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://math-checker-mocha.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Expresion(BaseModel):
    izquierda: str
    derecha: str

class Ecuacion(BaseModel):
    ecuacion: str
    incognita: str

class Proceso(BaseModel):
    pasos: str
    incognita: str

def parsear_paso(paso: str):
    if "=" in paso:
        partes = paso.split("=")
        if len(partes) == 2:
            return partes[0].strip(), partes[1].strip()
    return None, None

@app.post("/verificar")
def verificar(expr: Expresion):
    try:
        izq = sympify(expr.izquierda)
        der = sympify(expr.derecha)
        diferencia = simplify(izq - der)
        
        if diferencia == 0:
            return {
                "correcto": True,
                "mensaje": "✅ La ecuación es correcta",
                "resultado_izquierda": str(izq),
                "resultado_derecha": str(der)
            }
        else:
            return {
                "correcto": False,
                "mensaje": "❌ La ecuación tiene un error",
                "resultado_izquierda": str(izq),
                "resultado_derecha": str(der),
                "diferencia": str(diferencia)
            }
    except SympifyError:
        return {
            "correcto": False,
            "mensaje": "⚠️ La expresión ingresada no es válida"
        }

@app.post("/resolver")
def resolver(data: Ecuacion):
    try:
        incognita = symbols(data.incognita)
        ecuacion = sympify(data.ecuacion)
        soluciones = solve(ecuacion, incognita)

        if not soluciones:
            return {
                "exito": False,
                "mensaje": "⚠️ No se encontraron soluciones"
            }

        return {
            "exito": True,
            "mensaje": "✅ Solución encontrada",
            "soluciones": [str(s) for s in soluciones]
        }
    except SympifyError:
        return {
            "exito": False,
            "mensaje": "⚠️ La expresión ingresada no es válida"
        }


@app.post("/verificar-proceso")
def verificar_proceso(data: Proceso):
    lineas = [l.strip() for l in data.pasos.strip().split("\n") if l.strip()]
    incognita = symbols(data.incognita)
    resultados = []
    primer_error = None  # índice del primer paso con error

    for i, linea in enumerate(lineas):
        izq_str, der_str = parsear_paso(linea)

        if izq_str is None:
            resultados.append({
                "paso": i + 1,
                "linea": linea,
                "correcto": False,
                "mensaje": "⚠️ Formato inválido, usá 'expresión = expresión'",
                "detalle": "",
                "izq_str": "",
                "der_str": ""
            })
            if primer_error is None:
                primer_error = i
            continue

        # Si ya hubo un error antes, marcar este paso como no verificable
        if primer_error is not None:
            resultados.append({
                "paso": i + 1,
                "linea": linea,
                "correcto": False,
                "mensaje": "⚠️ No se puede verificar este paso porque hay un error anterior",
                "detalle": f"Corregí el paso {primer_error + 1} primero.",
                "izq_str": izq_str if izq_str else "",
                "der_str": der_str if der_str else ""
            })
            continue

        try:
            izq = sympify(izq_str)
            der = sympify(der_str)

            if i == 0:
                paso_correcto = True
                mensaje = "✅ Paso inicial registrado"
                detalle = ""
            else:
                izq_ant = sympify(resultados[i-1]["izq_str"])
                der_ant = sympify(resultados[i-1]["der_str"])

                eq_anterior = izq_ant - der_ant
                eq_actual = izq - der

                try:
                    sols_ant = solve(eq_anterior, incognita)
                    sols_act = solve(eq_actual, incognita)

                    if sols_ant and sols_act:
                        paso_correcto = set(str(s) for s in sols_ant) == set(str(s) for s in sols_act)
                    else:
                        diferencia = simplify(eq_anterior - eq_actual)
                        paso_correcto = diferencia == 0

                    if paso_correcto:
                        mensaje = "✅ Paso correcto"
                        detalle = ""
                    else:
                        mensaje = "❌ Este paso tiene un error"

                        if sols_ant and sols_act:
                            vals_ant = ", ".join(str(s) for s in sols_ant)
                            vals_act = ", ".join(str(s) for s in sols_act)
                            # Evaluar numéricamente el lado derecho del paso anterior
                            try:
                                valor_correcto = sympify(resultados[i-1]["der_str"])
                                valor_ingresado = sympify(der_str)
                                detalle = f"El lado derecho debería ser {valor_correcto} pero pusiste {valor_ingresado}. La solución correcta es {incognita} = {vals_ant}, no {incognita} = {vals_act}."
                            except:
                                detalle = f"La solución correcta es {incognita} = {vals_ant}, pero este paso da {incognita} = {vals_act}."
                        else:
                            diff_izq = simplify(izq - izq_ant)
                            diff_der = simplify(der - der_ant)

                            if diff_izq != 0 and diff_der == 0:
                                detalle = f"El lado izquierdo cambió incorrectamente. Pusiste '{izq}' pero debería ser equivalente a '{izq_ant}'."
                            elif diff_der != 0 and diff_izq == 0:
                                detalle = f"El lado derecho cambió incorrectamente. Pusiste '{der}' pero debería ser equivalente a '{der_ant}'."
                            else:
                                try:
                                    sugerencia = solve(eq_anterior, incognita)
                                    if sugerencia:
                                        detalle = f"La solución correcta es {incognita} = {sugerencia[0]}, pero este paso no es equivalente al anterior."
                                    else:
                                        detalle = "Este paso no es equivalente al anterior. Revisá la operación que aplicaste."
                                except:
                                    detalle = "Este paso no es equivalente al anterior. Revisá la operación que aplicaste."

                except:
                    paso_correcto = False
                    mensaje = "⚠️ No se pudo verificar este paso"
                    detalle = ""

            if not paso_correcto and primer_error is None:
                primer_error = i

            resultados.append({
                "paso": i + 1,
                "linea": linea,
                "correcto": paso_correcto,
                "izq_str": izq_str,
                "der_str": der_str,
                "mensaje": mensaje,
                "detalle": detalle
            })

        except SympifyError:
            resultados.append({
                "paso": i + 1,
                "linea": linea,
                "correcto": False,
                "mensaje": "⚠️ Expresión inválida en este paso",
                "detalle": "Revisá que la sintaxis sea correcta. Usá ** para potencias, * para multiplicación.",
                "izq_str": "",
                "der_str": ""
            })
            if primer_error is None:
                primer_error = i

    todos_correctos = all(r["correcto"] for r in resultados)

    soluciones = []
    if resultados and primer_error is None:
        ultimo = resultados[-1]
        if ultimo["izq_str"] and ultimo["der_str"]:
            try:
                izq_final = sympify(ultimo["izq_str"])
                der_final = sympify(ultimo["der_str"])
                soluciones = solve(izq_final - der_final, incognita)
                if not soluciones:
                    soluciones = [der_final] if izq_final == incognita else []
            except:
                soluciones = []

    return {
        "resultados": resultados,
        "todos_correctos": todos_correctos,
        "resumen": "✅ Todo el proceso es correcto" if todos_correctos else "❌ Hay errores en el proceso",
        "soluciones_finales": [str(s) for s in soluciones]
    }
  