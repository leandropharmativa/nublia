from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from app.models import Formula, FormulaCreate
from app.database import engine, get_session

router = APIRouter()

# 🔵 Modelo de recebimento para DELETE
class FormulaDeleteRequest(BaseModel):
    id: int

# 🔵 Modelo de recebimento para UPDATE
class FormulaUpdateRequest(FormulaCreate):
    id: int

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

# 🔵 Deletar fórmula via POST (CORRIGIDO)
@router.post("/formulas/delete")
def deletar_formula_post(payload: FormulaDeleteRequest, session: Session = Depends(get_session)):
    formula = session.get(Formula, payload.id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")
    session.delete(formula)
    session.commit()
    return {"ok": True}

# 🔵 Atualizar fórmula via POST (CORRIGIDO)
@router.post("/formulas/update")
def atualizar_formula_post(data: FormulaUpdateRequest, session: Session = Depends(get_session)):
    formula = session.get(Formula, data.id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")

    formula.nome = data.nome
    formula.composicao = data.composicao
    formula.indicacao = data.indicacao
    formula.posologia = data.posologia

    session.commit()
    session.refresh(formula)
    return formula
