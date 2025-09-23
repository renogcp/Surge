/*
 * Surge 脚本：用于检测并提示 Cookie 获取
 * 当检测到特定域名的响应头中包含 `set-cookie` 时，发出通知。
 */

// --- 配置区域 ---
// 您可以修改下面的域名，让脚本在其他网站上也能生效
const targetDomain = 'cockpit.btp.cloud.sap';
// --- 配置区域结束 ---

// 获取当前请求的 URL
const url = $request.url;

// 检查当前请求的域名是否是我们的目标域名
if (url.includes(targetDomain)) {
  
  // 获取响应头
  const headers = $response.headers;
  
  // 检查响应头中是否存在 'Set-Cookie' 或 'set-cookie' 字段
  // 响应头中的键名可能大小写不敏感，所以都转换为小写来判断
  const setCookieHeader = headers['Set-Cookie'] || headers['set-cookie'];
  
  if (setCookieHeader) {
    // 如果存在 Set-Cookie 字段，说明服务器正在设置新的 Cookie
    console.log(`[Cookie助手] 成功检测到来自 ${targetDomain} 的 Cookie！`);
    
    // 发送系统通知
    // 第一个参数是通知标题
    // 第二个参数是通知副标题
    // 第三个参数是通知内容，我们将获取到的部分Cookie作为内容展示
    $notification.post(
      '🍪 已成功获取 Cookie',
      `域名: ${targetDomain}`,
      `服务器设置的 Cookie: ${setCookieHeader.substring(0, 100)}...` // 只显示前100个字符，避免通知过长
    );
  }
}

// 脚本结束，不对网络请求做任何修改
$done({});
