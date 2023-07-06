//
//  GatewayService.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 29/12/14.
//  Copyright (c) 2014 com.mercadopago. All rights reserved.
//

import Foundation

internal class GatewayService: MercadoPagoService {
    let merchantPublicKey: String!
    let payerAccessToken: String?

    init (baseURL: String, merchantPublicKey: String, payerAccessToken: String? = nil) {
        self.merchantPublicKey = merchantPublicKey
        self.payerAccessToken = payerAccessToken
        super.init(baseURL: baseURL)
    }

    internal func getToken(_ url: String = PXServicesURLConfigs.MP_CREATE_TOKEN_URI, cardTokenJSON: Data, success: @escaping (_ data: Data) -> Void, failure:  ((_ error: PXError) -> Void)?) {

        let params: String = MercadoPagoServices.getParamsPublicKeyAndAcessToken(merchantPublicKey, payerAccessToken)

        self.request(uri: url, params: params, body: cardTokenJSON, method: HTTPMethod.post, success: success, failure: { (error) -> Void in
            if let failure = failure {
                failure(PXError(domain: ApiDomain.GET_TOKEN, code: error.code, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
            }
        })
    }

    internal func cloneToken(_ url: String = PXServicesURLConfigs.MP_CREATE_TOKEN_URI, public_key: String, tokenId: String, securityCode: String, success: @escaping (_ data: Data) -> Void, failure:  ((_ error: PXError) -> Void)?) {
        do {
            self.request(uri: url + "/" + tokenId + "/clone", params: "public_key=" + public_key, body: nil, method: HTTPMethod.post, success: { (data) in
                do {
                    let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)

                    var token : PXToken?
                    if let tokenDic = jsonResult as? NSDictionary {
                        if tokenDic["error"] == nil {
                            token = try PXToken.fromJSON(data: data)
                        } else {
                            let apiException = try PXApiException.fromJSON(data: data)
                            failure?(PXError(domain: ApiDomain.CLONE_TOKEN, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: tokenDic as? [String: Any], apiException: apiException))
                            return
                        }
                    }
                    let secCodeDic : [String: Any] = ["security_code": securityCode]
                    let jsonData = try JSONSerialization.data(withJSONObject: secCodeDic, options: .prettyPrinted)

                    self.request(uri: url + "/" + token!.id, params: "public_key=" + public_key, body: jsonData, method: HTTPMethod.put, success: success, failure: { (_) in
                        failure?(PXError(domain: ApiDomain.CLONE_TOKEN, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
                    })
                } catch {
                    failure?(PXError(domain: ApiDomain.CLONE_TOKEN, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido clonar el token"]))
                }

            }, failure: { (error) -> Void in
                if let failure = failure {
                    failure(PXError(domain: ApiDomain.CLONE_TOKEN, code: error.code, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
                }
            })
        }
    }
}
