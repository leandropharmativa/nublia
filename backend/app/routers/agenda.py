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
    horario_antigo = session.get(Agendamento, dados.de_id)
    novo_horario = session.get(Agendamento, dados.para_id)

    if not horario_antigo or not novo_horario:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado.")

    if novo_horario.status != "disponivel":
        raise HTTPException(status_code=400, detail="O novo horário já está agendado ou indisponível.")

    # Transferir paciente
    novo_horario.paciente_id = horario_antigo.paciente_id
    novo_horario.status = "agendado"

    # Remover paciente do horário antigo
    horario_antigo.paciente_id = None
    horario_antigo.status = "disponivel"

    session.add(novo_horario)
    session.add(horario_antigo)
    session.commit()
    session.refresh(novo_horario)

    return novo_horario

