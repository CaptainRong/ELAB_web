import { auth_api,user_api,mail_api,service_api,web_api } from "./api"
import { permission } from "./permission"

var config={
  //后端appi配置
  'API':{
    'AUTH_API':auth_api,
    'USER_API':user_api,
    'MAIL_API':mail_api,
    'SERVICE_API':service_api,
    'WEB_API':web_api
  },
  
  //用户权限配置
  'PERMISSION':permission,


  'MAIL':{
    'MAILBOX_SINGLE_PAGE_SIZE':10,
  },

  'NOW_WEB_VERSION':process.env.REACT_APP_NOW_WEB_VERSION,
  'BACKEND_ADDRESS':process.env.REACT_APP_BACKEND_ADDRESS
}
config['BACKEND_ROOT_URL']='http://'+config['BACKEND_ADDRESS']

modifyURL(config['API'])

function modifyURL(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = config['BACKEND_ROOT_URL']+obj[key];
    } else if (typeof obj[key] === 'object') {
      modifyURL(obj[key]);
    }
  }
}


export default config

