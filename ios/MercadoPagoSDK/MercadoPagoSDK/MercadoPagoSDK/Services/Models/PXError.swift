//
//  PXError.swift
//  MercadoPagoServices
//
//  Created by Eden Torres on 11/9/17.
//  Copyright © 2017 Mercado Pago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXError: NSError {
    open var type: String?
    open var apiException: PXApiException?

    public init(domain: String, code: Int, userInfo dict: [String: Any]? = nil, apiException: PXApiException? = nil) {
        super.init(domain: domain, code: code, userInfo: dict)
        self.apiException = apiException
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

/// :nodoc:
open class ErrorTypes: NSObject {
    static let API_UNKNOWN_ERROR = -3
    static let API_EXCEPTION_ERROR = -2
    static let NO_INTERNET_ERROR = -1
}
