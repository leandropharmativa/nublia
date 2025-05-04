from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import date
from pydantic import BaseModel
import traceback 

from app.database import get_session
from app.models import Agendamento, User  # ✅ Correção aqui

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
    de_id: int
    para_id: int

class TrocarPacienteRequest(BaseModel):
    id: int
    novo_paciente_id: int

# ✅ Criar horário disponível
@router.post("/disponibilizar", response_model=Agendamento)
def disponibilizar_horario(agendamento: Agendamento, session: Session = Depends(get_session)):
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

# ✅ Listar agenda de um prescritor (com nome do paciente incluso)
@router.get("/prescritor/{prescritor_id}")
def listar_agenda_prescritor(prescritor_id: int, session: Session = Depends(get_session)):
    result = session.exec(select(Agendamento).where(Agendamento.prescritor_id == prescritor_id)).all()

    agendamentos_com_nome = []
    for ag in result:
        paciente_nome = None
        if ag.paciente_id:
            paciente = session.get(User, ag.paciente_id)  # ✅ Correção aqui
            paciente_nome = paciente.name if paciente else None

        agendamento_dict = ag.dict()
        agendamento_dict["paciente_nome"] = paciente_nome
        agendamentos_com_nome.append(agendamento_dict)

    return agendamentos_com_nome

@router.get("/prescritor-com-pacientes/{prescritor_id}")
def listar_agendamentos_com_pacientes(prescritor_id: int, session: Session = Depends(get_session)):
    try:
        agendamentos = session.exec(
            select(Agendamento).where(Agendamento.prescritor_id == prescritor_id)
        ).all()

        resultado = []
        for ag in agendamentos:
            if ag.paciente_id:
                paciente = session.get(User, ag.paciente_id)
                if paciente:
                    resultado.append({
                        "id": ag.id,
                        "inicio": ag.inicio,
                        "status": ag.status,
                        "paciente_id": ag.paciente_id,
                        "paciente": {
                            "id": paciente.id,
                            "name": paciente.name,
                            "email": paciente.email
                        }
                    })

        return resultado

    except Exception as e:
        import traceback
        print("❌ Erro interno no endpoint /prescritor-com-pacientes:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Erro interno ao listar agendamentos.")


# ✅ Agendar horário existente
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

# ✅ Desagendar (remover paciente do horário)
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

# ✅ Reagendar (trocar de horário)
@router.post("/reagendar", response_model=Agendamento)
def reagendar_horario(dados: ReagendarRequest, session: Session = Depends(get_session)):
    horario_antigo = session.get(Agendamento, dados.de_id)
    novo_horario = session.get(Agendamento, dados.para_id)

    if not horario_antigo or not novo_horario:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado.")
    if novo_horario.status != "disponivel":
        raise HTTPException(status_code=400, detail="O novo horário já está agendado ou indisponível.")

    novo_horario.paciente_id = horario_antigo.paciente_id
    novo_horario.status = "agendado"
    horario_antigo.paciente_id = None
    horario_antigo.status = "disponivel"

    session.add(novo_horario)
    session.add(horario_antigo)
    session.commit()
    session.refresh(novo_horario)
    return novo_horario

# ✅ Trocar paciente de um agendamento já agendado
@router.post("/trocar-paciente", response_model=Agendamento)
def trocar_paciente(dados: TrocarPacienteRequest, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, dados.id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado.")
    if agendamento.status != "agendado":
        raise HTTPException(status_code=400, detail="Esse horário não está agendado.")

    agendamento.paciente_id = dados.novo_paciente_id
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento
