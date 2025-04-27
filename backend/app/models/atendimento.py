# 📄 backend/app/models/atendimento.py

from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

# Modelo da tabela Atendimento
class Atendimento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    paciente_id: int
    anamnese: Optional[str] = None
    antropometria: Optional[str] = None
    dieta: Optional[str] = None
    receita: Optional[str] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)

# Modelo para criação de atendimento (não exige ID)
class AtendimentoCreate(SQLModel):
    paciente_id: int
    anamnese: Optional[str] = None
    antropometria: Optional[str] = None
    dieta: Optional[str] = None
    receita: Optional[str] = None
