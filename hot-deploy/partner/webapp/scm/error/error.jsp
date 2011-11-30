<%@ page import="org.ofbiz.base.util.*" %>
<% String errorMsg = (String) request.getAttribute("_ERROR_MESSAGE_"); %>
{success:false,message:'<%=errorMsg%>'}