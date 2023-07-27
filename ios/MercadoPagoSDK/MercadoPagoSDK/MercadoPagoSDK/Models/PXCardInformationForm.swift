//
//  PXCardInformationForm.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 03/09/2018.
//

import Foundation

@objc
internal protocol PXCardInformationForm: NSObjectProtocol {

    func getCardBin() -> String?

    func getCardLastForDigits() -> String

    func isIssuerRequired() -> Bool

    func canBeClone() -> Bool
}
