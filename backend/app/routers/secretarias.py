from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import Secretaria
from passlib.hash import bcrypt

router = APIRouter(prefix="/secretarias", tags=["Secretarias"])

@router.post("/")
def criar_secretaria(nome: str, email: str, senha: str, prescritor_id: int, session: Session = Depends(get_session)):
    existente = session.exec(select(Secretaria).where(Secretaria.email == email)).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")

    nova = Secretaria(
        nome=nome,
        email=email,
        senha_hash=bcrypt.hash(senha),
        prescritor_id=prescritor_id
    )
    session.add(nova)
    session.commit()
    session.refresh(nova)
    return nova
