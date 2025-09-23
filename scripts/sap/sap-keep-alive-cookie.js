/*
 * Surge 脚本：带着 Cookie 访问 URL
 */

// 在这里粘贴您刚刚从 Surge 抓包工具中复制的完整 Cookie 值
const myCookie = 'session_id=abcde12345; user_token=...; a=b; c=d';

// 您需要访问的、需要登录权限的 URL
const protectedUrl = 'https://cockpit.btp.cloud.sap/cockpit/#/globalaccount/b9e60e53-a8ae-4e0e-9311-d74ac5db5cff';

// 构建一个包含自定义头部的请求对象
const myRequest = {
  url: protectedUrl,
  headers: {
    // 将 Cookie 放入请求头中
    'Cookie': myCookie
  }
};

$httpClient.get(myRequest, (error, response, data) => {
  if (error) {
    console.log(`❌ 请求失败: ${error}`);
    $notification.post('应用访问失败', '请检查网络或Cookie是否已过期', error);
  } else {
    // 您可以通过状态码或返回的数据 data 来判断 Cookie 是否有效
    console.log(`✅ 请求成功: 状态码=${response.statusCode}`);
    console.log(`返回数据: ${data}`); // 登录后才能看到的数据
  }
  $done();
});
