function post(data) {
  xhr = new XMLHttpRequest();
  xhr,open('POST', '/play_music/')
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  // �t�H�[���ɓ��͂����l�����N�G�X�g�Ƃ��Đݒ�
  xhr.send(data);
}
