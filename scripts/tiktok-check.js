/**
 * 解决“未知地区”的改进版 TikTok 检测脚本
 */.
const url = 'https://www.tiktok.com/';
const headers = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
};

$httpClient.get({ url: url, headers: headers, timeout: 8000 }, function (error, response, data) {
  if (error) {
    $done({
      title: 'TikTok 解锁',
      content: '网络超时 / 连接失败',
      icon: 'waveform.path.badge.minus',
      'icon-color': '#F44336'
    });
    return;
  }

  // 将响应头 key 全部转为小写，防止匹配失败
  const resHeaders = {};
  if (response && response.headers) {
    Object.keys(response.headers).forEach((key) => {
      resHeaders[key.toLowerCase()] = response.headers[key];
    });
  }

  const status = response.status;
  if (status === 200 || status === 301 || status === 302) {
    // 兼容多种 TikTok 可能返回的国家/地区字段
    let region = resHeaders['x-ip-country'] || resHeaders['x-country-code'] || resHeaders['cf-ipcountry'] || '';
    region = region.toUpperCase();

    let flag = '';
    if (region && region.length === 2) {
      flag = String.fromCodePoint(...region.split('').map((char) => 127397 + char.charCodeAt(0)));
    }

    $done({
      title: 'TikTok 解锁状态',
      content: region ? `已解锁 (${flag} ${region})` : '已解锁 (Web 端可连)',
      icon: 'sparkles.tv',
      'icon-color': '#34C759'
    });
  } else {
    $done({
      title: 'TikTok 解锁状态',
      content: `未解锁 (HTTP ${status})`,
      icon: 'xmark.shield',
      'icon-color': '#FF9500'
    });
  }
});
