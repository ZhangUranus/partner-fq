package org.ofbiz.partner.scm.platform;

import java.io.File;
import java.io.FileWriter;
import java.util.Map;
import java.util.Vector;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;

public class AutoBuild {
	
final String TARGET_FOLDER="F:\\apache\\ofbiz\\apache-ofbiz-10.04\\hot-deploy\\partner\\";

public static void main(String[] args){
	AutoBuild ab=new AutoBuild();
	
	/* first, we init the runtime engine.  Defaults are fine. */

//	String tname="WorkshopOtherDrawBill";//修改这个变量生成不同的单据第一个字母一定要大写
//	String talias="车间其它领料";
//	//field type : int , float ,string ,date ,boolean ,entity,enum
//	Vector<Map<String, String>>	headFields=new Vector<Map<String,String>>();
//	Vector<Map<String, String>>	entryFields=new Vector<Map<String,String>>();
//	Field testfield1=new Field("workshop", "车间","entity","Workshop"); 
//	Field testfield2=new Field("buyer", "领料人","entity","SystemUser"); 
//	Field testfield3=new Field("submitter", "提交人","entity","SystemUser");
//	Field testfield4=new Field("totalsum", "总金额","float");
//	headFields.add(testfield1.getMap());
//	headFields.add(testfield2.getMap());
//	headFields.add(testfield3.getMap());
//	headFields.add(testfield4.getMap());
//	Field testentryfield0=new Field("warehouse", "仓库","entity","Warehouse");
//	Field testentryfield1=new Field("material", "物料","entity","Material");
//	Field testentryfield2=new Field("volume", "数量","float");
//	Field testentryfield3=new Field("unit", "单位","entity","Unit");
//	Field testentryfield4=new Field("price", "单价","float");
//	Field testentryfield5=new Field("refPrice", "参考单价","float");
//	Field testentryfield6=new Field("entrysum", "金额","float");
//	
//	entryFields.add(testentryfield0.getMap());
//	entryFields.add(testentryfield1.getMap());
//	entryFields.add(testentryfield2.getMap());
//	entryFields.add(testentryfield3.getMap());
//	entryFields.add(testentryfield4.getMap());
//	entryFields.add(testentryfield5.getMap());
//	entryFields.add(testentryfield6.getMap());
//	
//    VelocityContext context = new VelocityContext();
//    //设置变量
//    context.put("TemplateName", tname);
//    context.put("TemplateAlias", talias);
//    context.put("HeadFields", headFields);
//    context.put("EntryFields", entryFields);
//
//    ab.buildBaseBill(tname, context);

    
    //-------------生成基础资料
    
//    String tname2="Supplier";
//    String talias2="供应商";
//    VelocityContext context2 = new VelocityContext();
//    Vector<Map<String, String>>	supHeadFields=new Vector<Map<String,String>>();
//	Field supPhone=new Field("phoneNum", "供应商电话"); 
//	Field supAddr=new Field("address", "供应商地址");
//	supHeadFields.add(supPhone.getMap());
//	supHeadFields.add(supAddr.getMap());
//    context2.put("TemplateName",tname2);
//    context2.put("TemplateAlias", talias2);
//    context2.put("HeadFields", supHeadFields);
//    ab.buildBaseData(tname2, context2);
	
}

//生成单据
public void buildBaseBill(String tname,VelocityContext context){
	VelocityEngine velo = new VelocityEngine();
    /* lets make a Context and put data into it */
    velo.setProperty(Velocity.ENCODING_DEFAULT, "utf-8");

    velo.setProperty(Velocity.INPUT_ENCODING,"utf-8");
    velo.setProperty(Velocity.OUTPUT_ENCODING,"utf-8");

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


//生成基础资料
//生成单据
public void buildBaseData(String tname,VelocityContext context){
	VelocityEngine velo = new VelocityEngine();
  /* lets make a Context and put data into it */
  velo.setProperty(Velocity.ENCODING_DEFAULT, "utf-8");

  velo.setProperty(Velocity.INPUT_ENCODING,"utf-8");
  velo.setProperty(Velocity.OUTPUT_ENCODING,"utf-8");

  FileWriter w=null;

	
  try {
  	
  	//生成entity.xml文件
  	w = new FileWriter(TARGET_FOLDER+"entitydef\\"+tname+"Entity.xml");
  	Template t = velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\ofbizEntity\\TemplateEntityModel.xml","utf-8");
		t.merge(context, w);
		w.flush();
		
		//生成model.js 文件
		String modelFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\model\\"+tname+File.separator;
		File modelFolder=new File(modelFolderStr);
		if(!modelFolder.exists()){
			modelFolder.mkdir();
		}
		
		w = new FileWriter(modelFolderStr+tname+"EditModel.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\model\\TemplateEditModel.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(modelFolderStr+tname+"Model.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\model\\TemplateModel.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		//生成store 文件
		String storeFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\store\\"+tname+File.separator;
		File storeFolder=new File(storeFolderStr);
		if(!storeFolder.exists()){
			storeFolder.mkdir();
		}

		
		w = new FileWriter(storeFolderStr+tname+"EditStore.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\store\\TemplateEditStore.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(storeFolderStr+tname+"Store.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\store\\TemplateStore.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		
		//生成view 文件
		String viewFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\view\\"+tname+File.separator;
		File viewFolder=new File(viewFolderStr);
		if(!viewFolder.exists()){
			viewFolder.mkdir();
		}
		w = new FileWriter(viewFolderStr+"EditUI.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\view\\TemplateEditUI.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		w = new FileWriter(viewFolderStr+"ListUI.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\view\\TemplateListUI.js","utf-8");
		t.merge(context, w);
		w.flush();
		
		//生成controller文件
		String controllerFolderStr=TARGET_FOLDER+"webapp\\scmui\\app\\controller\\"+tname+File.separator;
		File controllerFolder=new File(controllerFolderStr);
		if(!controllerFolder.exists()){
			controllerFolder.mkdir();
		}
		w = new FileWriter(controllerFolderStr+tname+"Controller.js");
		t=velo.getTemplate("\\hot-deploy\\partner\\template\\basedata\\controller\\TemplateController.js","utf-8");
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
