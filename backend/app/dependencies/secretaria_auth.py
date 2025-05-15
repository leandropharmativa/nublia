from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.models import Secretaria
from app.database import get_session
from sqlmodel import Session, select

# Mesmo segredo usado em secretarias.py
SECRET_KEY = "nublia-secretaria"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="secretarias/login")

def get_secretaria_current(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> Secretaria:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

        secretaria = session.exec(select(Secretaria).where(Secretaria.email == email)).first()
        if secretaria is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Secretária não encontrada")

        return secretaria

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado")
