import { useState,useContext,createContext,useEffect } from 'react';
import config from '../config/index'

class SiteInfo{
    constructor(data={announcement:'',about:[]}){
        this.announcement=data.announcement
        this.about=data.about
    }
}

//创建弹窗上下文
const SiteContext = createContext();

function SiteProvider({ children }){
    const [siteinfo, setSiteInfo] = useState(new SiteInfo());

    function updateSiteInfo(){
        fetch(config['API']['WEB_API']['get_public_message'],{
            method:'GET',
                  credentials: 'include',
          })
          .then(response=>response.json())
          .then(result=>{
            if(result.result=='ok'){
              setSiteInfo(new SiteInfo(result.data))
            }
          })
    }
    useEffect(()=>{
        updateSiteInfo()
    },[])
    return(
        <SiteContext.Provider value={[siteinfo,updateSiteInfo]}>
            {children}
        </SiteContext.Provider>
    )
}

function useSiteContext(){
    const [siteinfo,updateSiteInfo] = useContext(SiteContext);
    return [siteinfo,updateSiteInfo]
  };


export default useSiteContext
export {SiteProvider}
