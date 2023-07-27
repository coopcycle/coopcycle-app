//
//  InitFlow+Services.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 2/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension InitFlow {

    func getInitSearch() {
        let cardIdsWithEsc = initFlowModel.getESCService()?.getSavedCardIds() ?? []

        var differentialPricingString: String?
        if let diffPricing = initFlowModel.properties.checkoutPreference.differentialPricing?.id {
            differentialPricingString = String(describing: diffPricing)
        }

        var defaultInstallments: String?
        let dInstallments = initFlowModel.properties.checkoutPreference.getDefaultInstallments()
        if let dInstallments = dInstallments {
            defaultInstallments = String(dInstallments)
        }

        var maxInstallments: String?
        let mInstallments = initFlowModel.properties.checkoutPreference.getMaxAcceptedInstallments()
        maxInstallments = String(mInstallments)

        let hasPaymentProcessor: Bool = initFlowModel.properties.paymentPlugin != nil ? true : false
        let discountParamsConfiguration = initFlowModel.properties.advancedConfig.discountParamsConfiguration
        let flowName: String? = MPXTracker.sharedInstance.getFlowName() ?? nil
        let splitEnabled: Bool = initFlowModel.properties.paymentPlugin?.supportSplitPaymentMethodPayment(checkoutStore: PXCheckoutStore.sharedInstance) ?? false
        let serviceAdapter = initFlowModel.getService()

        //payment method search service should be performed using the processing modes designated by the preference object
        let pref = initFlowModel.properties.checkoutPreference
        serviceAdapter.update(processingModes: pref.processingModes, branchId: pref.branchId)

        let extraParams = (defaultPaymentMethod: initFlowModel.getDefaultPaymentMethodId(), differentialPricingId: differentialPricingString, defaultInstallments: defaultInstallments, expressEnabled: initFlowModel.properties.advancedConfig.expressEnabled, hasPaymentProcessor: hasPaymentProcessor, splitEnabled: splitEnabled, maxInstallments: maxInstallments)

        let charges = self.initFlowModel.amountHelper.chargeRules ?? []

        //Add headers
        var headers: [String: String] = [:]
        if let prodId = initFlowModel.properties.productId {
            headers[MercadoPagoService.HeaderField.productId.rawValue] = prodId
        }

        if let prefId = pref.id, prefId.isNotEmpty {
            // CLOSED PREFERENCE
            serviceAdapter.getClosedPrefInitSearch(preferenceId: prefId, cardIdsWithEsc: cardIdsWithEsc, extraParams: extraParams, discountParamsConfiguration: discountParamsConfiguration, flow: flowName, charges: charges, headers: headers, callback: callback(_:), failure: failure(_:))
        } else {
            // OPEN PREFERENCE
            serviceAdapter.getOpenPrefInitSearch(preference: pref, cardIdsWithEsc: cardIdsWithEsc, extraParams: extraParams, discountParamsConfiguration: discountParamsConfiguration, flow: flowName, charges: charges, headers: headers, callback: callback(_:), failure: failure(_:))
        }
    }

    func callback(_ search: PXInitDTO) {
        initFlowModel.updateInitModel(paymentMethodsResponse: search)

        //Tracking Experiments
        MPXTracker.sharedInstance.setExperiments(search.experiments)

        //Set site
        SiteManager.shared.setCurrency(currency: search.currency)
        SiteManager.shared.setSite(site: search.site)

        executeNextStep()
    }

    func failure(_ error: NSError) {
        let customError = InitFlowError(errorStep: .SERVICE_GET_INIT, shouldRetry: true, requestOrigin: .GET_INIT, apiException: MPSDKError.getApiException(error))
        initFlowModel.setError(error: customError)
        executeNextStep()
    }
}
