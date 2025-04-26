from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.models import User, UserCreate
from app.database import engine
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Chave secreta para gerar o token JWT (em produção, use variável de ambiente)
SECRET_KEY = "chave-secreta-do-nublia"  # substitua depois por algo mais seguro

# Gera hash seguro da senha
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verifica se a senha está correta
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Gera o token JWT com tempo de expiração
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=12)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

# Rota de cadastro de usuário
@router.post("/register")
def register_user(user: UserCreate):
    with Session(engine) as session:
        # Verifica se email já está cadastrado
        existing = session.exec(select(User).where(User.email == user.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email já cadastrado")

        hashed_password = hash_password(user.password)
        new_user = User(**user.dict(), password=hashed_password)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return {"message": f"{new_user.role.capitalize()} cadastrado com sucesso!", "id": new_user.id}

# Rota de login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == form_data.username)).first()
        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Email ou senha inválidos")

        token = create_access_token({"sub": str(user.id)})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "role": user.role
            }
        }

# Rota opcional para listar todos os usuários (exemplo/teste)
@router.get("/users/all")
def list_users():
    with Session(engine) as session:
        return session.exec(select(User)).all()
