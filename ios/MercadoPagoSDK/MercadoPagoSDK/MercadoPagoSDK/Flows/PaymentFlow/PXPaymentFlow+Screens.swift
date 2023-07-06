//
//  PXPaymentFlow+Screens.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 18/07/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension PXPaymentFlow {
    internal func showPaymentProcessor(paymentProcessor: PXSplitPaymentProcessor?) {
        guard let paymentProcessor = paymentProcessor else {
            return
        }

        model.assignToCheckoutStore()

        paymentProcessor.didReceive?(navigationHandler: PXPaymentProcessorNavigationHandler(flow: self))

        if let paymentProcessorVC = paymentProcessor.paymentProcessorViewController() {
            pxNavigationHandler.addDynamicView(viewController: paymentProcessorVC)

            if let shouldSkipRyC = paymentProcessor.shouldSkipUserConfirmation?(), shouldSkipRyC, pxNavigationHandler.isLoadingPresented() {
                pxNavigationHandler.dismissLoading()
            }
            pxNavigationHandler.navigationController.pushViewController(paymentProcessorVC, animated: false)
        }
    }
}
