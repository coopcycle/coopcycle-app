//
//  MercadoPagoCheckout+ConfigurationServices.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 10/12/18.
//

import Foundation

extension MercadoPagoCheckout {

    func getPayerCostsConfiguration() {
        viewModel.pxNavigationHandler.presentLoading()

        guard let paymentMethod = viewModel.paymentData.getPaymentMethod() else {
            return
        }

        let bin = viewModel.cardToken?.getBin()

        var diffPricingString: String?
        if let differentialPricing = viewModel.checkoutPreference.differentialPricing?.id {
            diffPricingString = String(describing: differentialPricing)
        }

        //summary ammount service should be performed using the processing modes designated by the payment method
        viewModel.mercadoPagoServicesAdapter.update(processingModes: paymentMethod.processingModes)
        viewModel.mercadoPagoServicesAdapter.getSummaryAmount(bin: bin, amount: viewModel.amountHelper.preferenceAmount, issuer: viewModel.paymentData.getIssuer(), paymentMethodId: paymentMethod.id, payment_type_id: paymentMethod.paymentTypeId, differentialPricingId: diffPricingString, siteId: SiteManager.shared.getSiteId(), marketplace: viewModel.checkoutPreference.marketplace, discountParamsConfiguration: viewModel.getAdvancedConfiguration().discountParamsConfiguration, payer: viewModel.checkoutPreference.payer, defaultInstallments: viewModel.checkoutPreference.getDefaultInstallments(), charges: viewModel.amountHelper.chargeRules, maxInstallments: viewModel.checkoutPreference.getMaxAcceptedInstallments(), callback: { [weak self] (summaryAmount) in

            guard let self = self else {
                return
            }
            self.viewModel.payerCosts = summaryAmount.selectedAmountConfiguration.amountConfiguration?.payerCosts
            if let discountConfig = summaryAmount.selectedAmountConfiguration.discountConfiguration {
                self.viewModel.attemptToApplyDiscount(discountConfig)
            }
            if let payerCosts = self.viewModel.payerCosts {
                let defaultPayerCost = self.viewModel.checkoutPreference.paymentPreference.autoSelectPayerCost(payerCosts)
                if let defaultPC = defaultPayerCost {
                    self.viewModel.updateCheckoutModel(payerCost: defaultPC)
                }
            }

            self.executeNextStep()

            }, failure: { [weak self] (error) in

                guard let self = self else {
                    return
                }
                self.viewModel.errorInputs(error: MPSDKError.convertFrom(error, requestOrigin: ApiUtil.RequestOrigin.GET_INSTALLMENTS.rawValue), errorCallback: { [weak self] () in
                    self?.getPayerCostsConfiguration()
                })
                self.executeNextStep()
        })
    }

}
