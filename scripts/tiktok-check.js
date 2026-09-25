/**
 * Surge Panel: TikTok Unlock Check
 */

const url = 'https://www.tiktok.com/';
const headers = {
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
};

$httpClient.get({ url: url, headers: headers }, function (error, response, data) {
  if (error) {
    $done({
      title: 'TikTok 检测',
      content: '网络连接失败',
      icon: 'waveform.path.badge.minus',
      'icon-color': '#F44336',
    });
    return;
  }

  if (response.status === 200) {
    // 尝试获取响应头中的服务地区
    let region = '';
    if (response.headers['x-ip-country']) {
      region = response.headers['x-ip-country'].toUpperCase();
    } else if (response.headers['X-IP-Country']) {
      region = response.headers['X-IP-Country'].toUpperCase();
    }

    // 格式化国旗 Emoji
    let flag = '';
    if (region && region.length === 2) {
      flag = String.fromCodePoint(
        ...region.split('').map((char) => 127397 + char.charCodeAt(0))
      );
    }

    $done({
      title: 'TikTok 解锁状态',
      content: region ? `已解锁 (${flag} ${region})` : '已解锁 (未知地区)',
      icon: 'sparkles.tv',
      'icon-color': '#34C759',
    });
  } else if (response.status === 403) {
    $done({
      title: 'TikTok 解锁状态',
      content: '未解锁 (403 Forbidden / IP 被拒)',
      icon: 'xmark.shield',
      'icon-color': '#FF9500',
    });
  } else {
    $done({
      title: 'TikTok 解锁状态',
      content: `检测异常 (HTTP ${response.status})`,
      icon: 'exclamationmark.triangle',
      'icon-color': '#FF9500',
    });
  }
});
