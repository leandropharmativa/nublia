from sqlmodel import SQLModel, Field
from typing import Optional, Literal
from datetime import date, time, datetime
from pydantic import BaseModel

# 🔵 Modelo da tabela de usuários (prescritor, paciente, farmácia, academia, clínica, secretária)
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str
    name: str
    email: str
    password: Optional[str] = None
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    personal_address: Optional[str] = None
    crn: Optional[str] = None
    data_nascimento: Optional[date] = None
    sexo: Optional[str] = None
    observacoes: Optional[str] = None

# 🔵 Modelo usado apenas para criação de novos usuários
class UserCreate(SQLModel):
    role: Literal["admin", "prescritor", "paciente", "farmacia", "academia", "clinica", "secretaria"]
    name: str
    email: str
    password: Optional[str] = None
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    personal_address: Optional[str] = None
    crn: Optional[str] = None
    data_nascimento: Optional[date] = None
    sexo: Optional[str] = None
    observacoes: Optional[str] = None

# 🔵 Modelo da tabela de Agendamentos
class Agendamento(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    prescritor_id: int
    paciente_id: Optional[int] = None
    data: date
    hora: time
    status: str = "disponivel"
    observacao: Optional[str] = None

# 🔵 Modelo da tabela de Código de Ativação
class CodigoAtivacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    codigo: str
    tipo: str
    ativo: bool = True
    criado_em: datetime = Field(default_factory=datetime.utcnow)

class CodigoAtivacaoCreate(SQLModel):
    tipo: str

# 🔵 Modelo da tabela de Atendimento
class Atendimento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    paciente_id: int
    prescritor_id: int
    agendamento_id: Optional[int] = Field(default=None, foreign_key="agendamento.id")
    anamnese: Optional[str] = None
    antropometria: Optional[str] = None
    dieta: Optional[str] = None
    receita: Optional[str] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)

class AtendimentoCreate(SQLModel):
    paciente_id: int
    prescritor_id: int
    agendamento_id: Optional[int] = None
    anamnese: Optional[str] = None
    antropometria: Optional[str] = None
    dieta: Optional[str] = None
    receita: Optional[str] = None

# 🔵 Modelo da tabela de Fórmulas
class Formula(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farmacia_id: int
    nome: str
    composicao: Optional[str] = None
    indicacao: Optional[str] = None
    posologia: Optional[str] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)

class FormulaCreate(SQLModel):
    farmacia_id: int
    nome: str
    composicao: Optional[str] = None
    indicacao: Optional[str] = None
    posologia: Optional[str] = None

# 🔵 Modelo de resposta com nome do paciente
class AgendamentoComNome(BaseModel):
    id: int
    prescritor_id: int
    paciente_id: Optional[int]
    data: date
    hora: time
    status: str
    observacao: Optional[str] = None
    paciente_nome: Optional[str] = None

    class Config:
        orm_mode = True
