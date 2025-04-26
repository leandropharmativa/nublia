# Importações principais
from fastapi import APIRouter, HTTPException, Depends, Body
from sqlmodel import Session, select
from app.models import User, UserCreate, CodigoAtivacao
from app.database import engine
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from typing import Optional
import random
import string

router = APIRouter()

# Configurações de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configurações de autenticação JWT
SECRET_KEY = "chave-secreta-do-nublia"  # Ideal deixar em variável de ambiente depois
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Função para criptografar senha
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Função para criar token JWT
def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# Função para gerar código aleatório único
def gerar_codigo_unico():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

# 🛠 ROTA: Registrar novo usuário
@router.post("/register")
def register_user(user: UserCreate, codigo_ativacao: Optional[str] = Body(None)):
    with Session(engine) as session:
        # Verifica se email já está em uso
        existing = session.exec(select(User).where(User.email == user.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email já cadastrado")

        # Se for tipo especial, precisa validar código de ativação
        if user.role in ["prescritor", "farmacia", "academia", "clinica"]:
            if not codigo_ativacao:
                raise HTTPException(status_code=400, detail="Código de ativação obrigatório para este tipo de usuário.")

            codigo = session.exec(
                select(CodigoAtivacao)
                .where(
                    CodigoAtivacao.codigo == codigo_ativacao,
                    CodigoAtivacao.ativo == True
                )
            ).first()

            if not codigo:
                raise HTTPException(status_code=400, detail="Código de ativação inválido ou já usado.")

            if codigo.tipo != user.role:
                raise HTTPException(status_code=400, detail="Código não corresponde ao tipo de usuário.")

            # Marcar o código como usado
            codigo.ativo = False
            session.add(codigo)
            session.commit()

        # Cria novo usuário com senha criptografada
        hashed_password = hash_password(user.password)
        user_data = user.dict()
        user_data['password'] = hashed_password
        new_user = User(**user_data)

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return {
            "message": f"{new_user.role.capitalize()} cadastrado com sucesso!",
            "id": new_user.id
        }

# 🛠 ROTA: Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == form_data.username)).first()

        if not user:
            raise HTTPException(status_code=400, detail="Email ou senha inválidos.")

        if not pwd_context.verify(form_data.password, user.password):
            raise HTTPException(status_code=400, detail="Email ou senha inválidos.")

        token_data = {
            "sub": str(user.id)
        }
        access_token = create_access_token(token_data)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }

# 🛠 ROTA: Listar todos os usuários
@router.get("/users/all")
def list_users():
    with Session(engine) as session:
        return session.exec(select(User)).all()

# 🛠 ROTA NOVA: Gerar código de ativação
@router.post("/generate_code")
def generate_activation_code(
    tipo_usuario: str = Body(...),
    email_usuario: str = Body(...),
    token: str = Depends(oauth2_scheme)
):
    # Decodifica o token JWT para garantir que é admin
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == int(user_id))).first()

        if not user or user.role != "admin":
            raise HTTPException(status_code=403, detail="Acesso negado")

        # Gera código novo
        novo_codigo = gerar_codigo_unico()

        # Cria o registro no banco
        codigo_registro = CodigoAtivacao(
            codigo=novo_codigo,
            tipo=tipo_usuario,
            email=email_usuario,
            ativo=True
        )

        session.add(codigo_registro)
        session.commit()
        session.refresh(codigo_registro)

        return {"codigo": codigo_registro.codigo}
