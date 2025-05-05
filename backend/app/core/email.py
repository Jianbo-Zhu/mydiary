import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_activation_email(email: str, activation_link: str):
    """发送账户激活邮件"""
    msg = MIMEMultipart()
    msg['From'] = f'{settings.SMTP_USER}'
    msg['To'] = email
    msg['Subject'] = "激活您的账户"
    
    body = f"""
    <html>
        <body>
            <h2>欢迎使用 MyDiary!</h2>
            <p>请点击下面的链接激活您的账户：</p>
            <p><a href="{activation_link}">{activation_link}</a></p>
            <p>此链接将在 {settings.ACTIVATION_TOKEN_EXPIRE_MINUTES} 分钟后过期。</p>
            <p>如果您没有注册账户，请忽略此邮件。</p>
        </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        if settings.SMTP_SSL:
            # Use SMTP_SSL for implicit SSL (commonly port 465)
            server = smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT)
        else:
            # Use SMTP and upgrade to TLS (commonly port 587)
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.ehlo()
            server.starttls()
            server.ehlo()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"发送邮件失败: {str(e)}")
        raise