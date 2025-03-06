```markdown
# sso-auth-npm

**SSO Authentication with OAuth and SAML**

`sso-auth-npm` — это пакет для внедрения аутентификации через SSO (Single Sign-On) с использованием протоколов **OAuth2** и **SAML**. Этот пакет поддерживает интеграцию с такими популярными провайдерами, как **Google** (OAuth) и **Auth0** (SAML), предоставляя простое решение для авторизации пользователей в приложениях.

## Установка

Для установки пакета, используйте следующую команду:

```bash
npm install sso-auth-npm
```

## Использование

1. Создайте конфигурационный объект для настройки аутентификации и передайте его в сервер.

Пример:

```typescript
import { startSSOServer } from 'sso-auth-npm';

const config = {
    oauth: {
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackUrl: process.env.OAUTH_CALLBACK_URL,
        provider: 'google',
    },
    saml: {
        entryPoint: process.env.SAML_ENTRY_POINT,
        issuer: process.env.SAML_ISSUER,
        certPath: process.env.SAML_CERT_PATH,
    },
};

startSSOServer(config);
```

2. Настройте OAuth и SAML в вашем проекте, добавив маршруты для авторизации, обработки токенов и получения пользовательской информации.

3. Пример использования для OAuth:

```typescript
import { initOAuth } from 'sso-auth-npm';

// Настройка OAuth
initOAuth(app, {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackUrl: 'your-callback-url',
});
```

## Конфигурация

Создайте файл `.env` в корне вашего проекта и настройте переменные окружения, которые требуются для OAuth и SAML.

Пример `.env` файла:

```
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_CALLBACK_URL=https://your-app.com/oauth/callback
OAUTH_AUTH_URL=https://accounts.google.com/o/oauth2/auth
OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
OAUTH_USER_INFO_URL=https://www.googleapis.com/oauth2/v3/userinfo
OAUTH_PROVIDER=google

SAML_CALLBACK_URL=https://your-app.com/saml/callback
SAML_ENTRY_POINT=https://your-auth0-app.us.auth0.com/samlp/your-saml-id
SAML_ISSUER=https://your-auth0-app.us.auth0.com/
SAML_CERT_PATH=./path/to/your-certificate.pem
```

## Пример использования

После настройки, вы можете начать использовать аутентификацию в вашем приложении:

```typescript
import { authenticate } from 'sso-auth-npm';

// Для защищённых маршрутов:
app.get('/protected', authenticate, (req, res) => {
    res.send('This is a protected route');
});
```

## Технологии

- **Express.js** — для создания сервера.
- **OAuth2** — для аутентификации через Google.
- **SAML** — для аутентификации через Auth0.
- **Passport.js** — для обработки стратегии аутентификации.
- **jsonwebtoken** — для работы с JWT токенами.
- **TypeORM** — для работы с базой данных.

## Лицензия

Этот проект лицензирован под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.
```