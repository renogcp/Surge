/**
 * Surge Panel: TikTok Unlock Check (Support Custom Policy)
 */

// 获取传入的自定义策略名称 (例如 argument=policy=TikTok)
let policy = null;
if (typeof $argument !== 'undefined' && $argument) {   const args = {};$argument.split('&').forEach((item) => {
    const [key, val] = item.split('=');
    if (key && val) args[key] = decodeURIComponent(val);
  });
  if (args.policy) {
    policy = args.policy;
  }
}

const url = 'https://www.tiktok.com/';
const requestConfig = {
  url: url,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
  timeout: 8000,
};

// 如果指定了策略名称，则将节点绑定到该策略
if (policy) {
  requestConfig.node = policy;
}

$httpClient.get(requestConfig, function (error, response, data) {
  const titleText = policy ? `TikTok 解锁 (${policy})` : 'TikTok 解锁状态';

  if (error) {
    $done({
      title: titleText,
      content: '网络连接超时 / 请求失败',
      icon: 'waveform.path.badge.minus',
      'icon-color': '#F44336',
    });
    return;
  }

  const resHeaders = {};
  if (response && response.headers) {
    Object.keys(response.headers).forEach((key) => {
      resHeaders[key.toLowerCase()] = response.headers[key];
    });
  }

  const status = response.status;

  if (status === 200 || status === 301 || status === 302) {
    let region = resHeaders['x-ip-country'] || resHeaders['x-country-code'] || '';
    region = region.toUpperCase();

    let flag = '';
    if (region && region.length === 2) {
      flag = String.fromCodePoint(
        ...region.split('').map((char) => 127397 + char.charCodeAt(0))
      );
    }

    $done({
      title: titleText,
      content: region ? `已解锁 (${flag} ${region})` : '已解锁 (未知地区)',
      icon: 'sparkles.tv',
      'icon-color': '#34C759',
    });
  } else if (status === 403 || status === 451) {
    $done({
      title: titleText,
      content: `未解锁 (${status} IP 被拒)`,
      icon: 'xmark.shield',
      'icon-color': '#FF9500',
    });
  } else {
    $done({
      title: titleText,
      content: `检测异常 (HTTP ${status})`,
      icon: 'exclamationmark.triangle',
      'icon-color': '#FF9500',
    });
  }
});
