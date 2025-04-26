from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import CodigoAtivacao, CodigoAtivacaoCreate, User
from app.database import engine
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
import random
import string
import os

router = APIRouter()

# Configuração de autenticação
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = "chave-secreta-do-nublia"  # mesma usada no users.py

# Função para buscar usuário a partir do token
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Token inválido")

    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return user

# Função para gerar códigos aleatórios
def gerar_codigo(length=6):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

# Rota para gerar novo código (somente admin)
@router.post("/codigos/gerar")
def gerar_codigo_ativacao(dados: CodigoAtivacaoCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem gerar códigos.")

    novo_codigo = CodigoAtivacao(
        codigo=gerar_codigo(),
        tipo=dados.tipo
    )

    with Session(engine) as session:
        session.add(novo_codigo)
        session.commit()
        session.refresh(novo_codigo)

        return {
            "message": "Código gerado com sucesso!",
            "codigo": novo_codigo.codigo
        }

# Rota para listar todos os códigos (somente admin)
@router.get("/codigos/")
def listar_codigos(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem ver códigos.")

    with Session(engine) as session:
        codigos = session.exec(select(CodigoAtivacao)).all()
        return codigos
