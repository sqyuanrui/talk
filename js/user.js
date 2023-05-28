//用户登录和注册的表单项通用代码
class FieldValidator{
    /**
     * 构造器
     * @param {String} txtId 文本框的id
     * @param {Function} validatorFunc 验证规则函数，当需要对该文本进行验证时，会调用该函数。函数的参数为当前文本框的值，函数的返回值为验证的错误消息。若没有返回则表示无错误
     */
    constructor(txtId,validatorFunc){
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = ()=>{
            this.validate();
        }
    }
    /**
     * 验证，成功返回true，失败返回false
     */
    async validate(){
      const err = await this.validatorFunc(this.input.value)
      if(err){
        //有错误
        this.p .innerText = err;
        return false;
      }else{
        this.p.innerText = '';
        return true; 
      }
    }
    /**
     * 对传入的所有验证器进行统一验证，，如果验证都通过则返回true，如果有一个没通过则返回false
     */
    static async validate(...validators){
     const proms = validators.map((v)=>v.validate());
     const results = await Promise.all(proms);
     return results.every(r=>r);

    }
}
