
import  { useEffect,useState } from 'react';
import { useUserContext } from '../context/UserContext';


function RequireLogin({logined,notlogin}){
    const [userManager,state]= useUserContext();

    return (
        <div className="require-login">
            {state.isLogined?logined:notlogin}
        </div>
    )
}

export {RequireLogin};





