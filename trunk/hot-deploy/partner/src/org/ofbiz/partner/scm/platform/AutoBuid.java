package org.ofbiz.partner.scm.platform;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import javolution.util.FastList;
import javolution.util.FastMap;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.GenericValue;

import net.sf.json.JSONObject;

public class AutoBuid {
public static void main(String[] args){
	/* first, we init the runtime engine.  Defaults are fine. */

	String tname="PurchaseBill";//修改这个变量生成不同的单据第一个字母一定要大写
	//field type : int , float ,string ,date ,boolean ,entity,enum
	Vector<Map<String, String>>	headFields=new Vector<Map<String,String>>();
	Vector<Map<String, String>>	entryFields=new Vector<Map<String,String>>();
	Field testfield1=new Field("myfield1", "自定义字段1");
	Field testfield2=new Field("myfield2", "自定义字段2","date");
	testfield2.setListVisible(false);
	Field testfield3=new Field("myfield3", "自定义字段3","boolean");
	Field testfield4=new Field("myfield4", "自定义字段4","entity","Unit");
	Field testfield5=new Field("myfield5", "自定义字段5","int");
	Field testfield6=new Field("myField6","自定义字段6","enum");
	testfield6.setEnumStore("Ext.partner.basiccode.billStatusStore");
	testfield6.setEnumRender("Ext.partner.basiccode.billStatusRenderer");
	headFields.add(testfield1.getMap());
	headFields.add(testfield2.getMap());
	headFields.add(testfield3.getMap());
	headFields.add(testfield4.getMap());
	headFields.add(testfield5.getMap());
	headFields.add(testfield6.getMap());
	Field testentryfield1=new Field("myentryfield1", "自定义字段1");
	Field testentryfield2=new Field("myentryfield2", "自定义字段2","date");
	Field testentryfield3=new Field("myentryfield3", "自定义字段3","boolean");
	Field testentryfield4=new Field("myentryfield4", "自定义字段4","entity","Unit");
	Field testentryfield5=new Field("myentryfield5", "自定义字段5","float");
	Field testentryfield6=new Field("myentryfield6", "自定义字段6","int");
	Field testentryfield7=new Field("myentryfield7","自定义字段7","enum");
	testentryfield7.setEnumStore("Ext.partner.basiccode.billStatusStore");
	testentryfield7.setEnumRender("Ext.partner.basiccode.billStatusRenderer");
	
	entryFields.add(testentryfield1.getMap());
	entryFields.add(testentryfield2.getMap());
	entryFields.add(testentryfield3.getMap());
	entryFields.add(testentryfield4.getMap());
	entryFields.add(testentryfield5.getMap());
	entryFields.add(testentryfield6.getMap());
	entryFields.add(testentryfield7.getMap());
	
	final String TARGET_FOLDER="D:\\Learning\\ofbiz\\apache-ofbiz-10.04\\hot-deploy\\partner\\";
	
	VelocityEngine velo = new VelocityEngine();
    /* lets make a Context and put data into it */
    velo.setProperty(Velocity.ENCODING_DEFAULT, "utf-8");

    velo.setProperty(Velocity.INPUT_ENCODING,"utf-8");
    velo.setProperty(Velocity.OUTPUT_ENCODING,"utf-8");
    VelocityContext context = new VelocityContext();
    //设置变量
    context.put("TemplateName", tname);
    context.put("HeadFields", headFields);
    context.put("EntryFields", entryFields);
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
