//
//  PXDynamicViewControllerProtocol.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 22/10/18.
//

import Foundation

@objc public enum PXDynamicViewControllerPosition: Int {
    case DID_ENTER_REVIEW_AND_CONFIRM
    case DID_TAP_ONETAP_HEADER
}

@objc public protocol PXDynamicViewControllerProtocol: NSObjectProtocol {
    @objc func viewController(store: PXCheckoutStore) -> UIViewController?
    @objc func position(store: PXCheckoutStore) -> PXDynamicViewControllerPosition
    @objc optional func navigationHandler(navigationHandler: PXPluginNavigationHandler)
}
