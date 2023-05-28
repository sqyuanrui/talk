(async function(){
    const resp = await API.profile();
    const user = resp.data;
    if(!user){ 
        alert('登录失败');
        location.href = '../login.html';
        return;  
    }

    const doms = {
        aside : {
            nickname : $('#nickname'),
            loginId : $('#loginId'),
        },
        close : $('.close'),
        chatContainer : $('.chat-container'),
        txtMsg : $('#txtMsg'),
        msgContainer : $('.msg-container'),
    }
    //下面的代码环境一定是登录状态
    setUserInfo();
    //注销事件
    doms.close.onclick = function() {
        API.loginOut();
        location.href = '../login.html';
    }


//设置用户信息
    function setUserInfo(){
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }

    //加载历史记录
    await loadHistory();
    async function loadHistory(){  
       const resp =  await API.getHistory();
       for (const item of resp.data) {
            addChat(item);
       }
       scrollBottom();
    }
    //发送信息
    doms.msgContainer.onsubmit = function(e){
        e.preventDefault();
        sendChat();
    }

    //将发送的信息添加到框中
    function addChat(chatInfo){
        const div = $$$('div');
        div.classList.add('chat-item');
        if(chatInfo.form){
            div.classList.add('me');
        }
        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.form ? './asset/avatar.png':'./asset/robot-avatar.jpg';
        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;

        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = formDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);
        doms.chatContainer.appendChild(div);
    }
    //滚动到最后
    function scrollBottom(){
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
    }

    function formDate(timestamp){
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    async function sendChat(){
       const content = doms.txtMsg.value.trim();
       if(!content){
        return;
       }
       addChat({
        form : user.loginId,
        to : null,
        createdAt : Date.now(),
        content,
       });
       doms.txtMsg.value = '';
       scrollBottom();
      const resp = await API.sendChat(content);
      addChat({
        form : null,
        to : user.loginId,
        ...resp.data,
      })
      scrollBottom();
    }
    window.sendChat = sendChat;

    
})();

