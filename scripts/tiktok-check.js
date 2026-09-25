const policy = $argument ? ($argument.match(/policy=([^&]+)/) || [])[1] : null;

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

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

$httpClient.get(tiktokReq, function (error, response, data) {
  const displayTitle = 'TikTok 解锁检测';
  const tiktokIcon = 'https://gitlab.com/myouhi/Surge/-/raw/main/icon/qure/color/TikTok_Alt.png';

  if (error) {
    $done({
      title: displayTitle,
      content: '连接超时 / 节点不可用',
      icon: tiktokIcon
    });
    return;
  }

  const status = response.status;
  if (status === 200 || status === 301 || status === 302) {
    const headers = {};
    if (response.headers) {
      Object.keys(response.headers).forEach(k => headers[k.toLowerCase()] = response.headers[k]);
    }

    let region = headers['x-ip-country'] || headers['x-country-code'] || headers['cf-ipcountry'] || '';

    if (region && region.length === 2) {
      region = region.toUpperCase();
      $done({
        title: displayTitle,
        content: `已解锁 (${getFlagEmoji(region)} ${region})`,
        icon: tiktokIcon
      });
    } else {
      const ipReq = {
        url: 'https://ipwho.is/',
        timeout: 5000
      };
      if (policy) ipReq['policy'] = decodeURIComponent(policy);

      $httpClient.get(ipReq, function (ipErr, ipRes, ipData) {         if (!ipErr && ipData) {           try {             const ipInfo = JSON.parse(ipData);             if (ipInfo && ipInfo.country_code) {               const ipRegion = ipInfo.country_code.toUpperCase();$done({
                title: displayTitle,
                content: `已解锁 (${getFlagEmoji(ipRegion)} ${ipRegion})`,
                icon: tiktokIcon
              });
              return;
            }
          } catch (e) {}
        }

        $done({
          title: displayTitle,
          content: '已解锁 (未知地区)',
          icon: tiktokIcon
        });
      });
    }
  } else {
    $done({
      title: displayTitle,
      content: `未解锁 (HTTP ${status})`,
      icon: tiktokIcon
    });
  }
});

