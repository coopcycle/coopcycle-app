//
//  ApiException.swift
//  MercadoPagoSDK
//
//  Created by Mauro Reverter on 6/30/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class ApiException {

    open var cause: [Cause]?
    open var error: String?
    open var message: String?
    open var status: Int = 0
    open class func fromJSON(_ json: NSDictionary) -> ApiException {
        let apiException: ApiException = ApiException()
        if let status = JSONHandler.attemptParseToInt(json["status"]) {
            apiException.status = status
        }
        if let message = JSONHandler.attemptParseToString(json["message"]) {
            apiException.message = message
        }
        if let error = JSONHandler.attemptParseToString(json["error"]) {
            apiException.error = error
        }
        var cause: [Cause] = [Cause]()
        if let causeArray = json["cause"] as? NSArray {
            for index in 0..<causeArray.count {
                if let causeDic = causeArray[index] as? NSDictionary {
                    cause.append(Cause.fromJSON(causeDic))
                }
            }
        }
        apiException.cause = cause

        return apiException
    }
    func containsCause(code: String) -> Bool {
        if self.cause != nil {
            for currentCause in self.cause! where code == currentCause.code {
                return true
            }
        }
        return false
    }
}
