//
//  PXPaymentMethodConfigProtocol.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/**
 Implement this Protocol to show and optional screen `UIViewController` in your custom payment method flow. (Configure custom payment method step). We push this screen after you choose the means of payment.
 */
@objc public protocol PXPaymentMethodConfigProtocol {
    /**
     Define your custom config screen ViewController.
     */
    @objc func configViewController() -> UIViewController?
    /**
     Use this method to decide whether the screen should show or not.
     - parameter store: `PXCheckoutStore` reference. Use it to check scenarios/data.
     */
    @objc func shouldSkip(store: PXCheckoutStore) -> Bool
    /**
     Optional method to receive the `PXCheckoutStore` data and current theme `PXTheme`.
     - parameter checkoutStore: `PXCheckoutStore` reference.
     - parameter theme: `PXTheme` current protocol.
     */
    @objc optional func didReceive(checkoutStore: PXCheckoutStore, theme: PXTheme)
    /**
     Optional method to receive the plugin navigation handler. Use this to execute next screen, show loading, etc.
     - parameter navigationHandler: `PXPluginNavigationHandler` reference.
     */
    @objc optional func navigationHandler(navigationHandler: PXPluginNavigationHandler)
}
