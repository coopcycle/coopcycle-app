//
//  MercadopagoCheckout+InitFlow.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 4/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

// MARK: Init flow Protocol
extension MercadoPagoCheckout: InitFlowProtocol {
    func didFailInitFlow(flowError: InitFlowError) {
        if initMode == .lazy {
            initProtocol?.failure(checkout: self)
            trackErrorEvent(flowError: flowError)
            #if DEBUG
                print("Error - \(flowError.errorStep.rawValue)")
            #endif
        } else {
            var errorDetail = ""
            #if DEBUG
                errorDetail = flowError.errorStep.rawValue
            #endif
            let customError = MPSDKError(message: "Error".localized, errorDetail: errorDetail, retry: flowError.shouldRetry, requestOrigin: flowError.requestOrigin?.rawValue)
            viewModel.errorInputs(error: customError, errorCallback: { [weak self] in
                if flowError.shouldRetry {
                    if self?.initMode == .normal {
                        self?.viewModel.pxNavigationHandler.presentLoading()
                    }
                    self?.viewModel.initFlow?.setFlowRetry(step: flowError.errorStep)
                    self?.executeNextStep()
                }
            })
            executeNextStep()
        }
    }

    func didFinishInitFlow() {
        if initMode == .lazy && cardIdForInitFlowRefresh == nil {
            initProtocol?.didFinish(checkout: self)
        } else {
            executeNextStep()
        }
    }
}
extension MercadoPagoCheckout {
    func trackErrorEvent(flowError: InitFlowError) {
        var properties: [String: Any] = [:]
        properties["path"] = TrackingPaths.Screens.PaymentVault.getPaymentVaultPath()
        properties["style"] = Tracking.Style.screen
        properties["id"] = Tracking.Error.Id.genericError
        properties["message"] = "Hubo un error"
        properties["attributable_to"] = Tracking.Error.Atrributable.user

        var extraDic: [String: Any] = [:]
        var errorDic: [String: Any] = [:]

        errorDic["url"] =  flowError.requestOrigin?.rawValue
        errorDic["retry_available"] = flowError.shouldRetry
        errorDic["status"] =  flowError.apiException?.status

        if let causes = flowError.apiException?.cause {
            var causesDic: [String: Any] = [:]
            for cause in causes where !String.isNullOrEmpty(cause.code) {
                causesDic["code"] = cause.code
                causesDic["description"] = cause.causeDescription
            }
            errorDic["causes"] = causesDic
        }
        extraDic["api_error"] = errorDic
        properties["extra_info"] = extraDic
        MPXTracker.sharedInstance.trackEvent(path: TrackingPaths.Events.getErrorPath(), properties: properties)
    }
}
