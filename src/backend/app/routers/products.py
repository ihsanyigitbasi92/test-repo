from fastapi import APIRouter

router = APIRouter()

@router.get("/products")
async def get_products():
    return []

@router.post("/products")
async def create_product():
    return {}
