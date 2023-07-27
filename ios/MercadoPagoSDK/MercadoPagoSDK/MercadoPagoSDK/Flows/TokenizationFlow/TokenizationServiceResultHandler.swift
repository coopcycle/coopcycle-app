//
//  TokenizationServiceResultHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/04/2019.
//

import Foundation

internal protocol TokenizationServiceResultHandler: NSObjectProtocol {
    func finishFlow(token: PXToken)
    func finishWithESCError()
    func finishWithError(error: MPSDKError, securityCode: String?)
    func finishInvalidIdentificationNumber()
}
