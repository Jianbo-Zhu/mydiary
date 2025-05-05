# MyDiary 后端服务

## 数据库 SSL 连接配置

为了安全连接 MySQL 数据库，我们需要配置 SSL 连接。以下是配置步骤：

### 1. 获取 SSL 证书

如果您使用的是云数据库服务（如 AWS RDS、Azure Database for MySQL 等），可以从服务提供商处下载 SSL 证书。

### 2. 配置环境变量

在 `.env` 文件中添加以下配置：

```
# MySQL SSL设置
MYSQL_SSL_CA=/path/to/ca.pem
MYSQL_SSL_CERT=/path/to/client-cert.pem
MYSQL_SSL_KEY=/path/to/client-key.pem
MYSQL_SSL_VERIFY=true
```

- `MYSQL_SSL_CA`: CA 证书路径
- `MYSQL_SSL_CERT`: 客户端证书路径
- `MYSQL_SSL_KEY`: 客户端密钥路径
- `MYSQL_SSL_VERIFY`: 是否验证证书（默认为 true）

### 3. 修改数据库连接 URL

在 `.env` 文件中，确保数据库连接 URL 包含 SSL 参数：

```
DATABASE_URL=mysql+pymysql://username:password@hostname:port/database?ssl_disabled=true
```

### 4. 常见问题

1. **证书验证失败**：如果遇到证书验证失败的问题，可以尝试将 `MYSQL_SSL_VERIFY` 设置为 `false`，但这会降低安全性。

2. **证书路径问题**：确保证书路径正确，并且应用程序有权限访问这些文件。

3. **证书格式问题**：确保证书格式正确，通常为 PEM 格式。

## 163邮箱配置

为了使用163邮箱发送邮件，需要进行以下配置：

### 1. 获取授权码

1. 登录163邮箱网页版
2. 点击"设置" -> "POP3/SMTP/IMAP"
3. 开启"SMTP服务"
4. 点击"设置授权码"，按照提示完成设置

### 2. 配置环境变量

在 `.env` 文件中添加以下配置：

```
# 邮件服务器设置 - 163邮箱
SMTP_USER=your-email@163.com
SMTP_PASSWORD=your-authorization-code
```

注意：
- `SMTP_PASSWORD` 不是邮箱登录密码，而是上一步获取的授权码
- 默认已配置服务器地址 `smtp.163.com` 和端口 `465`（SSL）

### 3. 测试邮件发送

完成配置后，系统将使用163邮箱发送激活邮件和其他通知。

## 其他配置

请参考 `.env.example` 文件，了解其他配置项。 