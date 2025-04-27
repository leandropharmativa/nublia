# 📄 backend/app/routers/atendimentos.py

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.models import Atendimento
from app.database import engine

router = APIRouter()

# 🛠 Rota para criar atendimento
@router.post("/atendimentos/")
def criar_atendimento(atendimento: AtendimentoCreate):
    with Session(engine) as session:
        novo_atendimento = Atendimento(**atendimento.dict())
        session.add(novo_atendimento)
        session.commit()
        session.refresh(novo_atendimento)
        return novo_atendimento

# (opcional) Rota para listar todos atendimentos (para debug)
@router.get("/atendimentos/")
def listar_atendimentos():
    with Session(engine) as session:
        atendimentos = session.exec(select(Atendimento)).all()
        return atendimentos
