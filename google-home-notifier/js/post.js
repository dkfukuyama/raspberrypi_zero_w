function post(data) {
  xhr = new XMLHttpRequest();
  xhr,open('POST', '/play_music/')
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  // フォームに入力した値をリクエストとして設定
  xhr.send(data);
}
