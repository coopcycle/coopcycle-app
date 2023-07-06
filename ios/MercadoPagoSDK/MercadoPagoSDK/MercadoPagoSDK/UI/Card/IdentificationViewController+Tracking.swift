//
//  IdentificationViewController+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 03/12/2018.
//

import Foundation

// MARK: Tracking
extension IdentificationViewController {
    func trackScreenView() {
        guard let cardType = paymentMethod?.paymentTypeId else {
            return
        }
        var properties: [String: Any] = [:]
        properties["payment_method_id"] = paymentMethod?.id

        trackScreen(path: TrackingPaths.Screens.CardForm.getIdentificationPath(paymentTypeId: cardType), properties: properties, treatBackAsAbort: true)
    }

    func trackError(errorMessage: String) {
        guard let cardType = paymentMethod?.paymentTypeId else {
            return
        }
        var properties: [String: Any] = [:]
        properties["path"] = TrackingPaths.Screens.CardForm.getIdentificationPath(paymentTypeId: cardType)
        properties["style"] = Tracking.Style.customComponent
        properties["id"] = Tracking.Error.Id.invalidDocument
        properties["message"] = errorMessage
        properties["attributable_to"] = Tracking.Error.Atrributable.user
        var extraDic: [String: Any] = [:]
        extraDic["payment_method_type"] = paymentMethod?.getPaymentTypeForTracking()
        extraDic["payment_method_id"] = paymentMethod?.getPaymentIdForTracking()
        properties["extra_info"] = extraDic
        trackEvent(path: TrackingPaths.Events.getErrorPath(), properties: properties)
    }
}
