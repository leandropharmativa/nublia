from sqlmodel import SQLModel, Field
from typing import Optional, Literal
from datetime import date, time, datetime

# 🔵 Modelo da tabela de usuários (prescritor, paciente, farmácia, academia, clínica, secretária)
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str
    name: str
    email: str
    password: Optional[str] = None  # Senha opcional para permitir cadastro manual
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    personal_address: Optional[str] = None
    crn: Optional[str] = None  # Para prescritor (nutricionista, biomédico, médico)
    data_nascimento: Optional[date] = None  # Para paciente
    sexo: Optional[str] = None              # Para paciente
    observacoes: Optional[str] = None       # Observações gerais

# 🔵 Modelo usado apenas para criação de novos usuários (sem ID)
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

# 🔵 Modelo da tabela de Agendamento de consultas/atendimentos
class Agendamento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    data: date
    hora: time
    prescritor_id: int  # ID do usuário prescritor
    paciente_id: int    # ID do usuário paciente
    observacoes: Optional[str] = None

# 🔵 Modelo usado apenas para criação de Agendamento (sem ID)
class AgendamentoCreate(SQLModel):
    data: date
    hora: time
    prescritor_id: int
    paciente_id: int
    observacoes: Optional[str] = None

# 🔵 Modelo da tabela de Código de Ativação
class CodigoAtivacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    codigo: str
    tipo: str  # Tipo de usuário para o qual o código é válido
    ativo: bool = True
    criado_em: datetime = Field(default_factory=datetime.utcnow)

# 🔵 Modelo para criação de Código de Ativação (sem ID)
class CodigoAtivacaoCreate(SQLModel):
    tipo: str

# 🔵 Modelo da tabela de Atendimento
class Atendimento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    paciente_id: int  # ID do usuário paciente
    prescritor_id: int  # ID do usuário prescritor
    anamnese: Optional[str] = None
    antropometria: Optional[str] = None
    dieta: Optional[str] = None
    receita: Optional[str] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)

# 🔵 Modelo usado apenas para criação de Atendimento (sem ID)
class AtendimentoCreate(SQLModel):
    paciente_id: int
    prescritor_id: int
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

# 🔵 Modelo usado apenas para criação de Fórmulas (sem ID)
class FormulaCreate(SQLModel):
    farmacia_id: int
    nome: str
    composicao: Optional[str] = None
    indicacao: Optional[str] = None
    posologia: Optional[str] = None
