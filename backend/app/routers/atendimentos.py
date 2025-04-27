# 📄 backend/app/routers/atendimentos.py

from fastapi import APIRouter, HTTPException
from sqlmodel import Session
from app.models import Atendimento
from app.database import engine

router = APIRouter()

@router.post("/atendimentos/")
def criar_atendimento(atendimento: Atendimento):
    with Session(engine) as session:
        session.add(atendimento)
        session.commit()
        session.refresh(atendimento)
        return atendimento
