//
//  PXTrackerListener.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 29/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
Protocol to stay notified about our tracking screens/events.
 */
@objc public protocol PXTrackerListener: NSObjectProtocol {
    /**
        This method is called when a new screen is shown to the user and tracked by our Checkout.
     - parameter screenName: Screenname Melidata catalog.
     - parameter extraParams: Extra data.
     */
    func trackScreen(screenName: String, extraParams: [String: Any]?)
    /**
     This method is called when a new event is ocurred to the user and tracked by our Checkout.
     - parameter screenName: Event name.
     - parameter action: action.
     - parameter result: result.
     - parameter extraParams: Extra data.
     */
    func trackEvent(screenName: String?, action: String!, result: String?, extraParams: [String: Any]?)
}
