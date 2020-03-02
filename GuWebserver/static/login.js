function login() {
 
    var username = document.getElementById("ACC");
    var pass = document.getElementById("PWD");
 
    if (username.value == "") {
 
        alert("请输入用户名");
        return false;
    } else if (pass.value  == "") {
 
        alert("请输入密码");
        return false;
    }
    var xmlhttp;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)   //readyState:0~4   4表示请求已完成并且响应已就绪
		{
			//document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
			if(xmlhttp.responseText == "not exist")
			{
				alert("该用户不存在！");
			}
			else if(xmlhttp.responseText == "password error")
			{
				alert("密码错误！");
			}
			else
			{
				alert("登录成功！");
				location.href = "/home.html";
			}
		}
	}
	xmlhttp.open("POST","/user/loginin",true);
	xmlhttp.send("ACC "+username.value+" PWD "+pass.value);

    	return true;
}