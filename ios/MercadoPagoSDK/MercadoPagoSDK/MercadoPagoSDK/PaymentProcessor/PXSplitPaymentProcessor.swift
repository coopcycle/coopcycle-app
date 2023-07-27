//
//  PXSplitPaymentProcessor.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 22/01/2019.
//

import Foundation

@objc public protocol PXSplitPaymentProcessor: NSObjectProtocol {
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
     - parameter successWithBasePayment: Use to return a custom PXBasePayment.
     */
    @objc optional func startPayment(checkoutStore: PXCheckoutStore, errorHandler: PXPaymentProcessorErrorHandler, successWithBasePayment: @escaping ((PXBasePayment) -> Void))

    /**
     Optional method to inform your Payment timeout. (This is the timeout of your payment backend). Define this value for a superb checkout animated progress button experience.
     */
    @objc optional func paymentTimeOut() -> Double

    /**
     Method to inform if this payment processor supports split payment method payment.
     - parameter checkoutStore: Checkout store reference -> `PXCheckoutStore`
     */
    @objc func supportSplitPaymentMethodPayment(checkoutStore: PXCheckoutStore) -> Bool

    /**
     Optional method to skip Review and Confirm screen/step in checkout flow.
     */
    @objc optional func shouldSkipUserConfirmation() -> Bool
}
