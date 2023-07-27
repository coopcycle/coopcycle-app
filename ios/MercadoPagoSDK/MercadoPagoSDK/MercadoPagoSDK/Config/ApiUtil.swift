//
//  ApiUtil.swift
//  MercadoPagoSDK
//
//  Created by Mauro Reverter on 6/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class ApiUtil {
    enum StatusCodes: Int {
        case INTERNAL_SERVER_ERROR = 500
        case PROCESSING = 499
        case BAD_REQUEST = 400
        case NOT_FOUND = 404
        case OK = 200
    }
    enum ErrorCauseCodes: String {
        case INVALID_IDENTIFICATION_NUMBER = "324"
        case INVALID_ESC = "E216"
        case INVALID_FINGERPRINT = "E217"
        case INVALID_PAYMENT_WITH_ESC = "2107"
        case INVALID_PAYMENT_IDENTIFICATION_NUMBER = "2067"
    }

    enum RequestOrigin: String {
        case GET_PREFERENCE
        case GET_INIT
        case GET_INSTALLMENTS
        case GET_ISSUERS
        case GET_DIRECT_DISCOUNT
        case CREATE_PAYMENT
        case CREATE_TOKEN
        case GET_CUSTOMER
        case GET_CODE_DISCOUNT
        case GET_CAMPAIGNS
        case GET_PAYMENT_METHODS
        case GET_IDENTIFICATION_TYPES
        case GET_BANK_DEALS
        case GET_INSTRUCTIONS
        case ASSOCIATE_TOKEN
    }
}
