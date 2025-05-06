from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Optional
from app.core.config import settings
from app.api import user, contact, diary, activity
from app.core.i18n import get_translator, Translator
from dotenv import load_dotenv

# 加载 .env 文件
# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
app = FastAPI(title="My Diary")

# 配置CORS
origins = settings.BACKEND_CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(user.router, prefix="/api/users", tags=["User Management"])
app.include_router(diary.router, prefix="/api/diaries", tags=["Diaries"])
app.include_router(contact.router, prefix="/api/contacts", tags=["Contacts"])
app.include_router(activity.router, prefix="/api/activities", tags=["Activities"])

# 国际化中间件
@app.middleware("http")
async def i18n_middleware(request: Request, call_next):
    # 从请求头中获取语言设置
    lang = request.headers.get("Accept-Language", "en").split(",")[0]
    request.state.lang = lang.split("-")[0] if "-" in lang else lang
    
    response = await call_next(request)
    return response

@app.get("/")
async def read_root(request: Request):
    t = get_translator(request)
    return {"message": t("welcome_message")}

# 语言API
@app.get("/api/language")
async def get_language(request: Request):
    return {"language": request.state.lang}

@app.post("/api/language/{lang}")
async def set_language(lang: str):
    if lang not in ["en", "zh"]:
        return JSONResponse(status_code=400, content={"error": "Unsupported language"})
    return {"language": lang}

if __name__ == "__main__":
    import uvicorn
    print(f"Running on {settings.BACKEND_CORS_ORIGINS}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 