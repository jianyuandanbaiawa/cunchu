// 多层加密工具函数（与代码中的实现一致）
function encryptToken(token) {
    try {
        // 第一层：Base64编码
        let encrypted = btoa(token);
        console.log('第一层加密（Base64）:', encrypted);
        
        // 第二层：字符反转
        encrypted = encrypted.split('').reverse().join('');
        console.log('第二层加密（字符反转）:', encrypted);
        
        // 第三层：再次Base64编码
        encrypted = btoa(encrypted);
        console.log('第三层加密（再次Base64）:', encrypted);
        
        return encrypted;
    } catch (e) {
        console.error('令牌加密失败:', e);
        throw e;
    }
}

// 多层解密工具函数（对应加密的逆过程）
function decryptToken(encryptedToken) {
    try {
        // 第一层：Base64解码
        let decrypted = atob(encryptedToken);
        console.log('第一层解密（Base64）:', decrypted);
        
        // 第二层：字符反转
        decrypted = decrypted.split('').reverse().join('');
        console.log('第二层解密（字符反转）:', decrypted);
        
        // 第三层：Base64解码
        decrypted = atob(decrypted);
        console.log('第三层解密（再次Base64）:', decrypted);
        
        return decrypted;
    } catch (e) {
        console.error('令牌解密失败:', e);
        throw e;
    }
}

// 测试加密和解密过程
const token = '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';
console.log('原始令牌:', token);

const encrypted = encryptToken(token);
console.log('最终加密结果:', encrypted);

const decrypted = decryptToken(encrypted);
console.log('解密结果:', decrypted);

// 验证解密是否成功
console.log('验证结果:', decrypted === token ? '成功' : '失败');
