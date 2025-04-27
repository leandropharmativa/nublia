from sqlmodel import SQLModel, Field
from typing import Optional, Literal
from datetime import date, time

# Modelo da tabela de usuários (prescritor, paciente, farmácia, academia, clínica)
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    personal_address: Optional[str] = None
    crn: Optional[str] = None  # Para prescritor (nutricionista, biomédico, médico)

# Modelo usado apenas para criação de usuários (sem o ID)
class UserCreate(SQLModel):
    role: Literal["admin", "prescritor", "paciente", "farmacia", "academia", "clinica"]
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    personal_address: Optional[str] = None
    crn: Optional[str] = None

# 🛠 Modelo completo de paciente (salvo no banco de dados)
class Paciente(SQLModel, table=True):
    __tablename__ = "paciente_novo"  # <<< ADICIONAR ESSA LINHA
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    data_nascimento: date
    sexo: str
    telefone: str
    email: Optional[str] = None
    observacoes: Optional[str] = None
  # Aqui você pode anotar observações do paciente

# 🛠 Modelo apenas para criação de paciente (sem o ID)
class PacienteCreate(SQLModel):
    nome: str
    data_nascimento: date
    sexo: str
    telefone: str
    email: Optional[str] = None
    observacoes: Optional[str] = None

# Modelo de agendamento de consultas/atendimentos
class Agendamento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    data: date
    hora: time
    prescritor_id: int  # ID do usuário prescritor
    paciente_id: int  # ID do paciente
    observacoes: Optional[str] = None

# Modelo usado apenas para criação de agendamento (sem o ID)
class AgendamentoCreate(SQLModel):
    data: date
    hora: time
    prescritor_id: int
    paciente_id: int
    observacoes: Optional[str] = None

from datetime import datetime

# Modelo usado apenas para criação de códigos de ativação de contas
class CodigoAtivacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    codigo: str
    tipo: str  # Tipo de usuário para o qual o código é válido
    ativo: bool = True
    criado_em: datetime = Field(default_factory=datetime.utcnow)

class CodigoAtivacaoCreate(SQLModel):
    tipo: str

class Atendimento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    paciente_id: int
    anamnese: str
    antropometria: str
    dieta: str
    receita: str
    data_criacao: datetime = Field(default_factory=datetime.utcnow)
