//
//  MercadoPagoCheckoutServices.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 7/18/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

extension MercadoPagoCheckout {

    func getIssuers() {
        viewModel.pxNavigationHandler.presentLoading()
        guard let paymentMethod = viewModel.paymentData.getPaymentMethod() else {
            return
        }
        let bin = viewModel.cardToken?.getBin()

        //issuers service should be performed using the processing modes designated by the payment method
        viewModel.mercadoPagoServicesAdapter.update(processingModes: paymentMethod.processingModes)
        viewModel.mercadoPagoServicesAdapter.getIssuers(paymentMethodId: paymentMethod.id, bin: bin, callback: { [weak self] (issuers) in
            guard let self = self else { return }
            self.viewModel.issuers = issuers
            if issuers.count == 1 {
                self.viewModel.updateCheckoutModel(issuer: issuers[0])
            }
            self.executeNextStep()
            }, failure: { [weak self] (error) in
                guard let self = self else { return }
                self.viewModel.errorInputs(error: MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.GET_ISSUERS.rawValue), errorCallback: { [weak self] () in
                    self?.getIssuers()
                })
                self.executeNextStep()
        })
    }

    func createPayment() {
        viewModel.invalidESC = false
        let paymentFlow = viewModel.createPaymentFlow(paymentErrorHandler: self)
        paymentFlow.setData(amountHelper: viewModel.amountHelper, checkoutPreference: viewModel.checkoutPreference, resultHandler: self)
        paymentFlow.start()
    }

    func getIdentificationTypes() {
        viewModel.pxNavigationHandler.presentLoading()
        viewModel.mercadoPagoServicesAdapter.getIdentificationTypes(callback: { [weak self] (identificationTypes) in
            guard let self = self else { return }
            self.viewModel.updateCheckoutModel(identificationTypes: identificationTypes)
            self.executeNextStep()
            }, failure: { [weak self] (error) in
                guard let self = self else { return }
                self.viewModel.errorInputs(error: MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.GET_IDENTIFICATION_TYPES.rawValue), errorCallback: { [weak self] () in
                    self?.getIdentificationTypes()
                })
                self.executeNextStep()
        })
    }
}
