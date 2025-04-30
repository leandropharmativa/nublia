# backend/app/routers/agenda.py

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Agendamento
from typing import List
from datetime import date

router = APIRouter(prefix="/agenda", tags=["Agenda"])

@router.post("/disponibilizar", response_model=Agendamento)
def disponibilizar_horario(agendamento: Agendamento, session: Session = Depends(get_session)):
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

@router.get("/prescritor/{prescritor_id}", response_model=List[Agendamento])
def listar_agenda_prescritor(prescritor_id: int, session: Session = Depends(get_session)):
    result = session.exec(select(Agendamento).where(Agendamento.prescritor_id == prescritor_id))
    return result.all()

@router.post("/agendar", response_model=Agendamento)
def agendar_horario(id: int, paciente_id: int, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, id)
    if not agendamento or agendamento.status != "disponivel":
        raise HTTPException(status_code=400, detail="Horário indisponível")
    agendamento.paciente_id = paciente_id
    agendamento.status = "agendado"
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

@router.post("/remover", response_model=bool)
def remover_agendamento(id: int, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    session.delete(agendamento)
    session.commit()
    return True

