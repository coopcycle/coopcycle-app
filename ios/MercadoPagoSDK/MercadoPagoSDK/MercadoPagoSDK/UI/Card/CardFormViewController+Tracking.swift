//
//  CardFormViewController+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/11/2018.
//

import Foundation
// MARK: Tracking
extension CardFormViewController {

    func trackScreen() {
        guard let cardType = self.viewModel.getPaymentMethodTypeId() else {
            return
        }
        let screenPath = getScreenPath(cardType: cardType)
        var properties: [String: Any] = [:]
        if screenPath != TrackingPaths.Screens.CardForm.getCardNumberPath() {
            properties["payment_method_id"] = viewModel.guessedPMS?.first?.getPaymentIdForTracking()
        }

        trackScreen(path: screenPath, properties: properties)
    }

    func trackError(errorMessage: String, style: String = Tracking.Style.customComponent) {
        guard let cardType = self.viewModel.getPaymentMethodTypeId() else {
            return
        }
        var properties: [String: Any] = [:]
        properties["path"] = getScreenPath(cardType: cardType)
        properties["style"] = style
        properties["id"] = getIdError()
        properties["message"] = errorMessage
        properties["attributable_to"] = Tracking.Error.Atrributable.user
        var extraDic: [String: Any] = [:]
        extraDic["payment_method_type"] = viewModel.guessedPMS?.first?.getPaymentTypeForTracking()
        extraDic["payment_method_id"] = viewModel.guessedPMS?.first?.getPaymentIdForTracking()
        properties["extra_info"] = extraDic
        trackEvent(path: TrackingPaths.Events.getErrorPath(), properties: properties)
    }

    func getScreenPath(cardType: String) -> String {
        var screenPath = ""
        if editingLabel === cardNumberLabel {
            screenPath = TrackingPaths.Screens.CardForm.getCardNumberPath()
        } else if editingLabel === nameLabel {
            screenPath = TrackingPaths.Screens.CardForm.getCardNamePath(paymentTypeId: cardType)
        } else if editingLabel === expirationDateLabel {
            screenPath = TrackingPaths.Screens.CardForm.getExpirationDatePath(paymentTypeId: cardType)
        } else if editingLabel === cvvLabel {
            screenPath = TrackingPaths.Screens.CardForm.getCvvPath(paymentTypeId: cardType)
        }
        return screenPath
    }

    func getIdError() -> String {
        var idError = ""
        if editingLabel === cardNumberLabel {
            if viewModel.guessedPMS == nil || viewModel.guessedPMS?.isEmpty ?? false {
                idError = Tracking.Error.Id.invalidBin
            } else {
                idError = Tracking.Error.Id.invalidNumber
            }
        } else if editingLabel === nameLabel {
            idError = Tracking.Error.Id.invalidName
        } else if editingLabel === expirationDateLabel {
            idError = Tracking.Error.Id.invalidExpirationDate
        } else if editingLabel === cvvLabel {
            idError = Tracking.Error.Id.invalidCVV
        }
        return idError
    }
}
