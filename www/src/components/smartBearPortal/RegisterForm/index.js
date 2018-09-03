import React,{Component} from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.css'
import {API_PATH} from '../../../constants/OriginName';
import AuthProvider from "../../../funStore/AuthProvider";
import promiseXHR from '../../../funStore/ServerFun';
import {verifyPhone,verifyCode,getQueryString} from '../../../funStore/UtilsFunc';
import {APP_ID} from '../../../constants/Constant';
import AccountInfo from '../../../funStore/AccountInfo';
import LoadingAnimationA from '../../shareComponent/LoadingAnimationA'
var timer;
class RegisterForm extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:true,
            params:{
                appId:'',
                openId:'',
                unionId:'',
                headUrl:'',
                nickName:'',
                identCode:'',
                phoneNum:'',
                verifyCode:'',
            },
            verifyTip:'',
            verifyCode:'获取验证码',
            codeDisabled:true,
            btnDisabled:true,
            radioSelect:true
        }
    }


    componentDidMount(){
        document.title='注册';
       this.weChatHandle()
    }

    weChatHandle=()=>{
        const {history} =this.props
        //1.微信授权 获取unionId 并保存
        let  identCode=getQueryString('identCode')
        AccountInfo.requestUnionId().then(res=>{
            const accountInfo = res;//用户信息
            console.log(res)
            this.setState({
                params:{
                    appId:APP_ID,
                    unionId:res.unionid,
                    openId:res.openid,
                    headUrl:res.headUrl,
                    nickName:res.nickName,
                    identCode:identCode
                }
            })
            // 2.获取unionid之后判断是否注册，成功直接登录跳转
            const url = `${API_PATH}//activity-api/noauth/chatpet/isregister?_unionId=${accountInfo.unionid}`
            promiseXHR(url,null,null,'GET').then(res=>{
                const resData = JSON.parse(res)
                if(resData.resultContent){//已经注册 登录 登录成功跳转
                    history.push('/chatpet/howadopt')
                }else{//没有注册
                    this.setState({
                        loading : false
                    })
                }
            })
        }).catch(err => {
            console.log(err)
            history.push('/chatpet/errorbear')
        })
    }

    handleChangePhone=(e)=>{
        const {params,radioSelect} =this.state
        let phoneValue = e.target.value;
        params[e.target.name] = phoneValue
        this.setState({params})
        if(verifyPhone(phoneValue)) {
            this.setState({codeDisabled: false})//判断code
            if(verifyCode(params.verifyCode)&&radioSelect){
                this.setState({btnDisabled:false})
            }else{
                this.setState({btnDisabled:true})
            }
        }else{
            this.setState({codeDisabled: true,btnDisabled:true})
        }
    }

    handleChangeCode=(e)=>{
        const {params,radioSelect} =this.state;
        let codeValue= e.target.value;
        params[e.target.name]=e.target.value
        this.setState({params})
        if(verifyCode(codeValue)&&verifyPhone(params.phoneNum)&&radioSelect){
            this.setState({btnDisabled:false})
        }else{
            this.setState({btnDisabled:true})
        }
    }

    handleClickRadio=()=>{
        const {params,radioSelect} =this.state;
        let self = this
        this.setState({
            radioSelect:!this.state.radioSelect
        })
        if(verifyCode(params.verifyCode)&&verifyPhone(params.phoneNum)&&!radioSelect){
            self.setState({btnDisabled:false})
        }else{
            self.setState({btnDisabled:true})
        }

    }
    //获取验证码
    getVerifyCode=()=>{
        let phone = this.state.params.phoneNum;
        this.codeCountDown(60)
        let url =API_PATH + '/basis-api/noauth/usermgmt/sendPhoneCode?_templateCode=CHAT_PET_TEMPLATE_VCODE_MSG&_phone='+phone;
        promiseXHR(url, null,null, 'GET')
            .then((res)=>{
                if(JSON.parse(res).resultCode == '100'){
                    this.showVerifyTip('验证码已发出')
                    this.setState({
                        codeDisabled: true
                    })
                }
            })
    }

   handleRegister=()=> {
       const {params} = this.state
       let url = API_PATH + '/activity-api/noauth/chatpet/register'
       console.log(params,'params')
       promiseXHR(url, null, params, 'POST')
           .then((res) => {
               console.log(res, '11111')
               const resData = JSON.parse(res)
               switch (resData.resultCode) {
                   case '100':
                       this.showVerifyTip('注册成功')
                       this.props.history.push('/chatpet/howadopt')
                       break;
                   case '02536001'://该手机号已注册
                       this.showVerifyTip('该手机号已注册')
                       break;
                   case '02536002'://验证码已过期
                       this.showVerifyTip('验证码已过期')
                       break;
                   case '02536003'://用户已注册
                       this.showVerifyTip('验证码不正确')
                       break;
                   case '02536004'://注册失败
                       this.showVerifyTip('注册失败')
                       break;
                   default:
                       this.showVerifyTip('注册失败')
                       break;
               }

           })
   }

    codeCountDown(time) {
        let self = this
        timer = setInterval(function () {
            time--;
            if (time < 0) {
                clearInterval(timer)
                self.setState({
                    codeDisabled:false,
                    verifyCode: '获取验证码',
                })

            } else {
                self.setState({
                    codeDisabled:true,
                    verifyCode: time + 's'
                })
            }
        }, 1000)
    }

    componentWillUnmount(){
        clearInterval(timer)
    }

    showVerifyTip=(text)=>{
        let self = this;
        self.setState({
            verifyTip:text
        })

        setTimeout(function () {
            self.setState({
                verifyTip:''
            })
        },2000)
    }
    render(){
       const {loading,verifyTip,verifyCode,codeDisabled,btnDisabled,radioSelect}=this.state;
        return <div className='containter'>
            {
                loading?<LoadingAnimationA/>:

                    <div styleName='register-containter'>
                        <div styleName='title'>
                            <div styleName='login-title'/>
                        </div>
                        <div styleName='register-content'>
                            <div styleName="inputBox">
                                <input type="text" maxLength={11} placeholder='请输入手机号' name='phoneNum' onChange={this.handleChangePhone}/>
                            </div>
                            <div styleName='inputBox clearfix'>
                                <div styleName='codeInput'>
                                    <input type="text" maxLength={6} placeholder='请输入验证码' name='verifyCode' onChange={this.handleChangeCode}/>
                                </div>
                                <span styleName='codePrompt'/>
                                <button styleName={`getCode ${codeDisabled?'':'getCodeRight'}`} disabled={codeDisabled} onClick={this.getVerifyCode}>{verifyCode}</button>
                            </div>
                            <div styleName='agreementBox'>
                                <span styleName={`selected ${radioSelect?'':'noSelected'}`} onClick={this.handleClickRadio}/> 我已同意 <span styleName='agreement'>《领养协议》</span>
                            </div>
                            <div styleName='btnBox'>
                                <button styleName={`joinBtn ${btnDisabled?'':'registerBnt'}`} disabled={btnDisabled} onClick={this.handleRegister}>确认领养</button>
                            </div>
                        </div>
                        {verifyTip!=''?<div styleName='verifyTipBox'>{verifyTip}</div>:null}

                    </div>
            }

        </div>
    }
}

export default CSSModules(RegisterForm,styles,{allowMultiple:true})