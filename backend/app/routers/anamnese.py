# 📄 backend/app/routers/anamnese.py

from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.database import engine
from pydantic import BaseModel
from typing import List, Dict, Optional
from uuid import uuid4

router = APIRouter()

# 🧩 Modelo base para um bloco de perguntas dentro de um modelo de anamnese
class PerguntaModel(BaseModel):
    campo: str  # usado como chave no dicionário de respostas
    tipo: str   # 'texto', 'numero', 'checkbox', 'opcoes'
    rotulo: str

class BlocoModel(BaseModel):
    titulo: str
    perguntas: List[PerguntaModel]

# 📦 Modelo de criação de modelo de anamnese
class ModeloAnamneseCreate(BaseModel):
    nome: str
    prescritor_id: int
    blocos: List[BlocoModel]

# 📦 Estrutura de modelo salvo no banco (simples, em JSON)
class ModeloAnamnese(ModeloAnamneseCreate):
    id: str

# 📦 Modelo de resposta de anamnese preenchida
class RespostaAnamnese(BaseModel):
    atendimento_id: int
    modelo_id: str
    respostas: Dict[str, Optional[str]]

# 📂 Memória simulada (substituir depois por banco de dados real com tabelas apropriadas)
modelos_db: List[ModeloAnamnese] = []
respostas_db: List[RespostaAnamnese] = []

# ✅ Criar modelo
@router.post("/anamnese/modelos")
def criar_modelo(modelo: ModeloAnamneseCreate):
    novo_modelo = ModeloAnamnese(id=str(uuid4()), **modelo.dict())
    modelos_db.append(novo_modelo)
    return novo_modelo

# ✅ Listar modelos de um prescritor
@router.get("/anamnese/modelos/{prescritor_id}")
def listar_modelos(prescritor_id: int):
    return [m for m in modelos_db if m.prescritor_id == prescritor_id]

# ✅ Salvar resposta
@router.post("/anamnese/respostas")
def salvar_resposta(resposta: RespostaAnamnese):
    respostas_db.append(resposta)
    return {"status": "ok"}

# ✅ Buscar resposta por atendimento
@router.get("/anamnese/respostas/{atendimento_id}")
def buscar_resposta(atendimento_id: int):
    for r in respostas_db:
        if r.atendimento_id == atendimento_id:
            return r
    raise HTTPException(status_code=404, detail="Resposta não encontrada")
