package org.ofbiz.partner.scm.common;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javolution.util.FastMap;

import org.ofbiz.entity.GenericValue;

public class TreeOprCommon {

	/**
	 * 
	 * @param list 需要构建的数列表，必须至少有一个根节点
	 * @return 返回没有父节点的节点列表
	 */
	public static List<TreeNode> buildTree(List<GenericValue> list){
		//构建快速查找表
		Map<String, TreeNode> m=FastMap.newInstance();
		Map<String, Boolean> foundParentMarkerMap=FastMap.newInstance();//是否已经找到父节点标记列表
		for(GenericValue v:list){
			String idStr=v.getString("id");
			if(idStr!=null){
				TreeNode node=new TreeNode(null, v);
				m.put(idStr, node);
				foundParentMarkerMap.put(idStr, Boolean.FALSE);
			}
		}
	
		Set<String> keys=m.keySet();//表键值集合 
		//循环列表找每个节点的父对象，父对象id保存在value对象id字段
		for(String i:keys){
			TreeNode node=m.get(i);
			String parentStr=getParentId(node.getValue());
			//在快速查找列表中查找父节点
			if(parentStr!=null){
				TreeNode parentNode=m.get(parentStr);
				//如果查找到列表则添加父节点，同时为该节点做是否查找父节点标记
				if(parentNode!=null){
					node.setParent(parentNode);//设置父节点
					parentNode.addChild(node);//设置子节点
					foundParentMarkerMap.put(i, Boolean.TRUE);
				}
			}
		}
		
		//构建结果
		List<TreeNode> resultList=new ArrayList<TreeNode>();
		Set<String> markerKeys=foundParentMarkerMap.keySet();
		//抽取没有查找到父节点的节点，构建列表返回
		for(String key:markerKeys){
			if(foundParentMarkerMap.get(key).equals(Boolean.FALSE)){
				resultList.add(m.get(key));
			}
		}
		
		return resultList;
	}

	private static String getParentId(GenericValue v){
		if(v!=null){
			return v.getString("parentId");
		}else{
			return null;
		}
		
	}
}
