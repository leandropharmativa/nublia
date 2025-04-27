# 📄 backend/app/routers/formulas.py

from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models import Formula, FormulaCreate
from app.database import engine
from app.database import get_session


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
        
# 🔵 Deletar uma fórmula pelo ID
@router.delete("/formulas/{formula_id}")
def deletar_formula(formula_id: int, session: Session = Depends(get_session)):
    formula = session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")
    session.delete(formula)
    session.commit()
    return {"ok": True}

# 🔵 Atualizar fórmula
@router.put("/formulas/{formula_id}")
def atualizar_formula(formula_id: int, formula_data: Formula, session: Session = Depends(get_session)):
    formula = session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")
    
    formula.nome = formula_data.nome
    formula.composicao = formula_data.composicao
    formula.indicacao = formula_data.indicacao
    formula.posologia = formula_data.posologia

    session.add(formula)
    session.commit()
    session.refresh(formula)

    return formula
