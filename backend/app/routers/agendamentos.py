from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Agendamento, AgendamentoCreate

router = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"],
)

# 🔵 Criar um novo agendamento
@router.post("/novo", response_model=Agendamento)
def criar_agendamento(agendamento: AgendamentoCreate, session: Session = Depends(get_session)):
    novo_agendamento = Agendamento.from_orm(agendamento)
    session.add(novo_agendamento)
    session.commit()
    session.refresh(novo_agendamento)
    return novo_agendamento

# 🔵 Buscar agendamentos por usuário (paciente ou prescritor)
@router.get("/usuario/{user_id}", response_model=list[Agendamento])
def listar_agendamentos(user_id: int, session: Session = Depends(get_session)):
    query = select(Agendamento).where(
        (Agendamento.prescritor_id == user_id) | (Agendamento.paciente_id == user_id)
    )
    agendamentos = session.exec(query).all()
    return agendamentos

# 🔵 Cancelar (deletar) um agendamento
@router.delete("/{agendamento_id}")
def deletar_agendamento(agendamento_id: int, session: Session = Depends(get_session)):
    agendamento = session.get(Agendamento, agendamento_id)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado.")
    
    session.delete(agendamento)
    session.commit()
    return {"ok": True, "message": "Agendamento cancelado com sucesso."}
