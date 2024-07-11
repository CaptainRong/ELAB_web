
import { useUserContext } from '../context/UserContext';


function RequirePermission({allow,notallow,required}){
    const [userManager,state]= useUserContext();

    return (
        <div className="require-permission">
            {state.permission.includes(required)?allow:notallow}
        </div>
    )
}

export {RequirePermission};
