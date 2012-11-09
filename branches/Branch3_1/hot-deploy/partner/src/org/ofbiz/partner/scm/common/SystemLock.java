package org.ofbiz.partner.scm.common;

public class SystemLock {
	private static  boolean isLock=false;

	public static boolean isLock() {
		return isLock;
	}

	public static void setLock(boolean isLock) {
		SystemLock.isLock = isLock;
	}
	
}
