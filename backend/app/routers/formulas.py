# 📄 backend/app/routers/formulas.py
# v1.0.1

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from app.models import Formula, FormulaCreate
from app.database import engine, get_session
from app.models import User
from fastapi import Query

router = APIRouter()

# 🔵 Modelos auxiliares
class FormulaDeleteRequest(BaseModel):
    id: int

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

# 🔵 Excluir fórmula via POST
@router.post("/formulas/delete")
def deletar_formula(payload: FormulaDeleteRequest, session: Session = Depends(get_session)):
    formula = session.get(Formula, payload.id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")
    session.delete(formula)
    session.commit()
    return {"ok": True}

# 🔵 Atualizar fórmula via POST
@router.post("/formulas/update")
def atualizar_formula(data: FormulaUpdateRequest, session: Session = Depends(get_session)):
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

# 🔵 Listar todas as fórmulas com nome da farmácia ou prescritor (com paginação)
@router.get("/formulas/todas")
def listar_todas_formulas(
    session: Session = Depends(get_session),
    limit: int = Query(50, ge=1, le=100),  # padrão: 50, máximo: 100
    offset: int = Query(0, ge=0)
):
    formulas = session.exec(
        select(Formula).offset(offset).limit(limit)
    ).all()
    resultado = []

    for f in formulas:
        if f.farmacia_id:
            farmacia = session.exec(select(User).where(User.id == f.farmacia_id)).first()
            autor = farmacia.name if farmacia else "Farmácia desconhecida"
        elif f.usuario_id:
            prescritor = session.exec(select(User).where(User.id == f.usuario_id)).first()
            autor = prescritor.name if prescritor else "Prescritor desconhecido"
        else:
            autor = "Autor desconhecido"

        resultado.append({
            "id": f.id,
            "nome": f.nome,
            "composicao": f.composicao,
            "indicacao": f.indicacao,
            "posologia": f.posologia,
            "autor": autor,
            "farmacia_id": f.farmacia_id,
            "usuario_id": f.usuario_id
        })

    return resultado


# 🔵 Listar fórmulas de um prescritor específico (com paginação)
@router.get("/formulas/prescritor/{prescritor_id}")
def listar_formulas_por_prescritor(
    prescritor_id: int,
    session: Session = Depends(get_session),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    formulas = session.exec(
        select(Formula)
        .where(Formula.usuario_id == prescritor_id)
        .offset(offset)
        .limit(limit)
    ).all()
    return formulas
