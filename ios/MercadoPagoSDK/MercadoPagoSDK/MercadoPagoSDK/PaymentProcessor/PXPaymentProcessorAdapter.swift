//
//  File.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 22/01/2019.
//

import Foundation

internal class PXPaymentProcessorAdapter: NSObject, PXSplitPaymentProcessor {

    let paymentProcessor: PXPaymentProcessor

    init(paymentProcessor: PXPaymentProcessor) {
        self.paymentProcessor = paymentProcessor
    }

    func paymentProcessorViewController() -> UIViewController? {
        return paymentProcessor.paymentProcessorViewController()
    }

    func support() -> Bool {
        return paymentProcessor.support()
    }

    func supportSplitPaymentMethodPayment(checkoutStore: PXCheckoutStore) -> Bool {
        return false
    }

    func startPayment(checkoutStore: PXCheckoutStore, errorHandler: PXPaymentProcessorErrorHandler, successWithBasePayment: @escaping ((PXBasePayment) -> Void)) {
        paymentProcessor.startPayment?(checkoutStore: checkoutStore, errorHandler: errorHandler, successWithBusinessResult: { (businessResult) in
            successWithBasePayment(businessResult)
        }) { (genericPayment) in
            successWithBasePayment(genericPayment)
        }
    }

    func didReceive(checkoutStore: PXCheckoutStore) {
        paymentProcessor.didReceive?(checkoutStore: checkoutStore)
    }

    func didReceive(navigationHandler: PXPaymentProcessorNavigationHandler) {
        paymentProcessor.didReceive?(navigationHandler: navigationHandler)
    }

    func paymentTimeOut() -> Double {
        return paymentProcessor.paymentTimeOut?() ?? 0
    }
}
