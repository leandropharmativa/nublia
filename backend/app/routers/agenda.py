from fastapi import APIRouter
from sqlmodel import Session, select
from app.models import Agendamento, AgendamentoCreate
from app.database import engine

router = APIRouter()

# Rota para criar um novo agendamento
@router.post("/agenda/")
def create_agendamento(agendamento: AgendamentoCreate):
    with Session(engine) as session:
        novo_agendamento = Agendamento.from_orm(agendamento)
        session.add(novo_agendamento)
        session.commit()
        session.refresh(novo_agendamento)
        return {"message": "Agendamento criado com sucesso!", "id": novo_agendamento.id}

# Rota para listar todos os agendamentos
@router.get("/agenda/")
def list_agendamentos():
    with Session(engine) as session:
        return session.exec(select(Agendamento)).all()
