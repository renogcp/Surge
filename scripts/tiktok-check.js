/**
 * 完整版 TikTok 节点地区精准识别脚本
 */
const policy = $argument ? ($argument.match(/policy=([^&]+)/) || [])[1] : null;

// 1. 优先使用 TikTok 内部 API 探测
const tiktokReq = {
  url: 'https://www.tiktok.com/api/v1/item/detail/?itemId=1',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  timeout: 6000
};

if (policy) {
  tiktokReq['policy'] = decodeURIComponent(policy);
}

// 国旗 Emoji 转换工具函数
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

$httpClient.get(tiktokReq, function (error, response, data) {
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
    const headers = {};
    if (response.headers) {
      Object.keys(response.headers).forEach(k => headers[k.toLowerCase()] = response.headers[k]);
    }

    // 尝试从 TikTok CDN 响应头提取地区
    let region = headers['x-ip-country'] || headers['x-country-code'] || headers['cf-ipcountry'] || '';

    if (region && region.length === 2) {
      region = region.toUpperCase();
      $done({
        title: `TikTok 解锁 (${policy || '默认'})`,
        content: `已解锁 (${getFlagEmoji(region)} ${region})`,
        icon: 'sparkles.tv',
        'icon-color': '#34C759'
      });
    } else {
      // 备用机制：响应头缺失时，走同节点查询 IP 归属地获取精准地区
      const ipReq = {
        url: 'https://ipwho.is/',
        timeout: 5000
      };
      if (policy) ipReq['policy'] = decodeURIComponent(policy);

      $httpClient.get(ipReq, function (ipErr, ipRes, ipData) {         if (!ipErr && ipData) {           try {             const ipInfo = JSON.parse(ipData);             if (ipInfo && ipInfo.country_code) {               const ipRegion = ipInfo.country_code.toUpperCase();$done({
                title: `TikTok 解锁 (${policy || '默认'})`,
                content: `已解锁 (${getFlagEmoji(ipRegion)} ${ipRegion})`,
                icon: 'sparkles.tv',
                'icon-color': '#34C759'
              });
              return;
            }
          } catch (e) {}
        }

        $done({
          title: `TikTok 解锁 (${policy || '默认'})`,
          content: '已解锁 (未知地区)',
          icon: 'sparkles.tv',
          'icon-color': '#34C759'
        });
      });
    }
  } else {
    $done({
      title: `TikTok 解锁 (${policy || '默认'})`,
      content: `未解锁 (HTTP ${status})`,
      icon: 'xmark.shield',
      'icon-color': '#FF9500'
    });
  }
});
