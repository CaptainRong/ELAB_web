import React, { createContext, useContext, useEffect,useState } from 'react';
import config from '../config/index'
import { compact, result } from 'lodash';

class UserInfo{
  constructor() {
      this.id=null
      this.name=null
      this.avatar= null
      this.email=null
      this.phone=null
      this.award_winning_experience=null
      this.project_experience=null
      this.position=null
      this.department=null
      
      this.gender=null
      this.college=null
      this.major=null
      this.classname=null
      this.time_of_enrollment=null
      this.join_date=null
      this.native_place=null
      this.photograph=null
      this.reason_for_application=null

      this.isLogined=false
      this.loginMessage='未登录，请登录'

      this.have_unfinished_mail=null
      this.have_unfinished_matter=null
      this.permission=null
  }
}

// 用户管理类
class UserManager {
  constructor( state= null,callbackFunction = null) {
    this.state=state
    this.callbackFunction=callbackFunction
  }
  //获取用户的额外信息
  async getUserExtendedInfo(user_id,userInfo){
    fetch(config['API']['USER_API']['get_user_extended_info'],{
      credentials: 'include',
      method:'GET',
    })
    .then(response => response.json())
    .then(result=>{
      if(result.result=='ok'){
        this.setUserInfo({
          ...userInfo,
          have_unfinished_mail:result.data.have_unfinished_mail,
          have_unfinished_matter:result.data.have_unfinished_matter,
          permission:result.data.permission
        })
      }else{
        this.setUserInfo({loginMessage:result.message})
      }    
    })
    .catch(error=>{
      this.setUserInfo({error})

    })
  }

  //获取用户信息
  async getUserInfo(user_id){
    try {
      const response = await fetch(config['API']['USER_API']['get_user_info'] + `?user_id=${user_id}`, {
        credentials: 'include',
        method: 'GET',
      });
  
      const result = await response.json();
  
      if (result.result === 'ok') {
        const userInfo = {
          id: result.data.id,
          name: result.data.name,
          avatar: result.data.avatar,
          email: result.data.email,
          phone: result.data.phone,
          award_winning_experience: result.data.award_winning_experience,
          project_experience: result.data.project_experience,
          position: result.data.position,
          department: result.data.department,
  
          gender: result.data.gender,
          college: result.data.college,
          major: result.data.major,
          classname: result.data.classname,
          time_of_enrollment: result.data.time_of_enrollment,
          join_date: result.data.join_date,
          native_place: result.data.native_place,
          photograph: result.data.photograph,
          reason_for_application: result.data.reason_for_application,
  
          isLogined: true,
          loginMessage: '登陆成功',
        };
  
        return userInfo;
      } else {
        this.setUserInfo({loginMessage:result.message})
      }
    } catch (error) {
      console.error(error)
      this.setUserInfo({error})
    }
  }

  async init(){
    //验证是否登陆
    try {
      const validate_response = await fetch(config['API']['AUTH_API']['validate-login'],{
                  credentials: 'include',
                  method:'GET'
                })
      const validate_result = await validate_response.json()
      
      if (validate_result.result=='ok'){
        var userInfo=await this.getUserInfo(validate_result.user_id)
        await this.getUserExtendedInfo(validate_result.user_id,userInfo)
      }
    }catch (error) {
      this.setUserInfo({login_message:error})
    }  
  }

  setUserInfo(newState){
    var newUserInfo={...this.state}
    for (var i in newState){
      newUserInfo[i]=newState[i]
    }
    this.callbackFunction(newUserInfo)
  }

  updateUserInfo(){
    this.init()
  }
}

// 创建用户上下文
const UserContext = createContext();


// 创建提供者组件
function UserProvider({ children }){
  // 创建用户管理类的实例
  const [state, setUserInfo] = useState(new UserInfo());
  const userManager = new UserManager(state,setUserInfo);
  useEffect(()=>{
    userManager.init()
  },[])

  return <UserContext.Provider value={[userManager,state]}>{children}</UserContext.Provider>;
};



// 创建自定义 hook 以使用用户上下文
function useUserContext(){
  const [userManger,state] = useContext(UserContext);
  return [userManger,state]
};

export { UserProvider, useUserContext };