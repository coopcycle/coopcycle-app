//
//  PXPaymentProcessor.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 23/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 Implement this protocol to create your custom Payment Processor.
 */
@objc public protocol PXPaymentProcessor: NSObjectProtocol {

    /**
      ViewController associated to your Payment Processor. This is optional VC. If you need a screen to make the payment, return your Payment processor viewController. If you return nil, we use our custom Animated progress Button.
     */
    @objc func paymentProcessorViewController() -> UIViewController?
    /**
     Use this method to decide if your Payment Processor support the Payment.
     */
    @objc func support() -> Bool
    /**
     Receive a navigation handler for your custom Payment Processor. `PXPaymentProcessorNavigationHandler`. If you create your custom vieeController to make the payment, you should use it this handler.
     - parameter navigationHandler: Navigation handler -> `PXPaymentProcessorNavigationHandler`
     */
    @objc optional func didReceive(navigationHandler: PXPaymentProcessorNavigationHandler)
    /**
     Receive a reference to checkout store with: `PXPaymentData` and `PXCheckoutPreference`.
     - parameter checkoutStore: Checkout store reference -> `PXCheckoutStore`
     */
    @objc optional func didReceive(checkoutStore: PXCheckoutStore)
    /**
     Method that we will call if `paymentProcessorViewController()` is nil. You can return the data of your custom payment. You can return a `PXGenericPayment` or `PXBusinessResult`.
     - parameter checkoutStore: Checkout store reference -> `PXCheckoutStore`
     - parameter errorHandler: Use to receive an error handler.
     - parameter successWithBusinessResult: Use to return a custom PXBusinessResult.
     - parameter successWithPaymentResult: Use to return a simple payment PXGenericPayment.
     */

     @objc optional func startPayment(checkoutStore: PXCheckoutStore, errorHandler: PXPaymentProcessorErrorHandler, successWithBusinessResult: @escaping ((PXBusinessResult) -> Void), successWithPaymentResult: @escaping  ((PXGenericPayment) -> Void))

    /**
     Optional method to inform your Payment timeout. (This is the timeout of your payment backend). Define this value for a superb checkout animated progress button experience.
     */
    @objc optional func paymentTimeOut() -> Double
}
