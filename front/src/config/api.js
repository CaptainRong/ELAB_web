const auth_api={
  'login':'/api/auth/login',
  'logout':'/api/auth/logout',
  'validate-login':'/api/auth/validate-login',
}

const user_api={
  'get_user_info':'/api/user',
  'modify_user_info':'/api/user',
  'upload_avatar':'/api/user/avatar',
  'upload_photograph':'/api/user/photograph',
  'get_members':'/api/user/members',
  'get_user_extended_info':'/api/user/extended-info',
}


const mail_api={
  'send_mail':'/api/mail',
  'sendable_object':'/api/mail/sendable-objects',
  'get_mailbox':'/api/mail/mailbox',
  'get_mail_details':'/api/mail',
}

const service_api={
  'material_manage':{
    'get_materials':'/api/service/material',
    'add_material':'/api/service/material',
    'delete_material':'/api/service/material',
    'modify_material':'/api/service/material',
    'checkin_material':'/api/service/material/checkin',
    'checkout_material':'/api/service/material/checkout',
    'get_materail_logs':'/api/service/material/logs',
  },
  'sign_in_system':{
    'initiate_sign_in':'/api/service/signin',
    'able_object':'/api/service/signin/able-object',
    'get_personal_sign_in':'/api/service/signin/personal',
    'get_hall_sign_in':'/api/service/signin/hall',
    'get_details':'/api/service/signin',
    'check_in':'/api/service/signin/check-in',
    'get_records':'/api/service/signin/records',
    'get_record':'/api/service/signin/record',
  },
  'clock_in_system':{
    'start_clock_in':'/api/service/clockin/start',
    'end_clock_in':'/api/service/clockin/end',
    'get_status':'/api/service/clockin',
    'get_all_user_status':'/api/service/clockin/status',
    'get_record':'/api/service/clockin/record',
    'get_history':'/api/service/clockin/history',
  },
}
const web_api={
  'get_public_message':'/api/site',
  'get_setting':'/api/site/setting',
}

export {user_api,auth_api,mail_api,service_api,web_api}