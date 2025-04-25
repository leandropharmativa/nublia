from sqlmodel import SQLModel, Field
from typing import Optional, Literal
from datetime import date, time

# Modelo da tabela de usuários (prescritor, paciente, farmácia, academia, clínica)
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: Literal["prescritor", "paciente", "farmacia", "academia", "clinica"]
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
    role: Literal["prescritor", "paciente", "farmacia", "academia", "clinica"]
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    personal_address: Optional[str] = None
    crn: Optional[str] = None

# Modelo de pacientes (mais específico para os pacientes mesmo)
class Paciente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    birth_date: date
    phone: str
    notes: Optional[str] = None  # Observações médicas

# Modelo usado apenas para criação de pacientes (sem o ID)
class PacienteCreate(SQLModel):
    name: str
    birth_date: date
    phone: str
    notes: Optional[str] = None

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
