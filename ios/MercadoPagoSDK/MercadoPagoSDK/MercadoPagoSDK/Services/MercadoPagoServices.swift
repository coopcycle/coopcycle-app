//
//  MercadoPagoServices.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 1/7/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import Foundation

internal class MercadoPagoServices: NSObject {

    open var merchantPublicKey: String
    open var payerAccessToken: String
    private var processingModes: [String] = PXServicesURLConfigs.MP_DEFAULT_PROCESSING_MODES
    private var branchId: String?
    private var baseURL: String! = PXServicesURLConfigs.MP_API_BASE_URL
    private var gatewayBaseURL: String!

    private var language: String = NSLocale.preferredLanguages[0]

    init(merchantPublicKey: String, payerAccessToken: String = "") {
        self.merchantPublicKey = merchantPublicKey
        self.payerAccessToken = payerAccessToken
        super.init()
    }

    func update(processingModes: [String]) {
        self.processingModes = processingModes
    }

    func update(branchId: String?) {
        self.branchId = branchId
    }

    func getInstructions(paymentId: Int64, paymentTypeId: String, callback : @escaping (PXInstructions) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let instructionsService = InstructionsService(baseURL: baseURL, merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken)
        instructionsService.getInstructions(for: paymentId, paymentTypeId: paymentTypeId, success: { (instructionsInfo : PXInstructions) -> Void in
            callback(instructionsInfo)
        }, failure: failure)
    }

    func getOpenPrefInitSearch(pref: PXCheckoutPreference, cardsWithEsc: [String], oneTapEnabled: Bool, splitEnabled: Bool, discountParamsConfiguration: PXDiscountParamsConfiguration?, flow: String?, charges: [PXPaymentTypeChargeRule], headers: [String: String]?, callback : @escaping (PXInitDTO) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let paymentMethodSearchService = PaymentMethodSearchService(baseURL: baseURL, merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken, processingModes: processingModes, branchId: branchId)

        paymentMethodSearchService.getOpenPrefInit(pref: pref, cardsWithEsc: cardsWithEsc, oneTapEnabled: oneTapEnabled, splitEnabled: splitEnabled, discountParamsConfiguration: discountParamsConfiguration, flow: flow, charges: charges, headers: headers, success: callback, failure: failure)
    }

    func getClosedPrefInitSearch(preferenceId: String, cardsWithEsc: [String], oneTapEnabled: Bool, splitEnabled: Bool, discountParamsConfiguration: PXDiscountParamsConfiguration?, flow: String?, charges: [PXPaymentTypeChargeRule], headers: [String: String]?, callback : @escaping (PXInitDTO) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let paymentMethodSearchService = PaymentMethodSearchService(baseURL: baseURL, merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken, processingModes: processingModes, branchId: branchId)

        paymentMethodSearchService.getClosedPrefInit(preferenceId: preferenceId, cardsWithEsc: cardsWithEsc, oneTapEnabled: oneTapEnabled, splitEnabled: splitEnabled, discountParamsConfiguration: discountParamsConfiguration, flow: flow, charges: charges, headers: headers, success: callback, failure: failure)
    }

    func createPayment(url: String, uri: String, transactionId: String? = nil, paymentDataJSON: Data, query: [String: String]? = nil, headers: [String: String]? = nil, callback : @escaping (PXPayment) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: CustomService = CustomService(baseURL: url, URI: uri)


        var params = MercadoPagoServices.getParamsPublicKeyAndAcessToken(merchantPublicKey, payerAccessToken)
        params.paramsAppend(key: ApiParam.API_VERSION, value: PXServicesURLConfigs.API_VERSION)
        if let queryParams = query as NSDictionary? {
            params = queryParams.parseToQuery()
        }

        service.createPayment(headers: headers, body: paymentDataJSON, params: params, success: callback, failure: failure)
    }

    func getPointsAndDiscounts(url: String, uri: String, paymentIds: [String]? = nil, campaignId: String?, platform: String, callback : @escaping (PXPointsAndDiscounts) -> Void, failure: @escaping (() -> Void)) {
        let service: CustomService = CustomService(baseURL: url, URI: uri)

        var params = MercadoPagoServices.getParamsAccessTokenAndPaymentIdsAndPlatform(payerAccessToken, paymentIds, platform)

        params.paramsAppend(key: ApiParam.API_VERSION, value: PXServicesURLConfigs.API_VERSION)

        if let campaignId = campaignId {
            params.paramsAppend(key: ApiParam.CAMPAIGN_ID, value: campaignId)
        }

        if let flowName = MPXTracker.sharedInstance.getFlowName() {
            params.paramsAppend(key: ApiParam.FLOW_NAME, value: flowName)
        }

        service.getPointsAndDiscounts(body: nil, params: params, success: callback, failure: failure)
    }

