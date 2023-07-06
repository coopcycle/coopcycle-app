//
//  CustomService.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 31/12/14.
//  Copyright (c) 2014 com.mercadopago. All rights reserved.
//

import Foundation

internal class CustomService: MercadoPagoService {

    open var data: NSMutableData = NSMutableData()
    
    var URI: String

    init (baseURL: String, URI: String) {
        self.URI = URI
        super.init(baseURL: baseURL)
    }

    internal func getCustomer(params: String, success: @escaping (_ jsonResult: PXCustomer) -> Void, failure: ((_ error: PXError) -> Void)?) {

        self.request(uri: self.URI, params: params, body: nil, method: HTTPMethod.get, cache: false, success: { (data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)
                if let custDic = jsonResult as? NSDictionary {
                    if custDic["error"] != nil {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure?(PXError(domain: ApiDomain.GET_CUSTOMER, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: custDic as? [String: Any], apiException: apiException))
                    } else {
                        let customer: PXCustomer = try PXCustomer.fromJSONToPXCustomer(data: data)
                        success(customer)
                    }
                } else {
                    failure?(PXError(domain: ApiDomain.GET_CUSTOMER, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: ["message": "Response cannot be decoded"]))
                }
            } catch {
                failure?(PXError(domain: ApiDomain.GET_CUSTOMER, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido obtener los customers"]))
            }
        }, failure: { (_) in
            failure?(PXError(domain: ApiDomain.GET_CUSTOMER, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: ["message": "Response cannot be decoded"]))
        })
    }

    internal func createPayment(headers: [String: String]? = nil, body: Data, params: String?, success: @escaping (_ jsonResult: PXPayment) -> Void, failure: ((_ error: PXError) -> Void)?) {

        self.request(uri: self.URI, params: params, body: body, method: HTTPMethod.post, headers: headers, cache: false, success: { (data: Data) -> Void in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)
                if let paymentDic = jsonResult as? NSDictionary {
                    if paymentDic["error"] != nil {
                        if paymentDic["status"] as? Int == ApiErrorCode.PROCESSING {
                            let inProcessPayment = PXPayment(id: 0, status: PXPayment.Status.IN_PROCESS)
                            inProcessPayment.status = PXPayment.Status.IN_PROCESS
                            inProcessPayment.statusDetail = PXPayment.StatusDetails.PENDING_CONTINGENCY
                            success(inProcessPayment)
                        } else {
                            let apiException = try PXApiException.fromJSON(data: data)
                            failure?(PXError(domain: ApiDomain.CREATE_PAYMENT, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: paymentDic as? [String: Any], apiException: apiException))
                        }
                    } else {
                        if paymentDic.allKeys.count > 0 {
                            let payment = try PXPayment.fromJSON(data: data)
                            success(payment)
                        } else {
                            failure?(PXError(domain: ApiDomain.CREATE_PAYMENT, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: ["message": "PAYMENT_ERROR"]))
                        }
                    }
                } else {
                    failure?(PXError(domain: ApiDomain.CREATE_PAYMENT, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: ["message": "Response cannot be decoded"]))
                }
            } catch {
                failure?(PXError(domain: ApiDomain.CREATE_PAYMENT, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido crear el pago"]))
            }
        }, failure: { (_) -> Void in
            if let failure = failure {
                failure(PXError(domain: ApiDomain.CREATE_PAYMENT, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
            }
        })
    }

    internal func getPointsAndDiscounts(headers: [String: String]? = nil, body: Data?, params: String?, success: @escaping (_ jsonResult: PXPointsAndDiscounts) -> Void, failure: (() -> Void)?) {

            self.request(uri: self.URI, params: params, body: body, method: HTTPMethod.get, headers: headers, cache: false, success: { (data: Data) -> Void in
                do {
                    let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)
                    if let pointsDic = jsonResult as? NSDictionary {
                        if pointsDic["error"] != nil {
                                failure?()
                        } else {
                            if pointsDic.allKeys.count > 0 {
                                let pointsAndDiscounts = try PXPointsAndDiscounts.fromJSON(data: data)
                                success(pointsAndDiscounts)
                            } else {
                                failure?()
                            }
                        }
                    } else {
                        failure?()
                    }
                } catch {
                    failure?()
                }
            }, failure: { (_) -> Void in
                if let failure = failure {
                    failure()
                }
            })
        }

    internal func createPreference(body: Data?, success: @escaping (_ jsonResult: PXCheckoutPreference) -> Void, failure: ((_ error: PXError) -> Void)?) {

        self.request(uri: self.URI, params: nil, body: body, method: HTTPMethod.post, cache: false, success: {
            (data) in
            do {
                let jsonResult = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)

                if let preferenceDic = jsonResult as? NSDictionary {
                    if preferenceDic["error"] != nil && failure != nil {
                        let apiException = try PXApiException.fromJSON(data: data)
                        failure!(PXError(domain: ApiDomain.CREATE_PREFERENCE, code: ErrorTypes.API_EXCEPTION_ERROR, userInfo: ["message": "PREFERENCE_ERROR"], apiException: apiException))
                    } else {
                        if preferenceDic.allKeys.count > 0 {
                            success(try PXCheckoutPreference.fromJSON(data: data))
                        } else {
                            failure?(PXError(domain: ApiDomain.CREATE_PREFERENCE, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: ["message": "PREFERENCE_ERROR"]))
                        }
                    }
                } else {
                    failure?(PXError(domain: ApiDomain.CREATE_PREFERENCE, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: ["message": "Response cannot be decoded"]))

                }} catch {
                    failure?(PXError(domain: ApiDomain.CREATE_PREFERENCE, code: ErrorTypes.API_UNKNOWN_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "No se ha podido crear la preferencia"]))
            }}, failure: { (_) in
                failure?(PXError(domain: ApiDomain.CREATE_PREFERENCE, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: ["message": "Response cannot be decoded"]))
        })
    }
}
