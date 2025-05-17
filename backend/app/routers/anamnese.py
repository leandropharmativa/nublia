# 📄 backend/app/routers/anamnese.py

from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.database import engine
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.models import ModeloAnamnese, RespostaAnamnese as RespostaAnamneseDB
from uuid import uuid4
import json

router = APIRouter()

# 🧩 Modelo base para perguntas
class PerguntaModel(BaseModel):
    campo: str
    tipo: str
    rotulo: str

class BlocoModel(BaseModel):
    titulo: str
    perguntas: List[PerguntaModel]

# 📦 Criar modelo de anamnese
class ModeloAnamneseCreate(BaseModel):
    nome: str
    prescritor_id: int
    blocos: List[BlocoModel]

# 📦 Criar resposta de anamnese
class RespostaAnamneseCreate(BaseModel):
    atendimento_id: int
    modelo_id: str
    respostas: Dict[str, Optional[str]]

# ✅ Criar modelo
@router.post("/anamnese/modelos")
def criar_modelo(modelo: ModeloAnamneseCreate):
    novo = ModeloAnamnese(id=str(uuid4()), **modelo.dict())
    with Session(engine) as session:
        session.add(novo)
        session.commit()
        session.refresh(novo)
        return novo

# ✅ Listar modelos por prescritor (incluindo padrão)
@router.get("/anamnese/modelos/{prescritor_id}")
def listar_modelos(prescritor_id: int):
    with Session(engine) as session:
        stmt = select(ModeloAnamnese).where(
            (ModeloAnamnese.prescritor_id == prescritor_id) |
            (ModeloAnamnese.prescritor_id == 0)
        )
        modelos = session.exec(stmt).all()
        return modelos

# ✅ Salvar resposta
@router.post("/anamnese/respostas")
def salvar_resposta(resposta: RespostaAnamneseCreate):
    nova = RespostaAnamneseDB(**resposta.dict())
    with Session(engine) as session:
        session.add(nova)
        session.commit()
        session.refresh(nova)
        return {"status": "ok", "id": nova.id}

# ✅ Buscar resposta por atendimento
@router.get("/anamnese/respostas/{atendimento_id}")
def buscar_resposta(atendimento_id: int):
    with Session(engine) as session:
        stmt = select(RespostaAnamneseDB).where(RespostaAnamneseDB.atendimento_id == atendimento_id)
        resultado = session.exec(stmt).first()
        if not resultado:
            raise HTTPException(status_code=404, detail="Resposta não encontrada")
        return resultado

@router.delete("/anamnese/modelos/{modelo_id}")
def excluir_modelo(modelo_id: str):
    with Session(engine) as session:
        modelo = session.get(ModeloAnamnese, modelo_id)
        if not modelo:
            raise HTTPException(status_code=404, detail="Modelo não encontrado")
        session.delete(modelo)
        session.commit()
        return {"ok": True}

# ✅ Atualizar modelo existente
@router.put("/anamnese/modelos/{modelo_id}")
def atualizar_modelo(modelo_id: str, modelo: ModeloAnamneseCreate):
    with Session(engine) as session:
        existente = session.get(ModeloAnamnese, modelo_id)
        if not existente:
            raise HTTPException(status_code=404, detail="Modelo não encontrado")
        existente.nome = modelo.nome
        existente.prescritor_id = modelo.prescritor_id
        existente.blocos = json.dumps(modelo.blocos)  # ✅ conversão necessária
        session.add(existente)
        session.commit()
        session.refresh(existente)
        return existente



