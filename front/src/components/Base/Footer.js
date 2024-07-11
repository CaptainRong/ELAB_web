import config from "../../config";
function Footer(){
  return (
    <footer id='fonter' >
      <div className="text-center">
        <p>本网站由科中极创组制作。<br/>
          联系我们：qq3298357245<br/>
          当前版本：{config['NOW_WEB_VERSION']}&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="/update_log.txt" download>更新日志</a>
        </p>
      </div>
    </footer>
  )
}
export default Footer;