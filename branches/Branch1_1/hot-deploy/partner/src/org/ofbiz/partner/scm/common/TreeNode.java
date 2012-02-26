package org.ofbiz.partner.scm.common;

import java.util.ArrayList;
import java.util.List;

import org.ofbiz.entity.GenericValue;

public class TreeNode {
	private TreeNode parent=null;//父节点
	
	private List<TreeNode> children=null;//子节点
	
	private GenericValue value=null;//节点对应的值
	
	//private int level;//层
	
	//private boolean isLeaf=false;//是否叶子节点
	
	public TreeNode(TreeNode parent,GenericValue v){
		this.parent=parent;
		this.value=v;
		children=new ArrayList<TreeNode>();
		
	}
	
	public void addChild(TreeNode c){
		children.add(c);
	}
	public List<TreeNode> getChildren(){
		return this.children;
	}
	
	public void setParent(TreeNode p){
		this.parent=p;
	}
	public TreeNode getParent(){
		return this.parent;
	}

	public GenericValue getValue() {
		return value;
	}

	public void setValue(GenericValue value) {
		this.value = value;
	}
	

}
