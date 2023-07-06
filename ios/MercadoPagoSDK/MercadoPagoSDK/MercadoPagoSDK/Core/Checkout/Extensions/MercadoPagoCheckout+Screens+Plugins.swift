//
//  MercadoPagoCheckout+Screens+Plugins.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
extension MercadoPagoCheckout {
    func showPaymentMethodPluginConfigScreen() {
        guard let paymentMethodPlugin = self.viewModel.paymentOptionSelected as? PXPaymentMethodPlugin else {
            return
        }

        guard let paymentMethodConfigPluginComponent = paymentMethodPlugin.paymentMethodConfigPlugin else {
            return
        }

        viewModel.populateCheckoutStore()

        paymentMethodConfigPluginComponent.didReceive?(checkoutStore: PXCheckoutStore.sharedInstance, theme: ThemeManager.shared.getCurrentTheme())

        // Create navigation handler.
        paymentMethodConfigPluginComponent.navigationHandler?(navigationHandler: PXPluginNavigationHandler(withCheckout: self))

        if let configPluginVC = paymentMethodConfigPluginComponent.configViewController() {
            viewModel.pxNavigationHandler.addDynamicView(viewController: configPluginVC)
            viewModel.pxNavigationHandler.pushViewController(targetVC: configPluginVC, animated: true)
        }
    }
}
