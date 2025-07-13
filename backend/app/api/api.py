from fastapi import APIRouter
from app.api.endpoints import authors, genres, books, readers, borrows, returns, utils, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Xác thực"])
api_router.include_router(authors.router, prefix="/authors", tags=["Tác Giả"])
api_router.include_router(genres.router, prefix="/genres", tags=["Thể Loại"])
api_router.include_router(books.router, prefix="/books", tags=["Sách"])
api_router.include_router(readers.router, prefix="/readers", tags=["Độc Giả"])
api_router.include_router(borrows.router, prefix="/borrows", tags=["Phiếu Mượn"])
api_router.include_router(returns.router, prefix="/returns", tags=["Phiếu Trả"])
api_router.include_router(utils.router, prefix="/utils", tags=["Tiện Ích & Thống Kê"])
