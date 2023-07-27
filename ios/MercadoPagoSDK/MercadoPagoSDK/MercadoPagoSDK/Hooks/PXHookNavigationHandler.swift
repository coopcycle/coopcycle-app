//
//  PXHookNavigationHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 11/28/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

@objcMembers
internal class PXHookNavigationHandler: NSObject {

    private var checkout: MercadoPagoCheckout?
    private var targetHook: PXHookStep?

    public init(withCheckout: MercadoPagoCheckout, targetHook: PXHookStep) {
        self.checkout = withCheckout
        self.targetHook = targetHook
    }

    open func next() {
        if let targetHook = targetHook, targetHook == .BEFORE_PAYMENT_METHOD_CONFIG {
            if let paymentOptionSelected = self.checkout?.viewModel.paymentOptionSelected {
                self.checkout?.viewModel.updateCheckoutModelAfterBeforeConfigHook(paymentOptionSelected: paymentOptionSelected)
            }
        }
        checkout?.executeNextStep()
    }

    open func back() {
        checkout?.executePreviousStep()
    }

    open func showLoading() {
        checkout?.viewModel.pxNavigationHandler.presentLoading()
    }

    open func hideLoading() {
        checkout?.viewModel.pxNavigationHandler.dismissLoading()
    }
}
