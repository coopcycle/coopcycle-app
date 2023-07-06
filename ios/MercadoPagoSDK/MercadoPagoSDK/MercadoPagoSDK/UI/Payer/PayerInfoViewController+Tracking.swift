//
//  PayerInfoViewController+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/11/2018.
//

import Foundation

// MARK: Tracking
extension PayerInfoViewController {
    func trackStep(currentStep: PayerInfoFlowStep) {
        guard let screenPath = getScreenPath(currentStep: currentStep) else {
            return
        }
        var properties: [String: Any] = [:]
        properties["payment_method_id"] = viewModel.amountHelper.getPaymentData().paymentMethod?.getPaymentIdForTracking()
        trackScreen(path: screenPath, properties: properties, treatBackAsAbort: true)
    }
    func trackError(errorMessage: String, currentStep: PayerInfoFlowStep) {
        var properties: [String: Any] = [:]
        properties["path"] = getScreenPath(currentStep: currentStep)
        properties["style"] = Tracking.Style.customComponent
        properties["id"] = getErrorId(currentStep: currentStep)
        properties["message"] = errorMessage
        properties["attributable_to"] = Tracking.Error.Atrributable.user
        var extraDic: [String: Any] = [:]
        extraDic["payment_method_type"] = viewModel.amountHelper.getPaymentData().paymentMethod?.getPaymentTypeForTracking()
        extraDic["payment_method_id"] = viewModel.amountHelper.getPaymentData().paymentMethod?.getPaymentIdForTracking()
        properties["extra_info"] = extraDic
        trackEvent(path: TrackingPaths.Events.getErrorPath(), properties: properties)
    }
    func getScreenPath(currentStep: PayerInfoFlowStep) -> String? {
        var screenPath = ""
        switch currentStep {
        case .SCREEN_IDENTIFICATION:
            screenPath = TrackingPaths.Screens.Boleto.getCpfPath()
        case .SCREEN_NAME:
            screenPath = TrackingPaths.Screens.Boleto.getNamePath()
        case .SCREEN_LAST_NAME:
            screenPath = TrackingPaths.Screens.Boleto.getLastNamePath()
        default:
            return nil
        }
        return screenPath
    }
    func getUserInput(currentStep: PayerInfoFlowStep) -> String? {
        var input: String?
        switch currentStep {
        case .SCREEN_IDENTIFICATION:
            input = identificationComponent?.getInputText()
        case .SCREEN_NAME:
            input = firstNameComponent?.getInputText()
        case .SCREEN_LAST_NAME:
            input = secondNameComponent?.getInputText()
        default:
            return input
        }
        return input
    }
    func getErrorId(currentStep: PayerInfoFlowStep) -> String {
        var errorId: String
        switch currentStep {
        case .SCREEN_IDENTIFICATION:
            errorId = Tracking.Error.Id.invalidDocument
        case .SCREEN_NAME:
            errorId = Tracking.Error.Id.invalidName
        case .SCREEN_LAST_NAME:
            errorId = Tracking.Error.Id.invalidLastName
        default:
            return ""
        }
        return errorId
    }
}
