package org.ofbiz.partner.scm.pojo;

public class OrderPojo {
	private String property;
	private String direction;

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

	public String toString() {
		return "OrderPojo [property=" + property + ", direction=" + direction + "]";
	}
}
