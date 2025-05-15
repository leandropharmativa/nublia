from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select, Session
from app.database import get_session
from app.models import Secretaria
from pydantic import BaseModel
from passlib.hash import bcrypt
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/secretarias", tags=["Secretarias"])

# Configurações de segurança
SECRET_KEY = "nublia-secretaria"
ALGORITHM = "HS256"
TOKEN_EXPIRATION_MINUTES = 60 * 24  # 24h

# 📥 Modelo de login
class LoginRequest(BaseModel):
    email: str
    senha: str

# 📤 Resposta com token
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nome: str

@router.post("/login", response_model=TokenResponse)
def login_secretaria(data: LoginRequest, session: Session = Depends(get_session)):
    secretaria = session.exec(select(Secretaria).where(Secretaria.email == data.email)).first()
    if not secretaria or not bcrypt.verify(data.senha, secretaria.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    payload = {
        "sub": secretaria.email,
        "nome": secretaria.nome,
        "id": secretaria.id,
        "prescritor_id": secretaria.prescritor_id,
        "exp": datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return TokenResponse(access_token=token, nome=secretaria.nome)
