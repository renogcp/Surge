/*
 * Surge 脚本：用于定时访问 URL，防止服务休眠
 */

// ⚠️ 请将下面的 URL 替换为您自己的 SAP Cloud Foundry App 的地址
const appUrl = 'https://YOUR_APP_URL.ondemand.com'; 

console.log(`[SAP保活] 开始执行任务...`);

// 使用 $httpClient 发送一个 GET 请求
$httpClient.get(appUrl, (error, response, data) => {
  if (error) {
    // 如果请求失败，记录错误日志并通过系统通知提醒您
    console.log(`[SAP保活] ❌ 请求失败: ${error}`);
    $notification.post('SAP 应用保活失败', '请检查网络或脚本配置', error);
  } else {
    // 如果请求成功，记录成功日志
    // HTTP 状态码 200-299 通常表示成功
    console.log(`[SAP保活] ✅ 请求成功，状态码: ${response.statusCode}`);
    // 您也可以选择在成功时发送通知，但可能会比较频繁，按需开启
    // $notification.post('SAP 应用保活成功', `URL: ${appUrl}`, `状态码: ${response.statusCode}`);
  }

  // 必须调用 $done() 来结束脚本运行
  $done();
});
