# 📄 backend/app/routers/formulas.py

from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models import Formula, FormulaCreate
from app.database import engine

router = APIRouter()

# 🔵 Criar fórmula
@router.post("/formulas/")
def criar_formula(formula: FormulaCreate):
    with Session(engine) as session:
        nova_formula = Formula(**formula.dict())
        session.add(nova_formula)
        session.commit()
        session.refresh(nova_formula)
        return nova_formula

# 🔵 Listar fórmulas de uma farmácia
@router.get("/formulas/{farmacia_id}")
def listar_formulas_por_farmacia(farmacia_id: int):
    with Session(engine) as session:
        formulas = session.exec(
            select(Formula).where(Formula.farmacia_id == farmacia_id)
        ).all()
        return formulas
