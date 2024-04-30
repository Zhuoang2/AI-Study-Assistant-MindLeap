document.addEventListener('DOMContentLoaded', function() {
    // 获取用户信息的API请求
    fetch('/api/User', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include' // 确保credentials或cookies被发送
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
        // 使用从服务器获取的数据填充表单
        if (data.status === 'error') {
            console.log('Error:', data.message);
        }
        document.getElementById('userID').value = data.user.id;
        document.getElementById('userName').value = data.user.name;
        document.getElementById('userEmail').value = data.user.email;
        document.getElementById('userPassword').value = data.user.password;
        if (data.user.Address !== "") {
            document.getElementById('useradress').value = data.user.Address;
        }
        if (data.user.profile !== "") {
            document.getElementById('userProfile').value = data.user.profile;
        }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });