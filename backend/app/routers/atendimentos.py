# 📄 backend/app/routers/atendimentos.py

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.models import Atendimento, AtendimentoCreate
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

# 🛠 Rota para listar todos os atendimentos (debug)
@router.get("/atendimentos/")
def listar_atendimentos():
    with Session(engine) as session:
        atendimentos = session.exec(select(Atendimento)).all()
        return atendimentos

# 🛠 Rota para atualizar um atendimento existente
@router.put("/atendimentos/{atendimento_id}")
def atualizar_atendimento(atendimento_id: int, atendimento: AtendimentoCreate):
    with Session(engine) as session:
        db_atendimento = session.get(Atendimento, atendimento_id)
        if not db_atendimento:
            raise HTTPException(status_code=404, detail="Atendimento não encontrado.")

        # Atualizar campos
        for key, value in atendimento.dict().items():
            setattr(db_atendimento, key, value)

        session.add(db_atendimento)
        session.commit()
        session.refresh(db_atendimento)
        return db_atendimento

# ✅ Rota para buscar atendimento por agendamento_id
@router.get("/atendimentos/por-agendamento/{agendamento_id}")
def buscar_por_agendamento(agendamento_id: int):
    with Session(engine) as session:
        atendimento = session.exec(
            select(Atendimento).where(Atendimento.agendamento_id == agendamento_id)
        ).first()
        if not atendimento:
            raise HTTPException(status_code=404, detail="Atendimento não encontrado.")
        return atendimento

