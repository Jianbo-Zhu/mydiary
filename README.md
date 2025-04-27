# My Diary 个人日记应用

一个支持国际化的个人日记应用，前端使用 Next.js，后端使用 FastAPI。

## 项目结构

```
mydiary/
├── frontend/          # Next.js 前端项目
│   ├── src/           # 源代码目录
│   │   ├── components/  # 组件
│   │   ├── pages/     # 页面
│   │   ├── locales/   # 国际化文件
│   │   ├── utils/     # 工具函数
│   │   └── styles/    # 样式文件
│   ├── public/        # 静态资源
│   └── package.json   # 前端依赖
│
├── backend/           # FastAPI 后端项目
│   ├── app/           # 应用代码
│   └── requirements.txt # 后端依赖
│
└── docker-compose.yml # Docker 配置
```

## 功能特性

- 支持中英文国际化
- 响应式界面设计
- 日记编写和管理
- 用户认证和授权

## 开发环境设置

### 前端 (Next.js)

1. 安装依赖：

```bash
cd frontend
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

前端开发服务器将在 http://localhost:3000 启动。

### 后端 (FastAPI)

1. 创建并激活虚拟环境：

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# 或
.venv\Scripts\activate  # Windows
```

2. 安装依赖：

```bash
cd backend
pip install -r requirements.txt
```

3. 启动开发服务器：

```bash
uvicorn app.main:app --reload
```

后端API将在 http://localhost:8000 启动。

## 使用 Docker

使用 Docker Compose 一键启动整个应用：

```bash
docker-compose up -d
```

## 国际化使用

前端项目支持中英文切换，查看 `frontend/src/docs/i18n-guide.md` 了解更多关于国际化的使用方法。 