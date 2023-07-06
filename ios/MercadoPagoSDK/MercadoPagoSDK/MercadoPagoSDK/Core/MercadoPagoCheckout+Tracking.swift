//
//  MercadoPagoCheckout+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 13/12/2018.
//

import Foundation

// MARK: Tracking
extension MercadoPagoCheckout {

    internal func startTracking() {
        MPXTracker.sharedInstance.startNewSession()

        // Track init event
        var properties: [String: Any] = [:]
        if !String.isNullOrEmpty(viewModel.checkoutPreference.id) {
        properties["checkout_preference_id"] = viewModel.checkoutPreference.id
        } else {
        properties["checkout_preference"] = viewModel.checkoutPreference.getCheckoutPrefForTracking()
        }

        properties["esc_enabled"] = viewModel.getAdvancedConfiguration().isESCEnabled()
        properties["express_enabled"] = viewModel.getAdvancedConfiguration().expressEnabled

        viewModel.populateCheckoutStore()
        properties["split_enabled"] = viewModel.paymentPlugin?.supportSplitPaymentMethodPayment(checkoutStore: PXCheckoutStore.sharedInstance)

        MPXTracker.sharedInstance.trackEvent(path: TrackingPaths.Events.getInitPath(), properties: properties)
    }
}
