function sendWakeOnLan() {
  $.post('/api/v1/net/wol', { macAddress: '8C:04:BA:9D:89:21' });
}
