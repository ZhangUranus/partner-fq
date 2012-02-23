package org.ofbiz.partner.scm.common;

import java.io.File;
import java.io.FileWriter;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;

public class AutoBuid {
public static void main(String[] args){
	/* first, we init the runtime engine.  Defaults are fine. */

	String tname="PurchaseBill";//修改这个变量生成不同的单据第一个字母一定要大写
	
	
	
	final String TARGET_FOLDER="D:\\Learning\\ofbiz\\apache-ofbiz-10.04\\hot-deploy\\partner\\";
	
	VelocityEngine velo = new VelocityEngine();
    /* lets make a Context and put data into it */
    velo.setProperty(Velocity.ENCODING_DEFAULT, "utf-8");

    velo.setProperty(Velocity.INPUT_ENCODING,"utf-8");
    velo.setProperty(Velocity.OUTPUT_ENCODING,"utf-8");
    VelocityContext context = new VelocityContext();
    //设置变量
    context.put("TemplateName", tname);

    /* lets render a template */

    
    FileWriter w=null;

	
    try {
    	
    	//生成entity.xml文件
    	w = new FileWriter(TARGET_FOLDER+"entitydef\\"+tname+"Entity.xml");
    	Template t = velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\ofbizEntity\\TemplateEntityModel.xml","utf-8");
		t.merge(context, w);
		w.flush();
		
		//生成model.js 文件
		String modelFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\model\\"+tname+File.separator;
		File modelFolder=new File(modelFolderStr);
		if(!modelFolder.exists()){
			modelFolder.mkdir();
		}
		//action model 
		w = new FileWriter(modelFolderStr+tname+"ActionModel.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\model\\TemplateActionModel.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(modelFolderStr+tname+"EditEntryModel.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\model\\TemplateEditEntryModel.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(modelFolderStr+tname+"EditModel.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\model\\TemplateEditModel.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(modelFolderStr+tname+"Model.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\model\\TemplateModel.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		//生成store 文件
		String storeFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\store\\"+tname+File.separator;
		File storeFolder=new File(storeFolderStr);
		if(!storeFolder.exists()){
			storeFolder.mkdir();
		}
		//
		w = new FileWriter(storeFolderStr+tname+"EditEntryStore.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\store\\TemplateEditEntryStore.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(storeFolderStr+tname+"EditStore.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\store\\TemplateEditStore.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(storeFolderStr+tname+"Store.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\store\\TemplateStore.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		
		//生成view 文件
		String viewFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\view\\"+tname+File.separator;
		File viewFolder=new File(viewFolderStr);
		if(!viewFolder.exists()){
			viewFolder.mkdir();
		}
		w = new FileWriter(viewFolderStr+"EditUI.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\view\\TemplateEditUI.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(viewFolderStr+"ListUI.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\view\\TemplateListUI.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		//生成controller文件
		String controllerFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\controller\\"+tname+File.separator;
		File controllerFolder=new File(controllerFolderStr);
		if(!controllerFolder.exists()){
			controllerFolder.mkdir();
		}
		w = new FileWriter(controllerFolderStr+tname+"Controller.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\billbase\\controller\\TemplateController.js","utf-8");
		t.merge(context, w);
		w.flush();
		/* lets make our own string to render */
//
//	    String s = "We are using $project $name to render this.";
//	    w = new StringWriter();
//	    Velocity.evaluate( context, w, "mystring", s );
//	    System.out.println(" string : " + w );
		
	} catch (ResourceNotFoundException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (ParseErrorException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (MethodInvocationException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}

    
	
}
}
