/**
 * TikTok 节点/策略精准识别检测脚本（纯净标题 + TikTok 图标版）
 */
const policy = $argument ? ($argument.match(/policy=([^&]+)/) || [])[1] : null;

// 优先使用 TikTok 内部 API 探测
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
  // 固定标题，隐藏后面的策略名称
  const displayTitle = 'TikTok 解锁检测';
  // 使用 TikTok 官方图标 (如果 Surge 版本支持 SFSymbols 也可以替换为 sparkles.tv)
  const tiktokIcon = 'tiktok';

  if (error) {
    $done({
      title: displayTitle,
      content: '连接超时 / 节点不可用',
      icon: tiktokIcon,
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

    // 从 Header 抓取地区信息
    let region = headers['x-ip-country'] || headers['x-country-code'] || headers['cf-ipcountry'] || '';

    if (region && region.length === 2) {
      region = region.toUpperCase();
      $done({
        title: displayTitle,
        content: `已解锁 (${getFlagEmoji(region)} ${region})`,
        icon: tiktokIcon,
        'icon-color': '#000000'
      });
    } else {
      // 备用机制：获取当前节点的 IP 地区
      const ipReq = {
        url: 'https://ipwho.is/',
        timeout: 5000
      };
      if (policy) ipReq['policy'] = decodeURIComponent(policy);

      $httpClient.get(ipReq, function (ipErr, ipRes, ipData) {         if (!ipErr && ipData) {           try {             const ipInfo = JSON.parse(ipData);             if (ipInfo && ipInfo.country_code) {               const ipRegion = ipInfo.country_code.toUpperCase();$done({
                title: displayTitle,
                content: `已解锁 (${getFlagEmoji(ipRegion)} ${ipRegion})`,
                icon: tiktokIcon,
                'icon-color': '#000000'
              });
              return;
            }
          } catch (e) {}
        }

        $done({
          title: displayTitle,
          content: '已解锁 (未知地区)',
          icon: tiktokIcon,
          'icon-color': '#000000'
        });
      });
    }
  } else {
    $done({
      title: displayTitle,
      content: `未解锁 (HTTP ${status})`,
      icon: tiktokIcon,
      'icon-color': '#FF9500'
    });
  }
});
