from typing import Callable, Dict, Any
from fastapi import Request, Depends

# 定义翻译器类型
Translator = Callable[[str], str]

# 语言文件
translations = {
    "en": {
        "welcome_message": "Welcome to My Diary API",
        "not_found": "Resource not found",
        "unauthorized": "Unauthorized access",
        "validation_error": "Validation error",
        "server_error": "Internal server error",
        "success": "Success",
        "created": "Resource created successfully",
        "updated": "Resource updated successfully",
        "deleted": "Resource deleted successfully"
    },
    "zh": {
        "welcome_message": "欢迎使用我的日记 API",
        "not_found": "资源未找到",
        "unauthorized": "未授权访问",
        "validation_error": "验证错误",
        "server_error": "服务器内部错误",
        "success": "成功",
        "created": "资源创建成功",
        "updated": "资源更新成功",
        "deleted": "资源删除成功"
    }
}

def get_language(request: Request) -> str:
    """从请求中获取语言设置"""
    lang = getattr(request.state, "lang", "en")
    if lang not in translations:
        return "en"
    return lang

def create_translator(lang: str) -> Translator:
    """创建翻译函数"""
    def translate(key: str) -> str:
        return translations.get(lang, translations["en"]).get(key, key)
    return translate

def get_translator(request: Request = Depends()) -> Translator:
    """依赖注入函数，返回一个翻译器"""
    lang = get_language(request)
    return create_translator(lang)

def translate_error_response(error_key: str, request: Request) -> Dict[str, Any]:
    """翻译错误响应"""
    lang = get_language(request)
    translator = create_translator(lang)
    return {"error": translator(error_key)} 