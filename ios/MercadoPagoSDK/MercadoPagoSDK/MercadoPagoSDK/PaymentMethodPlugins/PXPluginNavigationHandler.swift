//
//  PXPluginNavigationHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/** :nodoc: */
@objcMembers
open class PXPluginNavigationHandler: NSObject {

    private var checkout: MercadoPagoCheckout?

    public init(withCheckout: MercadoPagoCheckout) {
        self.checkout = withCheckout
    }

    open func showFailure(message: String, errorDetails: String, retryButtonCallback: (() -> Void)?) {
        MercadoPagoCheckoutViewModel.error = MPSDKError(message: message, errorDetail: errorDetails, retry: retryButtonCallback != nil)
        checkout?.viewModel.errorCallback = retryButtonCallback
        checkout?.executeNextStep()
    }

    open func next() {
        checkout?.executeNextStep()
    }

    open func nextAndRemoveCurrentScreenFromStack() {
        guard let currentViewController = self.checkout?.viewModel.pxNavigationHandler.navigationController.viewControllers.last else {
            checkout?.executeNextStep()
            return
        }

        checkout?.executeNextStep()

        if let indexOfLastViewController = self.checkout?.viewModel.pxNavigationHandler.navigationController.viewControllers.index(of: currentViewController) {
            self.checkout?.viewModel.pxNavigationHandler.navigationController.viewControllers.remove(at: indexOfLastViewController)
        }
    }

    open func cancel() {
        checkout?.cancelCheckout()
    }

    open func showLoading() {
        checkout?.viewModel.pxNavigationHandler.presentLoading()
    }

    open func hideLoading() {
        checkout?.viewModel.pxNavigationHandler.dismissLoading()
    }
}
