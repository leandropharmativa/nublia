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

# ✅ NOVO: Cadastro de secretária
class SecretariaCreate(BaseModel):
    nome: str
    email: str
    senha: str
    prescritor_id: int

@router.post("/", response_model=dict)
def criar_secretaria(data: SecretariaCreate, session: Session = Depends(get_session)):
    existente = session.exec(select(Secretaria).where(Secretaria.email == data.email)).first()
    if existente:
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado como secretária.")

    nova = Secretaria(
        nome=data.nome,
        email=data.email,
        senha_hash=bcrypt.hash(data.senha),
        prescritor_id=data.prescritor_id
    )
    session.add(nova)
    session.commit()
    session.refresh(nova)
    return {
        "id": nova.id,
        "nome": nova.nome,
        "email": nova.email,
        "prescritor_id": nova.prescritor_id
    }

@router.delete("/{id}", response_model=dict)
def deletar_secretaria(id: int, session: Session = Depends(get_session)):
    secretaria = session.get(Secretaria, id)
    if not secretaria:
        raise HTTPException(status_code=404, detail="Secretária não encontrada.")
    
    session.delete(secretaria)
    session.commit()
    return {"ok": True, "mensagem": "Secretária removida com sucesso."}

class AlterarSenhaRequest(BaseModel):
    nova_senha: str

@router.put("/{id}/senha", response_model=dict)
def alterar_senha_secretaria(id: int, data: AlterarSenhaRequest, session: Session = Depends(get_session)):
    secretaria = session.get(Secretaria, id)
    if not secretaria:
        raise HTTPException(status_code=404, detail="Secretária não encontrada.")

    secretaria.senha_hash = bcrypt.hash(data.nova_senha)
    session.add(secretaria)
    session.commit()
    return {"ok": True, "mensagem": "Senha atualizada com sucesso."}

