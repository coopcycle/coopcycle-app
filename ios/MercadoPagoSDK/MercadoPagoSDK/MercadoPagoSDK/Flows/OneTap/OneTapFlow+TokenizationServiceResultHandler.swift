//
//  OneTapFlow+TokenizationServiceResultHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 09/05/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension OneTapFlow: TokenizationServiceResultHandler {
    func finishInvalidIdentificationNumber() {
    }

    func finishFlow(token: PXToken) {
        model.updateCheckoutModel(token: token)
        executeNextStep()
    }

    func finishWithESCError() {
        executeNextStep()
    }

    func finishWithError(error: MPSDKError, securityCode: String? = nil) {
        if isShowingLoading() {
            pxNavigationHandler.showErrorScreen(error: error, callbackCancel: resultHandler?.exitCheckout, errorCallback: { [weak self] () in
                self?.getTokenizationService().createCardToken(securityCode: securityCode)
            })
        } else {
            finishPaymentFlow(error: error)
        }
    }

    func getTokenizationService() -> TokenizationService {
        return TokenizationService(paymentOptionSelected: model.paymentOptionSelected, cardToken: nil, escManager: model.escManager, pxNavigationHandler: pxNavigationHandler, needToShowLoading: model.needToShowLoading(), mercadoPagoServicesAdapter: model.mercadoPagoServicesAdapter, gatewayFlowResultHandler: self)
    }
}