    func createToken(cardToken: PXCardToken, callback : @escaping (PXToken) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        createToken(cardToken: try? cardToken.toJSON(), callback: callback, failure: failure)
    }

    func createToken(savedESCCardToken: PXSavedESCCardToken, callback : @escaping (PXToken) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        createToken(cardToken: try? savedESCCardToken.toJSON(), callback: callback, failure: failure)
    }

    func createToken(savedCardToken: PXSavedCardToken, callback : @escaping (PXToken) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        createToken(cardToken: try? savedCardToken.toJSON(), callback: callback, failure: failure)
    }

    func createToken(cardToken: Data?, callback : @escaping (PXToken) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: GatewayService = GatewayService(baseURL: getGatewayURL(), merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken)
        guard let cardToken = cardToken else {
            return
        }
        service.getToken(cardTokenJSON: cardToken, success: {(data: Data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)
                var token : PXToken
                if let tokenDic = jsonResult as? NSDictionary {
                    if tokenDic["error"] == nil {
                        token = try PXToken.fromJSON(data: data)
                        callback(token)
                    } else {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure(PXError(domain: ApiDomain.GET_TOKEN, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: tokenDic as? [String: Any], apiException: apiException))
                    }
                }
            } catch {
                failure(PXError(domain: ApiDomain.GET_TOKEN, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido crear el token"]))
            }
        }, failure: failure)
    }

    func cloneToken(tokenId: String, securityCode: String, callback : @escaping (PXToken) -> Void, failure: @escaping ((_ error: NSError) -> Void)) {
        let service: GatewayService = GatewayService(baseURL: getGatewayURL(), merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken)
        service.cloneToken(public_key: merchantPublicKey, tokenId: tokenId, securityCode: securityCode, success: {(data: Data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)
                var token : PXToken
                if let tokenDic = jsonResult as? NSDictionary {
                    if tokenDic["error"] == nil {
                        token = try PXToken.fromJSON(data: data)
                        callback(token)
                    } else {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure(PXError(domain: ApiDomain.CLONE_TOKEN, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: tokenDic as? [String: Any], apiException: apiException))
                    }
                }
            } catch {
                failure(PXError(domain: ApiDomain.CLONE_TOKEN, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido clonar el token"]))
            }
        }, failure: failure)
    }

    func getBankDeals(callback : @escaping ([PXBankDeal]) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: PromosService = PromosService(baseURL: baseURL)
        service.getPromos(public_key: merchantPublicKey, success: { (jsonResult) -> Void in
            do {
                var promos : [PXBankDeal] = [PXBankDeal]()
                if let data = jsonResult {
                    promos = try PXBankDeal.fromJSON(data: data)
                }
                callback(promos)
            } catch {
                failure(PXError(domain: ApiDomain.GET_PROMOS, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener las promociones"]))
            }
        }, failure: failure)
    }

    func getIdentificationTypes(callback: @escaping ([PXIdentificationType]) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: IdentificationService = IdentificationService(baseURL: baseURL, merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken)
        service.getIdentificationTypes(success: {(data: Data!) -> Void in do {
            let jsonResult = try JSONSerialization.jsonObject(with: data!, options: JSONSerialization.ReadingOptions.allowFragments)

            if let error = jsonResult as? NSDictionary {
                if (error["status"]! as? Int) == 404 {
                    let apiException = try PXApiException.fromJSON(data: data)
                    failure(PXError(domain: ApiDomain.GET_IDENTIFICATION_TYPES, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: error as? [String: Any], apiException: apiException))
                } else if error["error"] != nil {
                    let apiException = try PXApiException.fromJSON(data: data)
                    failure(PXError(domain: ApiDomain.GET_IDENTIFICATION_TYPES, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: error as? [String: Any], apiException: apiException))
                }
            } else {
                var identificationTypes : [PXIdentificationType] = [PXIdentificationType]()
                identificationTypes = try PXIdentificationType.fromJSON(data: data)
                callback(identificationTypes)
            }
        } catch {
            failure(PXError(domain: ApiDomain.GET_IDENTIFICATION_TYPES, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener los tipos de identificación"]))
            }
        }, failure: failure)
    }

    func getSummaryAmount(bin: String?, amount: Double, issuerId: String?, paymentMethodId: String, payment_type_id: String, differentialPricingId: String?, siteId: String?, marketplace: String?, discountParamsConfiguration: PXDiscountParamsConfiguration?, payer: PXPayer, defaultInstallments: Int?, charges: [PXPaymentTypeChargeRule]?,  maxInstallments: Int?, callback: @escaping (PXSummaryAmount) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: PaymentService = PaymentService(baseURL: baseURL, merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken, processingModes: processingModes, branchId: branchId)
        service.getSummaryAmount(bin: bin, amount: amount, issuerId: issuerId, payment_method_id: paymentMethodId, payment_type_id: payment_type_id, differential_pricing_id: differentialPricingId, siteId: siteId, marketplace: marketplace, discountParamsConfiguration: discountParamsConfiguration, payer: payer, defaultInstallments: defaultInstallments, charges: charges, maxInstallments: maxInstallments, success: callback, failure: failure)
    }

    func getIssuers(paymentMethodId: String, bin: String? = nil, callback: @escaping ([PXIssuer]) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: PaymentService = PaymentService(baseURL: baseURL, merchantPublicKey: merchantPublicKey, payerAccessToken: payerAccessToken, processingModes: processingModes, branchId: branchId)
        service.getIssuers(payment_method_id: paymentMethodId, bin: bin, success: {(data: Data) -> Void in
            do {

                let jsonResponse = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)

                if let errorDic = jsonResponse as? NSDictionary {
                    if errorDic["error"] != nil {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure(PXError(domain: ApiDomain.GET_ISSUERS, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: errorDic as? [String: Any], apiException: apiException))
                    }
                } else {
                    var issuers : [PXIssuer] = [PXIssuer]()
                    issuers = try PXIssuer.fromJSON(data: data)
                    callback(issuers)
                }
            } catch {
                failure(PXError(domain: ApiDomain.GET_ISSUERS, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener los bancos"]))
            }
        }, failure: failure)
    }

    func getCustomer(url: String, uri: String, additionalInfo: [String: String]? = nil, callback: @escaping (PXCustomer) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: CustomService = CustomService(baseURL: url, URI: uri)

        var addInfo: String = ""
        if let additionalInfo = additionalInfo {
            let additionalInfoDic = additionalInfo as NSDictionary
            if !NSDictionary.isNullOrEmpty(additionalInfoDic) {
                addInfo = additionalInfoDic.parseToQuery()
            }
        }
        service.getCustomer(params: addInfo, success: callback, failure: failure)
    }

    func createCheckoutPreference(url: String, uri: String, bodyInfo: NSDictionary? = nil, callback: @escaping (PXCheckoutPreference) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        let service: CustomService = CustomService(baseURL: url, URI: uri)

        let body: Data?
        if let bodyInfo = bodyInfo {
            body = NSKeyedArchiver.archivedData(withRootObject: bodyInfo)
        } else {
            body = nil
        }

        service.createPreference(body: body, success: callback, failure: failure)
    }

    //SETS
    func setBaseURL(_ baseURL: String) {
        self.baseURL = baseURL
    }

    func setGatewayBaseURL(_ gatewayBaseURL: String) {
        self.gatewayBaseURL = gatewayBaseURL
    }

    func getGatewayURL() -> String {
        if !String.isNullOrEmpty(gatewayBaseURL) {
            return gatewayBaseURL
        }
        return baseURL
    }

    class func getParamsPublicKey(_ merchantPublicKey: String) -> String {
        var params: String = ""
        params.paramsAppend(key: ApiParam.PUBLIC_KEY, value: merchantPublicKey)
        return params
    }

    class func getParamsAccessToken(_ payerAccessToken: String?) -> String {
        var params: String = ""
        params.paramsAppend(key: ApiParam.PAYER_ACCESS_TOKEN, value: payerAccessToken)
        return params
    }

    class func getParamsPublicKeyAndAcessToken(_ merchantPublicKey: String, _ payerAccessToken: String?) -> String {
        var params: String = ""

        if !String.isNullOrEmpty(payerAccessToken) {
            params.paramsAppend(key: ApiParam.PAYER_ACCESS_TOKEN, value: payerAccessToken!)
        }
        params.paramsAppend(key: ApiParam.PUBLIC_KEY, value: merchantPublicKey)

        return params
    }

    class func getParamsAccessTokenAndPaymentIdsAndPlatform(_ payerAccessToken: String?, _ paymentIds: [String]?, _ platform: String?) -> String {
        var params: String = ""

        if let payerAccessToken = payerAccessToken, !payerAccessToken.isEmpty {
            params.paramsAppend(key: ApiParam.PAYER_ACCESS_TOKEN, value: payerAccessToken)
        }

        if let paymentIds = paymentIds, !paymentIds.isEmpty {
            var paymentIdsString = ""
            for (index, paymentId) in paymentIds.enumerated() {
                if index != 0 {
                    paymentIdsString.append(",")
                }
                paymentIdsString.append(paymentId)
            }
            params.paramsAppend(key: ApiParam.PAYMENT_IDS, value: paymentIdsString)
        }

        if let platform = platform {
            params.paramsAppend(key: ApiParam.PLATFORM, value: platform)
        }

        return params
    }

    func setLanguage(language: String) {
        self.language = language
    }
}
