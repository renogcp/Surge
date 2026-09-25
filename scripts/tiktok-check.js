/**
 * 修复版 TikTok 解锁检测脚本（完美识别地区）
 */
const policy = $argument ? ($argument.match(/policy=([^&]+)/) || [])[1] : null;
const requestOptions = {
  url: 'https://www.tiktok.com/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  timeout: 7000
};

if (policy) {
  requestOptions['policy'] = decodeURIComponent(policy);
}

$httpClient.get(requestOptions, function (error, response, data) {
  if (error) {
    $done({
      title: `TikTok 解锁 (${policy || '默认'})`,
      content: '连接超时 / 节点不可用',
      icon: 'waveform.path.badge.minus',
      'icon-color': '#F44336'
    });
    return;
  }

  const status = response.status;
  if (status === 200 || status === 301 || status === 302) {
    // 强制转换为小写 Header 防止匹配失败
    const headers = {};
    if (response.headers) {
      Object.keys(response.headers).forEach(k => headers[k.toLowerCase()] = response.headers[k]);
    }

    // 提取 TikTok CDN 区域信息
    let region = headers['x-ip-country'] || headers['x-country-code'] || headers['cf-ipcountry'] || '';
    region = region.toUpperCase();

    let flag = '';
    if (region && region.length === 2) {
      flag = String.fromCodePoint(...region.split('').map(c => 127397 + c.charCodeAt(0)));
    }

    $done({
      title: `TikTok 解锁 (${policy || '默认'})`,
      content: region ? `已解锁 (${flag} ${region})` : '已解锁 (地区未知)',
      icon: 'sparkles.tv',
      'icon-color': '#34C759'
    });
  } else {
    $done({
      title: `TikTok 解锁 (${policy || '默认'})`,
      content: `未解锁 (HTTP ${status})`,
      icon: 'xmark.shield',
      'icon-color': '#FF9500'
    });
  }
});
