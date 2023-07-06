//
//  MercadoPagoCheckout+TokenizationServiceResultHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/04/2019.
//

import Foundation

extension MercadoPagoCheckout: TokenizationServiceResultHandler {
    func finishInvalidIdentificationNumber() {
        if let identificationViewController = viewModel.pxNavigationHandler.navigationController.viewControllers.last as? IdentificationViewController {
            identificationViewController.showErrorMessage("invalid_field".localized)
        }
    }

    func finishFlow(token: PXToken) {
        viewModel.updateCheckoutModel(token: token)
        executeNextStep()
    }

    func finishWithESCError() {
        executeNextStep()
    }

    func finishWithError(error: MPSDKError, securityCode: String? = nil) {
        viewModel.errorInputs(error: error, errorCallback: { [weak self] () in
            self?.getTokenizationService().createCardToken(securityCode: securityCode)
        })
        self.executeNextStep()
    }

    func getTokenizationService() -> TokenizationService {
        return TokenizationService(paymentOptionSelected: viewModel.paymentOptionSelected, cardToken: viewModel.cardToken, escManager: viewModel.escManager, pxNavigationHandler: viewModel.pxNavigationHandler, needToShowLoading: true, mercadoPagoServicesAdapter: viewModel.mercadoPagoServicesAdapter, gatewayFlowResultHandler: self)
    }
}
