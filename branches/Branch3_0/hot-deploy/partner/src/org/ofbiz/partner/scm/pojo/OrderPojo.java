package org.ofbiz.partner.scm.pojo;

public class OrderPojo {
	private String property;
	private String direction;
	private String root;
	private String transform;
	private String sort;
	

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}
	
	public String getRoot() {
		return root;
	}

	public void setRoot(String root) {
		this.root = root;
	}

	public String getTransform() {
		return transform;
	}

	public void setTransform(String transform) {
		this.transform = transform;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String toString() {
		return "OrderPojo [property=" + property + ", direction=" + direction + "]";
	}
}
