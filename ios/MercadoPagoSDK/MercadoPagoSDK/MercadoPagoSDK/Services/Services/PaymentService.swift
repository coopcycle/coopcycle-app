//
//  PaymentService.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 30/12/14.
//  Copyright (c) 2014 com.mercadopago. All rights reserved.
//

import Foundation

internal class PaymentService: MercadoPagoService {

    let merchantPublicKey: String!
    let payerAccessToken: String?
    let processingModes: [String]
    let branchId: String?

    init (baseURL: String, merchantPublicKey: String, payerAccessToken: String? = nil, processingModes: [String], branchId: String?) {
        self.merchantPublicKey = merchantPublicKey
        self.payerAccessToken = payerAccessToken
        self.processingModes = processingModes
        self.branchId = branchId
        super.init(baseURL: baseURL)
    }
    
    open func getSummaryAmount(uri: String = PXServicesURLConfigs.MP_SUMMARY_AMOUNT_URI, bin: String?, amount: Double, issuerId: String?, payment_method_id: String, payment_type_id: String, differential_pricing_id: String?, siteId: String?, marketplace: String?, discountParamsConfiguration: PXDiscountParamsConfiguration?, payer: PXPayer, defaultInstallments: Int?, charges: [PXPaymentTypeChargeRule]?, maxInstallments: Int?, success: @escaping (PXSummaryAmount) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {

        let params: String = MercadoPagoServices.getParamsPublicKeyAndAcessToken(merchantPublicKey, payerAccessToken)
        let roundedAmount = PXAmountHelper.getRoundedAmountAsNsDecimalNumber(amount: amount)

        let body = PXSummaryAmountBody(siteId: siteId, transactionAmount: roundedAmount.stringValue, marketplace: marketplace, email: payer.email, productId: discountParamsConfiguration?.productId, paymentMethodId: payment_method_id, paymentType: payment_type_id, bin: bin, issuerId: issuerId, labels: discountParamsConfiguration?.labels, defaultInstallments: defaultInstallments, differentialPricingId: differential_pricing_id, processingModes: processingModes, branchId: branchId, charges: charges, maxInstallments: maxInstallments)
        let bodyJSON = try? body.toJSON()

        self.request( uri: uri, params: params, body: bodyJSON, method: HTTPMethod.post, cache: false, success: {(data: Data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)

                if let errorDic = jsonResult as? NSDictionary {
                    if errorDic["error"] != nil {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure(PXError(domain: ApiDomain.GET_SUMMARY_AMOUNT, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: errorDic["error"] as? String ?? "Unknowed Error"], apiException: apiException))

                    } else {
                        let summaryAmount = try PXSummaryAmount.fromJSON(data: data)
                        success(summaryAmount)
                    }
                }
            } catch {
                failure(PXError(domain: ApiDomain.GET_SUMMARY_AMOUNT, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener las cuotas"]))
            }
        }, failure: { (error) in
            failure(PXError(domain: ApiDomain.GET_SUMMARY_AMOUNT, code: error.code, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))

        })
    }

    open func getIssuers(uri: String = PXServicesURLConfigs.MP_ISSUERS_URI, payment_method_id: String, bin: String? = nil, success:  @escaping (_ data: Data) -> Void, failure: ((_ error: PXError) -> Void)?) {

        var params: String = MercadoPagoServices.getParamsPublicKeyAndAcessToken(merchantPublicKey, payerAccessToken)
        params.paramsAppend(key: ApiParam.PAYMENT_METHOD_ID, value: payment_method_id)
        params.paramsAppend(key: ApiParam.BIN, value: bin)

        if processingModes.count > 0 {
            var commaSeparatedModes = ""
            for mode in processingModes {
                let isFirstElement = mode == processingModes.first
                commaSeparatedModes += isFirstElement ? mode : ",\(mode)"
            }
            params.paramsAppend(key: ApiParam.PROCESSING_MODES, value: commaSeparatedModes)
        }

        self.request(uri: uri, params: params, body: nil, method: HTTPMethod.get, success: success, failure: { (error) in
            if let failure = failure {
                failure(PXError(domain: ApiDomain.GET_ISSUERS, code: error.code, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
            }
        })
    }

}
