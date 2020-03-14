from django.core.mail import send_mail

def send_forgot_password_email(email, url):
    body = f"""Hello!
Use this link to reset your password: {url}

It doesn't live forever, so don't waste time!
"""
    send_mail(
        'Checkmate - forgot password',
        body,
        'CheckMate <no-reply@checkmate.best>',
        [email],
    )