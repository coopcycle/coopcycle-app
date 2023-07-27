//
//  PaymentMethodsUserService.swift
//  MercadoPagoSDK
//
//  Created by Diego Flores Domenech on 5/9/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PaymentMethodsUserService: MercadoPagoService {

    let uri = "/v1/px_mobile_api/payment_methods/cards"
    let accessToken: String
    let productId: String?

    init(accessToken: String, productId: String?) {
        self.accessToken = accessToken
        self.productId = productId
        super.init(baseURL: PXServicesURLConfigs.MP_API_BASE_URL)
    }

    func getPaymentMethods(success: @escaping ([PXPaymentMethod]) -> Void, failure: @escaping (PXError) -> Void) {

        var headers: [String: String] = [:]
        if let prodId = self.productId {
            headers[MercadoPagoService.HeaderField.productId.rawValue] = prodId
        }

        self.request(uri: uri, params: "access_token=\(accessToken)", body: nil, method: .get, headers: headers, success: { (data) in
            do {
                let paymentMethods = try JSONDecoder().decode([PXPaymentMethod].self, from: data)
                success(paymentMethods)
            } catch {
                let apiException = try? PXApiException.fromJSON(data: data)
                let dict = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any]
                failure(PXError(domain: "mercadopago.sdk.getPaymentMethods", code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: dict ?? [:], apiException: apiException))
            }
        }) { (_) in
            failure(PXError(domain: "mercadopago.sdk.PaymentMethodsUserService.getPaymentMethods", code: ErrorTypes.NO_INTERNET_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
        }
    }

}
