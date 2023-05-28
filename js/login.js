const loginIdValidator = new FieldValidator('txtLoginId',async function(val){
    if(!val){
        return '请填写账号';
    }
})


const loginPwdValidator = new FieldValidator('txtLoginPwd', function(val){
    if(!val){
      return '请填写密码';
    }
  })

  const form = $('.user-form');
  form.onsubmit =  async function(e){
    e.preventDefault();
    const result =  await FieldValidator.validate(
      loginIdValidator,
      loginPwdValidator,
    );
    if(!result){
      return;//验证未通过
    }
   const formData = new FormData(form);
   const data = Object.fromEntries(formData.entries());
   console.log(data);
   const resp  = await API.login(data);
   if(resp.code === 0 ){
    alert('登录成功');
    location.href = './index.html';
   }else{
    loginIdValidator.p.innerText = '账号或密码错误';
    alert('登陆失败');
    loginPwdValidator.input.value = '';
   }
  }