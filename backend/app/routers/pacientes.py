from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.models import Paciente, PacienteCreate
from app.database import engine

router = APIRouter()

# Rota para registrar novo paciente
@router.post("/pacientes/")
def create_paciente(paciente: PacienteCreate):
    with Session(engine) as session:
        novo_paciente = Paciente.from_orm(paciente)
        session.add(novo_paciente)
        session.commit()
        session.refresh(novo_paciente)
        return {"message": "Paciente cadastrado com sucesso!", "id": novo_paciente.id}

# Rota para listar todos os pacientes cadastrados
@router.get("/pacientes/")
def list_pacientes():
    with Session(engine) as session:
        return session.exec(select(Paciente)).all()

@router.get("/pacientes/{paciente_id}")
def get_paciente(paciente_id: int):
    with Session(engine) as session:
        paciente = session.get(Paciente, paciente_id)
        if not paciente:
            raise HTTPException(status_code=404, detail="Paciente não encontrado.")
        return paciente
