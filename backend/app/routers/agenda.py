# backend/app/routers/agenda.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import date
from pydantic import BaseModel

from app.database import get_session
from app.models import Agendamento

router = APIRouter(prefix="/agenda", tags=["Agenda"])

# 📦 Modelos de entrada
class AgendarHorarioRequest(BaseModel):
    id: int
    paciente_id: int

class RemoverAgendamentoRequest(BaseModel):
    id: int

class DesagendarRequest(BaseModel):
    id: int

class ReagendarRequest(BaseModel):
    de_id: int  # ID do horário atual
    para_id: int  # ID do novo horário (disponível)

# ✅ Criar horário disponível
@router.post("/disponibilizar", response_model=Agendamento)
def disponibilizar_horario(agendamento: Agendamento, session: Session = Depends(get_session)):
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

# ✅ Listar agenda de um prescritor
@router.get("/prescritor/{prescritor_id}", response_model=List[Agendamento])
def listar_agenda_prescritor(prescritor_id: int, session: Session = Depends(get_session)):
    result = session.exec(select(Agendamento).where(Agendamento.prescritor_id == prescritor_id))
    return result.all()

# ✅ Agendar horário existente (define paciente_id e muda status)
@router.post("/agendar", response_model=Agendamento)
def agendar_horario(dados: AgendarHorarioRequest, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, dados.id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Horário não encontrado")

    if agendamento.status != "disponivel":
        raise HTTPException(status_code=400, detail="Horário já está agendado")

    agendamento.paciente_id = dados.paciente_id
    agendamento.status = "agendado"
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

# ✅ Remover horário da agenda
@router.post("/remover", response_model=bool)
def remover_agendamento(dados: RemoverAgendamentoRequest, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, dados.id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    session.delete(agendamento)
    session.commit()
    return True

@router.post("/desagendar", response_model=Agendamento)
def desagendar_horario(dados: DesagendarRequest, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, dados.id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    agendamento.paciente_id = None
    agendamento.status = "disponivel"
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

@router.post("/reagendar", response_model=Agendamento)
def reagendar_horario(dados: ReagendarRequest, session: Session = Depends(get_session)):
    agendamento_atual = session.get(Agendamento, dados.de_id)
    agendamento_novo = session.get(Agendamento, dados.para_id)

    if not agendamento_atual or not agendamento_novo:
        raise HTTPException(status_code=404, detail="Agendamento(s) não encontrado(s)")

    if agendamento_novo.status != "disponivel":
        raise HTTPException(status_code=400, detail="Novo horário não está disponível")

    agendamento_novo.paciente_id = agendamento_atual.paciente_id
    agendamento_novo.status = "agendado"

    agendamento_atual.paciente_id = None
    agendamento_atual.status = "disponivel"

    session.add(agendamento_atual)
    session.add(agendamento_novo)
    session.commit()
    session.refresh(agendamento_novo)

    return agendamento_novo

