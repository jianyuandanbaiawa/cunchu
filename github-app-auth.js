// GitHub App JWT认证工具

// GitHub App配置
const githubAppConfig = {
    appId: 'YOUR_APP_ID',
    privateKey: `-----BEGIN RSA PRIVATE KEY----- 
 MIIEpgIBAAKCAQEA1OrGDwqeRsxboejRg8tzFiZOduRBh9ps6tJZfJNboh28JzT9 
 mPPAWfOZCWRC7zxu8sI2P/hLiWci0VptpdselwOJs9PUgHEBH8N049yj61vfV23X 
 j0VbNIEoek1g4jstuC10BzSsFyjKTpY+2/Iw7akV7NsbV1xkA0rhk2y8zeQiQG+s 
 +QlKA8YdJWHBCc2lv8oPKRDGrYDrdv+1oXraZX6R0IgmbbeSBgMbD7xogqaYfZoK 
 PLwuLBjnN7c7MrAFMrvDqtTHAlA27G139rRMKLR5NmZDRnxRmIzAyuHj2Qc0nl89 
 RLWGGvYYtv4ua5uBqjzdbqJUHfvFsrTTbgpvkwIDAQABAoIBAQC8hz3kp7RKYD1q 
 +io6lvVK0ZR8tdRIpOH4c1WFdz2WKNonpUZAHuVdQNNre3nBODPNhKZgskzAV7B+ 
 y6F3ULSfZySRNKpfKLCkHX/tG7uRdYInej16wSDnNs5OrSFycJAlGyo4Dy2qPBYW 
 y/bQ7nzgk+20Erb8/fQY7j8bORdc/lt0QvIU8/OaOvBWY52O69hYOfnXbC2xWN8q 
 BiAuAQTif3WB2aL5Eb3Ii7qCx4SnFwdCxbzDQKooUPY9JJN7UoGoP25TpVS963Dh 
 HnzcXJbOCYENCFyZe0vxEac4B4MdZLH+U86ufDeHyXGcZGy2ZZR76/eUDqyp/hB/ 
 V7FijVQxAoGBAP1zRwroqIoXYVR1KEW6wAtEIcxwWhWNKdsnhQco0u8Kdx2h/bYg 
 2NLqDISKl+D6+H9B0L8QglTmGjoGw7A25lZyH4P8aqShRmBECrqQSVjGyXrsCcu9 
 G8YpLbMgE4/yEARCcLJtT8VIUfa/mMf7paGZlKsQdZpgo0xYa9oOrkmtAoGBANcP 
 G+rmAnbk+t6v6DjMacxnRA6o10d7RshxaCk+O8EGXKPdTVpvB5ooOrk4Av7gWBKS 
 so8LPT1HLlYHMnvMsMne+7PXKSstzWWz9Jol+hKYeCXnSkICDxNO17T6xk11GLOS 
 EhzBWENDKmm1BTTo/Awn6ZqhIarIG0H7ZIHvJUY/AoGBAJ0F/Z7BlCGx6Igl6aSB 
 1hdkx7fcZ8NwaN0xN9a+sSiOCExgn0pmQU8y2DyJjR1DAA//m6+0L7sfsGIA7N5Q 
 tRYbsHDaQsvqayqbHTaGzBpnVk6EzHDgocN8oaaXmecVplytORsiZEiqzLUd8S79 
 NpnPB++Py/ywIJvdMDyx2cMlAoGBAKWt3SsdIf7oryCJ0lSXnlY7pCHLD3bhUQmw 
 3LcRW8V8GjifkC1AZlHr9jmlHiGvQgqk+2zaEsa3pMnf55OagQQ0hiLpeqzqL1fP 
 yHxND5ft4HoK8plhrq2ISwQBQm5/7JTCzrNafJ3tC6q+K5G0gCD5Sq22vxIr8Vvm 
 yWqUi1nPAoGBAOAjOEhxoHOmoroSEG58rPR3YtgKV2MK0O7gDd67+koO0/w4qvxx 
 EMxFVonf96Vg6ncN6xVR3rt9clS70757aphS0W04JW8Zz9mmIyJbZSXFiVasDDFd 
 yOHaUosYyDnYihfe++EGn4TUoC4z3Xy4o26oU7FQM3fyjwIBXcggbykx 
 -----END RSA PRIVATE KEY-----`
};

// 生成JWT token
function generateJWT() {
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };
    
    const payload = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10分钟过期
        iss: githubAppConfig.appId
    };
    
    // 由于浏览器端无法直接使用RS256算法，这里需要使用第三方库或后端服务
    // 这里仅作为示例，实际项目中需要使用后端服务生成JWT
    console.warn('浏览器端无法直接使用RS256算法生成JWT，请使用后端服务');
    return 'dummy_jwt_token';
}

// 获取GitHub App的installation access token
async function getInstallationAccessToken(installationId) {
    const jwt = generateJWT();
    
    try {
        const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('获取installation access token失败:', error);
        throw error;
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateJWT,
        getInstallationAccessToken
    };
}
