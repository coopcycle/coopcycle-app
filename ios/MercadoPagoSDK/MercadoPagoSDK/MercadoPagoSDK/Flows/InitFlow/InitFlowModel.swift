//
//  InitFlowModel.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 27/6/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal typealias InitFlowProperties = (paymentData: PXPaymentData, checkoutPreference: PXCheckoutPreference, paymentPlugin: PXSplitPaymentProcessor?, paymentMethodSearchResult: PXInitDTO?, chargeRules: [PXPaymentTypeChargeRule]?, serviceAdapter: MercadoPagoServicesAdapter, advancedConfig: PXAdvancedConfiguration, paymentConfigurationService: PXPaymentConfigurationServices, escManager: MercadoPagoESC?, privateKey: String?, productId: String?)
internal typealias InitFlowError = (errorStep: InitFlowModel.Steps, shouldRetry: Bool, requestOrigin: ApiUtil.RequestOrigin?, apiException: ApiException?)

internal protocol InitFlowProtocol: NSObjectProtocol {
    func didFinishInitFlow()
    func didFailInitFlow(flowError: InitFlowError)
}

final class InitFlowModel: NSObject, PXFlowModel {
    enum Steps: String {
        case ERROR = "Error"
        case SERVICE_GET_INIT = "Obtener preferencia y medios de pago"
        case FINISH = "Finish step"
    }

    private var preferenceValidated: Bool = false
    private var directDiscountSearchStatus: Bool
    private var flowError: InitFlowError?
    private var pendingRetryStep: Steps?

    var properties: InitFlowProperties

    var amountHelper: PXAmountHelper {
        return PXAmountHelper(preference: properties.checkoutPreference, paymentData: properties.paymentData, chargeRules: properties.chargeRules, paymentConfigurationService: properties.paymentConfigurationService, splitAccountMoney: nil)
    }

    init(flowProperties: InitFlowProperties) {
        self.properties = flowProperties
        self.directDiscountSearchStatus = flowProperties.paymentData.isComplete()
        super.init()
    }

    func update(paymentPlugin: PXSplitPaymentProcessor?, chargeRules: [PXPaymentTypeChargeRule]?) {
        properties.paymentPlugin = paymentPlugin
        properties.chargeRules = chargeRules
    }
}

// MARK: Public methods
extension InitFlowModel {
    func getService() -> MercadoPagoServicesAdapter {
        return properties.serviceAdapter
    }

    func getESCService() -> MercadoPagoESC? {
        return properties.escManager
    }

    func getError() -> InitFlowError {
        if let error = flowError {
            return error
        }
        return InitFlowError(errorStep: .ERROR, shouldRetry: false, requestOrigin: nil, apiException: nil)
    }

    func setError(error: InitFlowError) {
        flowError = error
    }

    func resetError() {
        flowError = nil
    }

    func setPendingRetry(forStep: Steps) {
        pendingRetryStep = forStep
    }

    func removePendingRetry() {
        pendingRetryStep = nil
    }

    func getExcludedPaymentTypesIds() -> [String] {
        if properties.checkoutPreference.siteId == "MLC" || properties.checkoutPreference.siteId == "MCO" ||
            properties.checkoutPreference.siteId == "MLV" {
            properties.checkoutPreference.addExcludedPaymentType("atm")
            properties.checkoutPreference.addExcludedPaymentType("bank_transfer")
            properties.checkoutPreference.addExcludedPaymentType("ticket")
        }
        return properties.checkoutPreference.getExcludedPaymentTypesIds()
    }

    func getDefaultPaymentMethodId() -> String? {
        return properties.checkoutPreference.getDefaultPaymentMethodId()
    }

    func getExcludedPaymentMethodsIds() -> [String] {
        return properties.checkoutPreference.getExcludedPaymentMethodsIds()
    }

    func updateInitModel(paymentMethodsResponse: PXInitDTO?) {
        properties.paymentMethodSearchResult = paymentMethodsResponse
    }

    func getPaymentMethodSearch() -> PXInitDTO? {
        return properties.paymentMethodSearchResult
    }

    func populateCheckoutStore() {
        PXCheckoutStore.sharedInstance.paymentDatas = [self.properties.paymentData]
        if let splitAccountMoney = amountHelper.splitAccountMoney {
            PXCheckoutStore.sharedInstance.paymentDatas.append(splitAccountMoney)
        }
        PXCheckoutStore.sharedInstance.checkoutPreference = self.properties.checkoutPreference
    }
}

// MARK: nextStep - State machine
extension InitFlowModel {
    func nextStep() -> Steps {
        if let retryStep = pendingRetryStep {
            pendingRetryStep = nil
            return retryStep
        }
        if hasError() {
            return .ERROR
        }
        if needSearch() {
            return .SERVICE_GET_INIT
        }
        return .FINISH
    }
}

// MARK: Needs methods
extension InitFlowModel {

    // Use this method for init property.
    func needSkipRyC() -> Bool {
        if let paymentProc = properties.paymentPlugin, let shouldSkip = paymentProc.shouldSkipUserConfirmation, shouldSkip() {
            return true
        }
        return false
    }

    private func needSearch() -> Bool {
        return properties.paymentMethodSearchResult == nil
    }

    private func hasError() -> Bool {
        return flowError != nil
    }

    private func filterCampaignsByCodeType(campaigns: [PXCampaign]?, _ codeType: String) -> [PXCampaign]? {
        if let campaigns = campaigns {
            let filteredCampaigns = campaigns.filter { (campaign: PXCampaign) -> Bool in
                return campaign.codeType == codeType
            }
            if filteredCampaigns.isEmpty {
                return nil
            }
            return filteredCampaigns
        }
        return nil
    }
}
