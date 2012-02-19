<%@page import="org.ofbiz.base.util.*" %>
<% 
String errorMsg = (String) request.getAttribute("_ERROR_MESSAGE_");
int leftBracket=errorMsg.lastIndexOf("&#40");
int rightBracket=errorMsg.lastIndexOf("&#41");
if(leftBracket!=-1&&rightBracket!=-1){
	errorMsg =errorMsg.substring(leftBracket+5,rightBracket);	
}

%>
{success:false,message:'<%=errorMsg%>'}