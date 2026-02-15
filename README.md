# GitHub 静态图片托管网站

### 项目介绍
这是一个为所有 GitHub 用户提供的抠死 GitHub 仓库内存的静态图片托管网站，旨在帮助大家优化仓库存储空间，减少不必要的内存占用。

### 支持我们
如果你喜欢这个项目，觉得对你有帮助，请不要吝啬你的小星星 ⭐：
- 点击仓库右上角的 Star 按钮为项目点赞
- 也欢迎 Fork 到自己的仓库进行二次开发

#### 更新    2026/2/9 0：05
- github app的登录功能

#### 修复    2026/2/9 0：05
- 修复登录404问题

网页:https://jianyuandanbaiawa.github.io/cunchu/

# 如何快速建设自己的github存储
1.生成一个新的api（经典）
<img width="2880" height="1824" alt="QQ20260215-224742" src="https://github.com/user-attachments/assets/60d26686-e92a-4a30-b153-71f021ce51b7" />

2.勾选rope的前四项

<img width="1468" height="348" alt="QQ20260215-224849" src="https://github.com/user-attachments/assets/ba6032f2-fdce-4ea1-b9b2-1d77aea9a505" />
<img width="2880" height="1824" alt="QQ20260215-224837" src="https://github.com/user-attachments/assets/99cfd2c7-ce79-4b57-b4cd-27509c59d1ad" />
<img width="2880" height="1824" alt="QQ20260215-224828" src="https://github.com/user-attachments/assets/2bf19e52-747f-4705-bfec-6c7c046422e3" />
<img width="2880" height="1824" alt="QQ20260215-224811" src="https://github.com/user-attachments/assets/e37b5bb7-b2e0-4b05-a054-cb1401cef47d" />

## 3.替换api
 - upload.js:
 - 代码位置1：第137行
 - 前三行（134-136行）：
 ```
// 从localStorage获取保存的令牌
const savedToken = getGithubToken();
if (!savedToken) {
 ```
- 后三行（138-140行）:
 ```
try {
    const token = decryptToken(defaultToken);
    document.getElementById('github-token').value = token;
```
- 代码位置2：第221行
- 前三行（218-220行）：
```
// 从localStorage获取保存的令牌
const savedToken = getGithubToken();
if (!savedToken) {
```
- 后三行（222-224行）：
```
try {
    githubToken = decryptToken(defaultToken);
    document.getElementById('github-token').value = githubToken;
```
- encrypt-token.js:
- 代码位置：第46行
- 前三行（43-45行）：
```
// 测试加密和解密过程
const token = 'ghp_Xcxu4Zzazb*******';
console.log('原始令牌:', token);
```
- 后三行（47-49行）：
```
const encrypted = encryptToken(token);
console.log('最终加密结果:', encrypted);
```
- calculate-encrypted-token.js:
- 代码位置：第55行
- 前三行（52-54行）：
```
// 测试加密和解密过程
const token = 'ghp_Xcxu4Zzazb*******';
console.log('原始令牌:', token);
```
- 后三行（56-58行）：
```
const encrypted = encryptToken(token);
console.log('最终加密结果:', encrypted);
```
# 加密方法和过程
加密方法 ：多层加密（至少三层）

加密过程 ：

- 第一层加密 ：使用Base64编码对原始令牌进行编码
- 第二层加密 ：将Base64编码后的结果进行字符反转
- 第三层加密 ：对字符反转后的结果再次进行Base64编码
解密过程 （对应加密的逆过程）：

- 第一层解密 ：对加密后的令牌进行Base64解码
- 第二层解密 ：将解码后的结果进行字符反转
- 第三层解密 ：对字符反转后的结果再次进行Base64解码
- （look me！你完全不需要在意这个，因为在前面的更新中已经加入了内置的base64加密工具，你只需要自己根据提示，或者丢给ai就可以了）








