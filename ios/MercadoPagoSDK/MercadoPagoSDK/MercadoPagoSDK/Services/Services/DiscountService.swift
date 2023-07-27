//
//  DiscountServices.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 12/26/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class DiscountService: MercadoPagoService {

    var URI: String

    init (baseURL: String, URI: String) {
        self.URI = URI
        super.init(baseURL: baseURL)
    }

    internal func getDiscount(publicKey: String, amount: Double, code: String? = nil, payerEmail: String?, additionalInfo: String? = nil, success: @escaping (_ discount: PXDiscount?) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        var params = "public_key=" + publicKey + "&transaction_amount=" + String(amount)

        if !String.isNullOrEmpty(payerEmail) {
            params += "&payer_email=" + payerEmail!
        }

        if let couponCode = code {
            params = params + "&coupon_code=" + String(couponCode).trimSpaces()
        }

        if !String.isNullOrEmpty(additionalInfo) {
            params += "&" + additionalInfo!
        }

        self.request(uri: self.URI, params: params, body: nil, method: HTTPMethod.get, cache: false, success: { (data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)

                if let discount = jsonResult as? NSDictionary {
                    if let error = discount["error"] {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure(PXError(domain: ApiDomain.GET_DISCOUNT, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: [NSLocalizedDescriptionKey: error], apiException: apiException))
                    } else {
                        let discount = try PXDiscount.fromJSON(data: data)
                        success(discount)
                    }
                }
            } catch {
                failure(PXError(domain: ApiDomain.GET_DISCOUNT, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener el descuento"]))
            }

        }, failure: { (_) -> Void in
            failure(PXError(domain: ApiDomain.GET_DISCOUNT, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
        })
    }

    open func getCampaigns(publicKey: String, payerEmail: String?, success: @escaping (_ discount: [PXCampaign]) -> Void, failure: @escaping ((_ error: PXError) -> Void)) {
        var params = "public_key=" + publicKey

        if let payerEmail = payerEmail {
            params += "&email=" + payerEmail
        }

        self.request(uri: self.URI, params: params, body: nil, method: HTTPMethod.get, cache: false, success: { (data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)
                if let errorDic = jsonResult as? NSDictionary {
                    if let error = errorDic["error"] {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure(PXError(domain: ApiDomain.GET_CAMPAIGNS, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: [NSLocalizedDescriptionKey: error], apiException: apiException))
                    }
                } else if ((jsonResult as? NSArray) != nil), let campaigns: [PXCampaign] = try? PXCampaign.fromJSON(data: data) {
                    success(campaigns)
                } else {
                    success([])
                }
            } catch {
                failure(PXError(domain: ApiDomain.GET_CAMPAIGNS, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener la campaña"]))
            }

        }, failure: { (_) -> Void in
            failure(PXError(domain: ApiDomain.GET_CAMPAIGNS, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
        })
    }
}
