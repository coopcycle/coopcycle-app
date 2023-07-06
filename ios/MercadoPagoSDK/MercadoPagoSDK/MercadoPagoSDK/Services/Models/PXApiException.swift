//
//  PXApiException.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXApiException: NSObject, Codable {

    static let CUSTOMER_NOT_ALLOWED_TO_OPERATE = "2021"
    static let COLLECTOR_NOT_ALLOWED_TO_OPERATE = "2022"
    static let INVALID_USERS_INVOLVED = "2035"
    static let CUSTOMER_EQUAL_TO_COLLECTOR = "3000"
    static let INVALID_CARD_HOLDER_NAME = "3001"
    static let UNAUTHORIZED_CLIENT = "3010"
    static let PAYMENT_METHOD_NOT_FOUND = "3012"
    static let INVALID_SECURITY_CODE = "3013"
    static let SECURITY_CODE_REQUIRED = "3014"
    static let INVALID_PAYMENT_METHOD = "3015"
    static let INVALID_CARD_NUMBER = "3017"
    static let EMPTY_EXPIRATION_MONTH = "3019"
    static let EMPTY_EXPIRATION_YEAR = "3020"
    static let EMPTY_CARD_HOLDER_NAME = "3021"
    static let EMPTY_DOCUMENT_NUMBER = "3022"
    static let EMPTY_DOCUMENT_TYPE = "3023"
    static let INVALID_PAYMENT_TYPE_ID = "3028"
    static let INVALID_PAYMENT_METHOD_ID = "3029"
    static let INVALID_CARD_EXPIRATION_MONTH = "3030"
    static let INVALID_CARD_EXPIRATION_YEAR = "4000"
    static let INVALID_PAYER_EMAIL = "4050"
    static let INVALID_PAYMENT_WITH_ESC = "2107"
    static let INVALID_IDENTIFICATION_NUMBER = "2067"
    static let INVALID_CARD_HOLDER_IDENTIFICATION_NUMBER = "324"
    static let INVALID_ESC = "E216"
    static let INVALID_FINGERPRINT = "E217"

    open var cause: [PXCause]?
    open var error: String?
    open var message: String?
    open var status: Int?

    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    open class func fromJSON(data: Data) throws -> PXApiException {
        return try JSONDecoder().decode(PXApiException.self, from: data)
    }

}
